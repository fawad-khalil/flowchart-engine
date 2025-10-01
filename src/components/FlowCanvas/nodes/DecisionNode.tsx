import { Handle, Position } from 'reactflow';
import { GitBranch } from 'lucide-react';
import { WorkflowNode } from '@/types/workflow';

interface DecisionNodeProps {
  data: WorkflowNode;
  selected: boolean;
}

export const DecisionNode = ({ data, selected }: DecisionNodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-md border-2 transition-all bg-card cursor-pointer ${
        selected ? 'border-warning ring-2 ring-warning/20' : 'border-warning/30'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-warning" />
      <Handle type="source" position={Position.Right} id="a" className="!bg-warning !top-[30%]" />
      <Handle type="source" position={Position.Right} id="b" className="!bg-warning !top-[70%]" />
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-md bg-warning/10">
          <GitBranch className="w-4 h-4 text-warning" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-medium">DECISION</div>
          <div className="text-sm font-semibold">{data.label}</div>
        </div>
      </div>
    </div>
  );
};
