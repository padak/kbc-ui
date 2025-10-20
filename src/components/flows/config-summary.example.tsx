/**
 * ConfigSummary Component - Usage Examples
 *
 * This file demonstrates how to use the ConfigSummary component
 * in different scenarios with example data.
 */

import ConfigSummary from './config-summary';
import type { FlowConfiguration, Component } from '@/lib/api/flows';

// ============================================================================
// EXAMPLE DATA
// ============================================================================

/**
 * Example 1: Simple 3-phase ETL flow
 * Extract → Transform → Load
 */
const exampleConfig1: FlowConfiguration = {
  phases: [
    {
      id: 'phase-1-extract',
      name: 'Extract Data',
      dependsOn: [],
    },
    {
      id: 'phase-2-transform',
      name: 'Transform Data',
      dependsOn: ['phase-1-extract'],
    },
    {
      id: 'phase-3-load',
      name: 'Load to Warehouse',
      dependsOn: ['phase-2-transform'],
    },
  ],
  tasks: [
    {
      id: 'task-1',
      name: 'Google Sheets Extractor',
      componentId: 'keboola.ex-google-sheets',
      phase: 'phase-1-extract',
      task: {
        mode: 'run',
        configData: {},
      },
    },
    {
      id: 'task-2',
      name: 'dbt Transformation',
      componentId: 'keboola.dbt-transformation',
      phase: 'phase-2-transform',
      task: {
        mode: 'run',
        configData: {},
      },
    },
    {
      id: 'task-3',
      name: 'Snowflake Writer',
      componentId: 'keboola.wr-snowflake',
      phase: 'phase-3-load',
      task: {
        mode: 'run',
        configData: {},
      },
    },
  ],
};

/**
 * Example 2: Complex multi-source flow with parallel extraction
 */
const exampleConfig2: FlowConfiguration = {
  phases: [
    {
      id: 'phase-1-extract',
      name: 'Extract from Multiple Sources',
      dependsOn: [],
    },
    {
      id: 'phase-2-validate',
      name: 'Validate & Clean',
      dependsOn: ['phase-1-extract'],
    },
    {
      id: 'phase-3-transform',
      name: 'Transform & Enrich',
      dependsOn: ['phase-2-validate'],
    },
    {
      id: 'phase-4-load',
      name: 'Load to Destinations',
      dependsOn: ['phase-3-transform'],
    },
  ],
  tasks: [
    // Phase 1: Multiple extractors (run in parallel)
    {
      id: 'task-sheets',
      name: 'Google Sheets',
      componentId: 'keboola.ex-google-sheets',
      phase: 'phase-1-extract',
      task: { mode: 'run' },
    },
    {
      id: 'task-salesforce',
      name: 'Salesforce CRM',
      componentId: 'keboola.ex-salesforce',
      phase: 'phase-1-extract',
      task: { mode: 'run' },
    },
    {
      id: 'task-postgres',
      name: 'PostgreSQL Database',
      componentId: 'keboola.ex-db-pgsql',
      phase: 'phase-1-extract',
      task: { mode: 'run' },
    },
    // Phase 2: Validation
    {
      id: 'task-validate',
      name: 'Data Quality Check',
      componentId: 'keboola.python-transformation',
      configId: 'existing-config-123', // Using existing config
      phase: 'phase-2-validate',
      task: { mode: 'run' },
    },
    // Phase 3: Transformation
    {
      id: 'task-dbt',
      name: 'dbt Models',
      componentId: 'keboola.dbt-transformation',
      phase: 'phase-3-transform',
      task: { mode: 'run' },
    },
    // Phase 4: Multiple writers
    {
      id: 'task-snowflake',
      name: 'Snowflake DWH',
      componentId: 'keboola.wr-snowflake',
      phase: 'phase-4-load',
      task: { mode: 'run' },
    },
    {
      id: 'task-bigquery',
      name: 'BigQuery Analytics',
      componentId: 'keboola.wr-google-bigquery-v2',
      phase: 'phase-4-load',
      task: { mode: 'run' },
    },
  ],
};

/**
 * Example component list (for validation and display)
 */
