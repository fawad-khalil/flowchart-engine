import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  NodeTypes,
  useNodesState,
  useEdgesState,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { useWorkflow } from "@/context/WorkflowContext";
import { StartNode } from "./nodes/StartNode";
import { ActionNode } from "./nodes/ActionNode";
import { DecisionNode } from "./nodes/DecisionNode";
import { TerminalNode } from "./nodes/TerminalNode";

const nodeTypes: NodeTypes = {
  start: StartNode,
  action: ActionNode,
  decision: DecisionNode,
  terminal: TerminalNode,
};

interface FlowCanvasProps {
  onNodeClick: (node: any) => void;
}

export const FlowCanvas = ({ onNodeClick }: FlowCanvasProps) => {
  const { workflow, setWorkflow } = useWorkflow();

  const initialNodes: Node[] = workflow.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node,
  }));

  const initialEdges: Edge[] = workflow.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.condition,
    animated: true,
    style: { stroke: "#94a3b8", strokeWidth: 2 },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync workflow changes to React Flow state
  useEffect(() => {
    const newNodes: Node[] = workflow.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node,
    }));
    setNodes(newNodes);

    const newEdges: Edge[] = workflow.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.condition,
      animated: true,
      style: { stroke: "#94a3b8", strokeWidth: 2 },
    }));
    setEdges(newEdges);
  }, [workflow]);

  // Persist a node's position only after drag stops to avoid flicker
  const onNodeDragStop = useCallback(
    (_: any, node: Node) => {
      const updated = workflow.nodes.map((n) =>
        n.id === node.id ? { ...n, position: node.position } : n
      );
      setWorkflow({ ...workflow, nodes: updated });
    },
    [workflow, setWorkflow]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        id: `e${workflow.edges.length + 1}`,
        source: connection.source!,
        target: connection.target!,
      };
      setWorkflow({
        ...workflow,
        edges: [...workflow.edges, newEdge],
      });
    },
    [workflow, setWorkflow]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={(_, node) => onNodeClick(node.data)}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const colors = {
              start: "hsl(142 76% 36%)",
              action: "hsl(217 91% 60%)",
              decision: "hsl(38 92% 50%)",
              terminal: "hsl(0 84.2% 60.2%)",
            };
            return colors[node.type as keyof typeof colors] || "#94a3b8";
          }}
        />
      </ReactFlow>
    </div>
  );
};
