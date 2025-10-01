import { useState } from 'react';
import { WorkflowProvider } from '@/context/WorkflowContext';
import { FlowCanvas } from '@/components/FlowCanvas';
import { NodeDrawer } from '@/components/NodeDrawer';
import { Toolbar } from '@/components/Toolbar';
import { WorkflowNode } from '@/types/workflow';

const Index = () => {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNodeClick = (node: WorkflowNode) => {
    setSelectedNode(node);
    setDrawerOpen(true);
  };

  return (
    <WorkflowProvider>
      <div className="flex flex-col h-screen w-full">
        <Toolbar />
        <div className="flex-1">
          <FlowCanvas onNodeClick={handleNodeClick} />
        </div>
        <NodeDrawer
          node={selectedNode}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />
      </div>
    </WorkflowProvider>
  );
};

export default Index;