const exampleComponents: Component[] = [
  {
    id: 'keboola.ex-google-sheets',
    name: 'Google Sheets',
    type: 'extractor',
    icon: {
      32: 'https://cdn.keboola.com/icons/sheets-32.png',
      64: 'https://cdn.keboola.com/icons/sheets-64.png',
    },
  },
  {
    id: 'keboola.dbt-transformation',
    name: 'dbt Transformation',
    type: 'transformation',
    icon: {
      32: 'https://cdn.keboola.com/icons/dbt-32.png',
      64: 'https://cdn.keboola.com/icons/dbt-64.png',
    },
  },
  {
    id: 'keboola.wr-snowflake',
    name: 'Snowflake',
    type: 'writer',
    icon: {
      32: 'https://cdn.keboola.com/icons/snowflake-32.png',
      64: 'https://cdn.keboola.com/icons/snowflake-64.png',
    },
  },
  {
    id: 'keboola.ex-salesforce',
    name: 'Salesforce',
    type: 'extractor',
    icon: {
      32: 'https://cdn.keboola.com/icons/salesforce-32.png',
      64: 'https://cdn.keboola.com/icons/salesforce-64.png',
    },
  },
  {
    id: 'keboola.ex-db-pgsql',
    name: 'PostgreSQL',
    type: 'extractor',
    icon: {
      32: 'https://cdn.keboola.com/icons/postgres-32.png',
      64: 'https://cdn.keboola.com/icons/postgres-64.png',
    },
  },
  {
    id: 'keboola.python-transformation',
    name: 'Python Transformation',
    type: 'transformation',
    icon: {
      32: 'https://cdn.keboola.com/icons/python-32.png',
      64: 'https://cdn.keboola.com/icons/python-64.png',
    },
  },
  {
    id: 'keboola.wr-google-bigquery-v2',
    name: 'Google BigQuery',
    type: 'writer',
    icon: {
      32: 'https://cdn.keboola.com/icons/bigquery-32.png',
      64: 'https://cdn.keboola.com/icons/bigquery-64.png',
    },
  },
];

/**
 * Example warnings (AI validation)
 */
const exampleWarnings = [
  'Component "keboola.ex-google-sheets" is not installed in your project. You will need to install it before running this flow.',
  'Task "Google Sheets Extractor" has no configuration. A new config will be created when you save this flow.',
];

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example 1: Basic usage with simple flow (no warnings)
 */
export function Example1_BasicUsage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Example 1: Basic ETL Flow</h2>
      <ConfigSummary
        configuration={exampleConfig1}
        components={exampleComponents}
      />
    </div>
  );
}

/**
 * Example 2: Complex flow with warnings
 */
export function Example2_WithWarnings() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Example 2: Multi-Source Flow (with warnings)
      </h2>
      <ConfigSummary
        configuration={exampleConfig2}
        components={exampleComponents}
        warnings={exampleWarnings}
      />
    </div>
  );
}

/**
 * Example 3: Without component list (validation disabled)
 */
export function Example3_NoComponentList() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Example 3: Without Component List (Validation Disabled)
      </h2>
      <ConfigSummary configuration={exampleConfig1} />
    </div>
  );
}

/**
 * Example 4: Real-world integration example
 * Shows how to use ConfigSummary with API data
 */
export function Example4_RealWorldIntegration() {
  // In a real app, you would fetch this data from your API
  // using TanStack Query or similar

  // Example query:
  // const { data: flow } = useFlow(flowId);
  // const { data: components } = useComponents();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Example 4: Real Integration</h2>

      {/* Mermaid Diagram would go here */}
      <div className="bg-gray-100 border rounded-lg p-8 mb-4 text-center">
        <p className="text-gray-500">
          [Mermaid Diagram Component Would Render Here]
        </p>
      </div>

      {/* Config Summary below diagram */}
      <ConfigSummary
        configuration={exampleConfig2}
        components={exampleComponents}
        warnings={exampleWarnings}
      />
    </div>
  );
}

/**
 * Default export: All examples in one page
 */
export default function ConfigSummaryExamples() {
  return (
    <div className="space-y-12 pb-12">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h1 className="text-3xl font-bold mb-2">ConfigSummary Component Examples</h1>
        <p className="text-gray-600">
          Demonstrates the ConfigSummary component in different scenarios.
          See the code for implementation details.
        </p>
      </div>

      <Example1_BasicUsage />
      <hr className="my-12" />

      <Example2_WithWarnings />
      <hr className="my-12" />

      <Example3_NoComponentList />
      <hr className="my-12" />

      <Example4_RealWorldIntegration />
    </div>
  );
}
