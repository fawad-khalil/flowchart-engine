import { Handle, Position } from 'reactflow';
import { Mail } from 'lucide-react';
import { WorkflowNode } from '@/types/workflow';

interface TerminalNodeProps {
  data: WorkflowNode;
  selected: boolean;
}

export const TerminalNode = ({ data, selected }: TerminalNodeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-md border-2 transition-all bg-card cursor-pointer ${
        selected ? 'border-destructive ring-2 ring-destructive/20' : 'border-destructive/30'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-destructive" />
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-md bg-destructive/10">
          <Mail className="w-4 h-4 text-destructive" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-medium">TERMINAL</div>
          <div className="text-sm font-semibold">{data.label}</div>
        </div>
      </div>
    </div>
  );
};
