import { Handle, Position } from 'reactflow';
import { Webhook } from 'lucide-react';
import { WorkflowNode } from '@/types/workflow';

interface StartNodeProps {
  data: WorkflowNode;
  selected: boolean;
}

export const StartNode = ({ data, selected }: StartNodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-md border-2 transition-all bg-card cursor-pointer ${
        selected ? 'border-success ring-2 ring-success/20' : 'border-success/30'
      }`}
    >
      <Handle type="source" position={Position.Right} className="!bg-success" />
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-md bg-success/10">
          <Webhook className="w-4 h-4 text-success" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-medium">START</div>
          <div className="text-sm font-semibold">{data.label}</div>
        </div>
      </div>
    </div>
  );
};
