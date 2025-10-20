/**
 * ConfigSummary Component
 *
 * Displays flow configuration details below the Mermaid diagram.
 * Shows phases, tasks, validation warnings in a collapsible accordion.
 *
 * Based on: /docs/build-specs/flow-spec.md (lines 420-450)
 */

'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Copy,
  ChevronDown,
  Database,
  Cog,
  FileText,
  Package,
  Workflow,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { FlowConfiguration, Component, Phase } from '@/lib/api/flows';

// ============================================================================
// TYPES
// ============================================================================

export interface ConfigSummaryProps {
  /** Flow configuration with phases and tasks */
  configuration: FlowConfiguration;

  /** Available components in project (for validation and icons) */
  components?: Component[];

  /** AI validation warnings (e.g., missing components) */
  warnings?: string[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get Lucide icon component based on phase name/type
 */
function getPhaseIconComponent(phaseName: string) {
  const lowerName = phaseName.toLowerCase();

  if (lowerName.includes('extract') || lowerName.includes('source')) return Database;
  if (lowerName.includes('transform') || lowerName.includes('process')) return Cog;
  if (lowerName.includes('load') || lowerName.includes('write')) return Package;
  if (lowerName.includes('validate') || lowerName.includes('check')) return CheckCircle2;
  if (lowerName.includes('notify') || lowerName.includes('alert')) return AlertTriangle;

  return FileText; // Default
}

/**
 * Get icon component based on component ID
 */
function getComponentIcon(componentId: string) {
  if (componentId.startsWith('keboola.ex-')) return Database;
  if (componentId.startsWith('keboola.wr-')) return Package;
  if (componentId.includes('transformation')) return Cog;
  if (componentId.includes('flow')) return Workflow;
  return FileText;
}

/**
 * Copy text to clipboard and show toast notification
 */
async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    // In production, use a toast library (e.g., sonner)
    console.log('Copied to clipboard:', text);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

/**
 * Get component name from components list
 */
function getComponentName(componentId: string, components?: Component[]): string {
  if (!components) return componentId;

  const component = components.find((c) => c.id === componentId);
  return component?.name || componentId;
}

/**
 * Get component icon URL from components list
 * Returns the 32x32 size if available
 */
function getComponentIconUrl(componentId: string, components?: Component[]): string | undefined {
  if (!components) return undefined;

  const component = components.find((c) => c.id === componentId);
  const iconUrl = component?.icon?.[32] || component?.icon?.[64];

  // Log to help debug icon loading
  if (!iconUrl && component) {
    console.log(`[ConfigSummary] No icon URL for component: ${componentId}`, {
      hasIcon: !!component.icon,
      icon: component.icon,
    });
  }

  return iconUrl;
}

/**
 * Count tasks in a phase
 */
function getPhaseTaskCount(phaseId: string, configuration: FlowConfiguration): number {
  return configuration.tasks.filter((task) => task.phase === phaseId).length;
}

/**
 * Get phase name by ID
 */
function getPhaseName(phaseId: string, configuration: FlowConfiguration): string {
  const phase = configuration.phases.find((p) => p.id === phaseId);
  return phase?.name || phaseId;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ConfigSummary({
  configuration,
  components,
  warnings = [],
}: ConfigSummaryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [failedIconIds, setFailedIconIds] = useState<Set<string>>(new Set());

  // Count total tasks
  const totalTasks = configuration.tasks.length;

  // Check if all components are available
  const allComponentsAvailable = components
    ? configuration.tasks.every((task) =>
        components.some((c) => c.id === task.componentId)
      )
    : false;

  // Handle copy with visual feedback
  const handleCopy = async (text: string, id: string) => {
    await copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="config-details" className="border rounded-lg">
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className="flex items-center gap-2">
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            <span className="text-sm font-semibold">View Configuration Details</span>
            <Badge variant="secondary" className="ml-2">
              {configuration.phases.length} phases, {totalTasks} tasks
            </Badge>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 pt-2">
          <div className="space-y-6">
            {/* Phases Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Phases</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {configuration.phases.map((phase) => (
                  <PhaseCard
                    key={phase.id}
                    phase={phase}
                    taskCount={getPhaseTaskCount(phase.id, configuration)}
                    configuration={configuration}
                  />
                ))}
              </div>
            </div>

            {/* Tasks Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Tasks</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[35%]">Component</TableHead>
                      <TableHead className="w-[35%]">Component ID</TableHead>
                      <TableHead className="w-[15%]">Config</TableHead>
                      <TableHead className="w-[15%]">Phase</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {configuration.tasks.map((task) => {
                      const Icon = getComponentIcon(task.componentId);
                      const componentName = getComponentName(task.componentId, components);
                      const componentIconUrl = getComponentIconUrl(task.componentId, components);
                      const phaseName = getPhaseName(task.phase, configuration);
                      const showFallbackIcon = !componentIconUrl || failedIconIds.has(task.id);

                      const handleImageError = () => {
                        setFailedIconIds((prev) => new Set([...prev, task.id]));
                      };

                      return (
                        <TableRow
                          key={task.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* Component Name + Icon */}
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {!showFallbackIcon && componentIconUrl && (
                                // Use actual component icon from API
                                <img
                                  src={componentIconUrl}
                                  alt={componentName}
                                  className="h-6 w-6 shrink-0 object-contain"
                                  onError={handleImageError}
                                />
                              )}
                              {showFallbackIcon && (
                                <Icon className="h-5 w-5 text-gray-500 shrink-0" />
                              )}
                              <span className="truncate">{task.name || componentName}</span>
                            </div>
                          </TableCell>

                          {/* Component ID (copyable) */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-1 truncate">
                                {task.componentId}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-gray-200"
                                onClick={() => handleCopy(task.componentId, task.id)}
                                title="Copy component ID"
                              >
                                <Copy
                                  className={`h-3 w-3 ${
                                    copiedId === task.id
                                      ? 'text-green-600'
                                      : 'text-gray-500'
                                  }`}
                                />
                              </Button>
                            </div>
                          </TableCell>

                          {/* Configuration Status */}
                          <TableCell>
                            {task.configId ? (
                              <Badge variant="outline" className="text-xs">
                                Existing
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                New config
                              </Badge>
                            )}
                          </TableCell>

                          {/* Phase Assignment */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const PhaseIcon = getPhaseIconComponent(phaseName);
                                return <PhaseIcon className="h-4 w-4 text-gray-600" />;
                              })()}
                              <Badge
                                variant="outline"
                                className="text-xs whitespace-nowrap"
                              >
                                {phaseName}
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Warnings Section */}
            {warnings.length > 0 && (
              <div>
                <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold text-yellow-900">
                        {warnings.length} {warnings.length === 1 ? 'Warning' : 'Warnings'}
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                        {warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Validation Section */}
            <div>
              {allComponentsAvailable && components ? (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">
                    All components are available in your project
                  </span>
                </div>
              ) : warnings.length > 0 ? (
                <div className="flex items-center gap-2 text-yellow-600 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">
                    {warnings.length} {warnings.length === 1 ? 'warning' : 'warnings'}{' '}
                    detected
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * PhaseCard - Individual phase card in the grid
 */
function PhaseCard({
  phase,
  taskCount,
  configuration,
}: {
  phase: Phase;
  taskCount: number;
  configuration: FlowConfiguration;
}) {
  const PhaseIcon = getPhaseIconComponent(phase.name);

  // Get dependency phase names
  const dependencyNames = phase.dependsOn.map((depId) => {
    const depPhase = configuration.phases.find((p) => p.id === depId);
    return depPhase?.name || depId;
  });

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Phase Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <PhaseIcon className="h-5 w-5 text-gray-700 shrink-0" />
          <h4 className="font-semibold text-sm">{phase.name}</h4>
        </div>
        <Badge variant="secondary" className="text-xs">
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
        </Badge>
      </div>

      {/* Dependencies */}
      {phase.dependsOn.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Depends on:</p>
          <div className="space-y-1">
            {dependencyNames.map((depName, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                <span>{depName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Dependencies */}
      {phase.dependsOn.length === 0 && (
        <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
          Runs first (no dependencies)
        </p>
      )}
    </div>
  );
}
