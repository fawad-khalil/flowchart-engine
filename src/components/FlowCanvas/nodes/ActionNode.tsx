import { Handle, Position } from 'reactflow';
import { Settings } from 'lucide-react';
import { WorkflowNode } from '@/types/workflow';

interface ActionNodeProps {
  data: WorkflowNode;
  selected: boolean;
}

export const ActionNode = ({ data, selected }: ActionNodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-md border-2 transition-all bg-card cursor-pointer ${
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-primary/30'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <Handle type="source" position={Position.Right} className="!bg-primary" />
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-md bg-primary/10">
          <Settings className="w-4 h-4 text-primary" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-medium">ACTION</div>
          <div className="text-sm font-semibold">{data.label}</div>
        </div>
      </div>
    </div>
  );
};
