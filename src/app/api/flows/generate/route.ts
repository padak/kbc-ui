import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import {
  Component,
  FlowConfiguration,
  GenerateFlowRequest,
  GenerateFlowResponse,
  Phase,
  Task,
} from '@/lib/api/types/flow';

// Internal type for Claude response (before Mermaid generation)
interface GeneratedFlowConfig {
  name: string;
  description: string;
  phases: Phase[];
  tasks: Task[];
}

/**
 * Fetch available components from Keboola Storage API
 */
async function fetchComponents(token: string, stackUrl: string): Promise<Component[]> {
  try {
    const response = await fetch(`${stackUrl}/v2/storage/components`, {
      headers: {
        'X-StorageApi-Token': token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch components: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform API response to our Component format
    // Keboola API returns icons as ico32, ico64, ico128
    // We transform them to our expected icon format
    const transformedComponents: Component[] = data.map((c: any) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      icon: c.ico32 || c.ico64 || c.ico128
        ? {
            '32': c.ico32,
            '64': c.ico64,
          }
        : undefined,
    }));

    // Log sample component to verify transformation
    if (transformedComponents && transformedComponents.length > 0) {
      console.log('[Components API] Transformed component:', JSON.stringify(transformedComponents[0], null, 2));
      console.log('[Components API] Total components:', transformedComponents.length);
      console.log('[Components API] First component has icon?', !!transformedComponents[0].icon);
    }

    return transformedComponents;
  } catch (error) {
    console.error('Error fetching components:', error);
    throw new Error('Failed to fetch available components from Keboola API');
  }
}

/**
 * Validate that all components used in tasks exist in available components
 */
function validateComponents(tasks: Task[], availableComponents: Component[]): string[] {
  const warnings: string[] = [];
  const componentIds = new Set(availableComponents.map((c) => c.id));

  for (const task of tasks) {
    if (!componentIds.has(task.componentId)) {
      warnings.push(
        `Component "${task.componentId}" used in task "${task.name}" is not available in this project`
      );
    }
  }

  return warnings;
}

/**
 * Get component type label for Mermaid (clean text, no emojis)
 * Color coding is handled by CSS classes in the diagram
 */
function getComponentTypeLabel(componentId: string, components: Component[]): string {
  const component = components.find((c) => c.id === componentId);

  if (!component) return 'Component';

  // Use component type as label - will be color-coded by classDef
  switch (component.type) {
    case 'extractor':
      return 'Extract';
    case 'transformation':
      return 'Transform';
    case 'writer':
      return 'Load';
    case 'application':
      return 'App';
    default:
      return 'Task';
  }
}

/**
 * Generate detailed Mermaid diagram from flow configuration
 */
function generateMermaidDiagram(
  flow: GeneratedFlowConfig,
  components: Component[]
): string {
  const { phases, tasks } = flow;

  // Start with theme configuration (enable Font Awesome)
  let mermaid = `%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#EBF5FF','primaryTextColor':'#1F2937','primaryBorderColor':'#3B82F6','lineColor':'#6B7280','secondaryColor':'#F3F4F6','tertiaryColor':'#FEF3C7'}, 'fontFamily': 'sans-serif'}}%%\n\n`;
  mermaid += `graph TB\n`;

  // Group tasks by phase
  const tasksByPhase = new Map<string, Task[]>();
  for (const task of tasks) {
    const phaseTasks = tasksByPhase.get(task.phase) || [];
    phaseTasks.push(task);
    tasksByPhase.set(task.phase, phaseTasks);
  }

  // Generate subgraphs for each phase (clean labels, no emojis)
  phases.forEach((phase, index) => {
    mermaid += `  subgraph Phase${index + 1}["Phase ${index + 1}: ${phase.name}"]\n`;

    const phaseTasks = tasksByPhase.get(phase.id) || [];
    phaseTasks.forEach((task) => {
      const typeLabel = getComponentTypeLabel(task.componentId, components);
      const nodeId = task.id.replace(/[^a-zA-Z0-9]/g, '');

      // Clean node format: task name with component type and ID
      // Color coding is applied via CSS classes below
      mermaid += `    ${nodeId}["${task.name}<br/><small>${typeLabel} • ${task.componentId}</small>"]\n`;
    });

    mermaid += `  end\n\n`;
  });

  // Generate connections between tasks
  // Simple linear flow for now (can be enhanced based on phase dependencies)
  const allTasks = tasks.map((t) => t.id.replace(/[^a-zA-Z0-9]/g, ''));
  for (let i = 0; i < allTasks.length - 1; i++) {
    const label = i === 0 ? 'Data Flow' : 'Processed Data';
    mermaid += `  ${allTasks[i]} -->|${label}| ${allTasks[i + 1]}\n`;
  }

  // Add styling classes based on component types (matching Keboola design system)
  mermaid += '\n';
  mermaid += `  classDef extractClass fill:#E0F2FE,stroke:#1F8FFF,stroke-width:2px,color:#003d7a\n`; // Keboola blue
  mermaid += `  classDef transformClass fill:#F3E8FF,stroke:#A855F7,stroke-width:2px,color:#4C0519\n`; // AI Purple
  mermaid += `  classDef loadClass fill:#DCFCE7,stroke:#10B981,stroke-width:2px,color:#15803D\n`; // Success green
  mermaid += `  classDef appClass fill:#FEF3C7,stroke:#F59E0B,stroke-width:2px,color:#78350F\n\n`; // Amber/warning

  // Apply classes to nodes
  tasks.forEach((task) => {
    const component = components.find((c) => c.id === task.componentId);
    const nodeId = task.id.replace(/[^a-zA-Z0-9]/g, '');

    if (component) {
      switch (component.type) {
        case 'extractor':
          mermaid += `  class ${nodeId} extractClass\n`;
          break;
        case 'transformation':
          mermaid += `  class ${nodeId} transformClass\n`;
          break;
        case 'writer':
          mermaid += `  class ${nodeId} loadClass\n`;
          break;
        case 'application':
          mermaid += `  class ${nodeId} appClass\n`;
          break;
      }
    }
  });

  return mermaid;
}

/**
 * POST /api/flows/generate
 *
 * Generate a Keboola flow configuration from natural language prompt using Claude AI.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Extract request data
    const body = await request.json() as GenerateFlowRequest;
    const { prompt, projectId } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return Response.json(
        { success: false, error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // 2. Get authentication from headers
    const token = request.headers.get('X-StorageApi-Token');
    const stackUrl = request.headers.get('X-Stack-Url');

    if (!token || !stackUrl) {
      return Response.json(
        { success: false, error: 'Authentication required: X-StorageApi-Token and X-Stack-Url headers must be provided' },
        { status: 401 }
      );
    }

    // 3. Validate Anthropic API key and model
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY environment variable is not set');
      return Response.json(
        { success: false, error: 'AI service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Allow model configuration via environment variable
    // Default to claude-3-5-sonnet-20241022 (deprecated Oct 2025, upgrade recommended)
    // Recommended: claude-3-5-sonnet-20250219 or latest available
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

    // 4. Fetch available components from Keboola API
    let components: Component[];
    try {
      components = await fetchComponents(token, stackUrl);
    } catch (error) {
      console.error('Failed to fetch components:', error);
      return Response.json(
        {
          success: false,
          error: 'Failed to fetch available components from Keboola API',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }

    // 5. Build system prompt with available components (simplified to reduce tokens)
    // Only send component IDs and names, no icons or extra metadata
    const componentsList = components
      .map((c) => `- ${c.id} (${c.name}) [${c.type}]`)
      .join('\n');

    const systemPrompt = `You are a Keboola data pipeline expert. Your job is to generate valid flow configurations from user descriptions.

Available components in this project:
${componentsList}

IMPORTANT: Only use component IDs that exist in the available components list above.

When generating a flow, you MUST return ONLY valid JSON with this exact structure:
{
  "name": "Short descriptive flow name (e.g., 'Google Sheets to Snowflake')",
  "description": "The user's original prompt/description",
  "phases": [
    {
      "id": "phase-1",
      "name": "Extract" (or "Transform" or "Load" or "Process"),
      "dependsOn": []
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "name": "Descriptive task name",
      "componentId": "exact.component.id.from.available.list",
      "phase": "phase-1",
      "task": {
        "mode": "run",
        "configData": {}
      }
    }
  ]
}

Guidelines:
- Use descriptive phase names: Extract, Transform, Load, Process, etc.
- Each task must reference a valid componentId from the available components
- Phase IDs should be: phase-1, phase-2, phase-3, etc.
- Task IDs should be: task-1, task-2, task-3, etc.
- Phases should have logical dependencies (e.g., phase-2 depends on phase-1)
- Tasks should be grouped into appropriate phases
- Keep configData empty {} (will be configured later)
- Return ONLY the JSON object, no markdown code blocks or additional text

Common pipeline patterns:
- Extract → Transform → Load (ETL)
- Extract → Load (EL, transformation in destination)
- Extract → Multiple Transformations → Load
- Multiple Extractors → Merge → Transform → Multiple Writers`;

    // 6. Call Claude API
    console.log(`[AI Generation] Components: ${components.length}, System prompt length: ${systemPrompt.length} chars, User prompt: "${prompt.substring(0, 100)}..."`);

    const anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    });

    let claudeResponse: Anthropic.Message;
    try {
      claudeResponse = await anthropic.messages.create({
        model: model,
        max_tokens: 2500, // Sufficient for complex flows with 10+ tasks
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });
    } catch (error) {
      console.error('Claude API error:', error);
      return Response.json(
        {
          success: false,
          error: 'AI generation failed. Please try again.',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }

    // Log token usage
    console.log(`[AI Generation] Tokens used - Input: ${claudeResponse.usage.input_tokens}, Output: ${claudeResponse.usage.output_tokens}, Total: ${claudeResponse.usage.input_tokens + claudeResponse.usage.output_tokens}`);

    // 7. Parse Claude response
    const responseText = claudeResponse.content[0].type === 'text'
      ? claudeResponse.content[0].text
      : '';

    if (!responseText) {
      return Response.json(
        { success: false, error: 'AI returned empty response' },
        { status: 500 }
      );
    }

    let flowConfig: GeneratedFlowConfig;
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = responseText
        .replace(/```json\n/g, '')
        .replace(/```\n/g, '')
        .replace(/```/g, '')
        .trim();

      // Check for incomplete JSON (incomplete string or missing closing braces)
      if (cleanedResponse.includes('"componentId": "keboola.wr-google-bigquery-v"') && !cleanedResponse.endsWith('}')) {
        // Likely incomplete - response was cut off
        throw new Error('Response was truncated - flow is too complex. Try with fewer tasks or simpler components.');
      }

      // Try to fix incomplete JSON by adding missing closing brackets if needed
      if (!cleanedResponse.endsWith('}')) {
        const openBraces = (cleanedResponse.match(/{/g) || []).length;
        const closeBraces = (cleanedResponse.match(/}/g) || []).length;
        const missingBraces = openBraces - closeBraces;
        if (missingBraces > 0) {
          cleanedResponse += '}'.repeat(missingBraces);
        }
      }

      flowConfig = JSON.parse(cleanedResponse);

      // Validate structure
      if (!flowConfig.name || !flowConfig.description || !flowConfig.phases || !flowConfig.tasks) {
        throw new Error('Invalid flow configuration structure');
      }
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
      console.error('Response text (last 500 chars):', responseText.slice(-500));
      return Response.json(
        {
          success: false,
          error: 'Failed to parse AI response. Please try again or simplify your request.',
          details: error instanceof Error ? error.message : 'Invalid JSON',
        },
        { status: 500 }
      );
    }

    // 8. Validate components exist
    const warnings = validateComponents(flowConfig.tasks, components);

    // 9. Generate detailed Mermaid diagram
    const mermaid = generateMermaidDiagram(flowConfig, components);

    // 10. Return successful response (including components with icons)
    const response: GenerateFlowResponse = {
      success: true,
      flow: {
        name: flowConfig.name,
        description: flowConfig.description,
        configuration: {
          phases: flowConfig.phases,
          tasks: flowConfig.tasks,
        },
      },
      mermaid,
      components, // Include components with their icons for UI display
      warnings: warnings.length > 0 ? warnings : undefined,
    };

    return Response.json(response, { status: 200 });

  } catch (error) {
    console.error('Unexpected error in flow generation:', error);
    return Response.json(
      {
        success: false,
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-StorageApi-Token, X-Stack-Url',
    },
  });
}
