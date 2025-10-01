import { WorkflowNode, WorkflowEdge } from '@/types/workflow';

export const getSubtree = (
  nodeId: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } => {
  const subtreeNodes = new Set<string>([nodeId]);
  const subtreeEdges: WorkflowEdge[] = [];
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const outgoingEdges = edges.filter(e => e.source === current);

    outgoingEdges.forEach(edge => {
      if (!subtreeNodes.has(edge.target)) {
        subtreeNodes.add(edge.target);
        queue.push(edge.target);
      }
      subtreeEdges.push(edge);
    });
  }

  return {
    nodes: nodes.filter(n => subtreeNodes.has(n.id)),
    edges: subtreeEdges,
  };
};

export const copySubtree = (
  nodeId: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  offsetX = 50,
  offsetY = 50
): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } => {
  const subtree = getSubtree(nodeId, nodes, edges);
  const idMap = new Map<string, string>();

  const newNodes = subtree.nodes.map(node => {
    const newId = `${node.id}_copy_${Date.now()}`;
    idMap.set(node.id, newId);
    return {
      ...node,
      id: newId,
      position: {
        x: node.position.x + offsetX,
        y: node.position.y + offsetY,
      },
    };
  });

  const newEdges = subtree.edges.map(edge => ({
    ...edge,
    id: `${edge.id}_copy_${Date.now()}`,
    source: idMap.get(edge.source)!,
    target: idMap.get(edge.target)!,
  }));

  return { nodes: newNodes, edges: newEdges };
};

export const deleteSubtree = (
  nodeId: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } => {
  const subtree = getSubtree(nodeId, nodes, edges);
  const subtreeNodeIds = new Set(subtree.nodes.map(n => n.id));

  return {
    nodes: nodes.filter(n => !subtreeNodeIds.has(n.id)),
    edges: edges.filter(e => !subtreeNodeIds.has(e.source) && !subtreeNodeIds.has(e.target)),
  };
};
