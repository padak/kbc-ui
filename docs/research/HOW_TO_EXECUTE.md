# How to Execute Agent Analysis

This guide explains how to run the 17 parallel agents to analyze the Keboola UI codebase.

## Prerequisites

- Access to Claude AI (via API, Claude Code, or web interface)
- Haiku model recommended for cost-effectiveness
- Access to the kbc-ui repository

## Option 1: Using Claude Code (Recommended)

Launch multiple Task agents in parallel:

```
Launch 17 agents in parallel using the prompts from AGENT_PROMPTS.md.
Each agent should analyze their assigned modules and output markdown files
to docs/02-modules/ (or appropriate directory).

Use Haiku model (claude-3-5-haiku) for all agents.
```

Then copy each prompt from AGENT_PROMPTS.md and launch them.

## Option 2: Using Claude API

Create a script to launch agents programmatically:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// For each agent prompt...
const response = await client.messages.create({
  model: 'claude-3-5-haiku-20241022',
  max_tokens: 8000,
  messages: [{
    role: 'user',
    content: agentPrompt
  }]
});

// Save response to appropriate .md file
```

## Option 3: Manual Execution

Run agents one at a time:

1. Open Claude interface
2. Copy prompt from AGENT_PROMPTS.md
3. Paste and execute
4. Save output to appropriate .md file in docs/02-modules/
5. Mark as complete in EXECUTION_TRACKER.md
6. Repeat for next agent

## Execution Strategy

### Phase 1: Launch All Agents (Parallel)
Launch all 17 agents simultaneously to maximize speed. Each agent works independently.

**Estimated time**: 5-10 minutes for all agents to complete (if parallel)

### Phase 2: Collect Results
Gather markdown files from each agent and save to appropriate directories:
- Module analysis → `docs/02-modules/`
- Component inventory → `docs/04-components/`
- API contracts → `docs/06-api-contracts/`

### Phase 3: Review & Consolidate
- Check all files are present (use EXECUTION_TRACKER.md)
- Review for completeness
- Identify gaps or areas needing deeper analysis
- Create cross-references between modules

### Phase 4: Synthesis
Create summary documents:
- `docs/01-overview/architecture.md` - Synthesize overall architecture
- `docs/01-overview/tech-stack.md` - Technology inventory
- `docs/01-overview/module-map.md` - Module dependency graph

## Output Locations

| Agent Group | Output Directory |
|-------------|------------------|
| Agents 1-15 | `docs/02-modules/` |
| Agent 16 | `docs/04-components/` |
| Agent 17 | `docs/06-api-contracts/` |

## Quality Checklist

For each module analysis, ensure it includes:
- [ ] Overview section
- [ ] File structure
- [ ] Routes table
- [ ] Key components documented
- [ ] API endpoints listed
- [ ] State management approach identified
- [ ] Dependencies listed
- [ ] User-facing features described
- [ ] Technical debt noted

## After Agent Execution

1. Update EXECUTION_TRACKER.md with completion status
2. Review all generated files
3. Identify modules that need deeper analysis
4. Prepare for Phase 3: Playwright UI exploration
5. Start drafting migration plan based on findings

## Troubleshooting

**Agent returns incomplete analysis:**
- Increase max_tokens
- Split module into smaller chunks
- Re-run with more specific focus

**Agent can't find module:**
- Verify module exists in `apps/kbc-ui/src/scripts/modules/`
- Check for typos in module name
- Module might have been removed or renamed

**Output too verbose:**
- Ask agent to focus on key components only
- Request summary format for complex modules

## Next Steps

After completing code analysis:
1. Proceed to Playwright UI exploration (docs/05-workflows/)
2. Take screenshots (docs/08-screenshots/)
3. Document user workflows
4. Create migration plan (docs/09-migration-plan/)
