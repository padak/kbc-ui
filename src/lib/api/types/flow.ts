/**
 * Type definitions for Keboola Flows
 * Based on flow-spec.md specification
 */

export interface Phase {
  id: string;
  name: string;
  dependsOn: string[];
}

export interface Task {
  id: string;
  name: string;
  componentId: string;
  phase: string;
  task: {
    mode: string;
    configData: Record<string, unknown>;
  };
}

export interface FlowConfiguration {
  phases: Phase[];
  tasks: Task[];
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  configuration: FlowConfiguration;
  isDisabled: boolean;
  created: string;
  version: number;
}

export interface Component {
  id: string;
  name: string;
  type: 'extractor' | 'writer' | 'transformation' | 'application';
  icon?: {
    '32': string;
    '64': string;
  };
}

// API Request/Response Types

export interface GenerateFlowRequest {
  prompt: string;
  projectId?: string;
}

export interface GenerateFlowResponse {
  success: boolean;
  flow: {
    name: string;
    description: string;
    configuration: FlowConfiguration;
  };
  mermaid: string;
  components: Component[]; // Include component data with icons
  warnings?: string[];
  error?: string;
  details?: string;
}

export interface CreateFlowRequest {
  name: string;
  description: string;
  configuration: FlowConfiguration;
}

export interface CreateFlowResponse {
  id: string;
  name: string;
  description: string;
  configuration: FlowConfiguration;
  isDisabled: boolean;
  created: string;
  version: number;
}

export interface RunFlowRequest {
  component: string;
  config: string; // flow ID
  mode: string;
}

export interface RunFlowResponse {
  id: string; // job ID
  status: 'created' | 'processing' | 'success' | 'error';
  [key: string]: unknown;
}
