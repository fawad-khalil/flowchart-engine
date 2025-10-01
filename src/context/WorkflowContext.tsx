import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Workflow, WorkflowNode, WorkflowEdge } from "@/types/workflow";
import sampleWorkflow from "@/data/sampleWorkflow.json";

interface WorkflowContextType {
  workflow: Workflow;
  setWorkflow: (workflow: Workflow) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  addNode: (node: WorkflowNode) => void;
  deleteNode: (nodeId: string) => void;
  saveWorkflow: () => void;
  loadWorkflow: () => void;
  resetWorkflow: () => void;
  clearWorkflow: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(
  undefined
);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [workflow, setWorkflowState] = useState<Workflow>(() => {
    const saved = localStorage.getItem("workflow");
    return saved ? JSON.parse(saved) : sampleWorkflow;
  });

  const [past, setPast] = useState<Workflow[]>([]);
  const [future, setFuture] = useState<Workflow[]>([]);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  // When true, the next workflow state change should not be persisted to localStorage
  const suppressNextSaveRef = useRef<boolean>(false);

  const setWorkflow = (
    next: Workflow,
    options?: { suppressSaveOnce?: boolean }
  ) => {
    if (options?.suppressSaveOnce) {
      suppressNextSaveRef.current = true;
    }
    setPast((prev) => [...prev, JSON.parse(JSON.stringify(workflow))]);
    setFuture([]);
    setWorkflowState(next);
  };

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    const next: Workflow = {
      ...workflow,
      nodes: workflow.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    };
    setWorkflow(next);
  };

  const addNode = (node: WorkflowNode) => {
    const next: Workflow = {
      ...workflow,
      nodes: [...workflow.nodes, node],
    };
    setWorkflow(next);
  };

  const deleteNode = (nodeId: string) => {
    const next: Workflow = {
      nodes: workflow.nodes.filter((n) => n.id !== nodeId),
      edges: workflow.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    };
    setWorkflow(next);
  };

  const saveWorkflow = useCallback(() => {
    localStorage.setItem("workflow", JSON.stringify(workflow));
  }, [workflow]);

  const loadWorkflow = () => {
    const saved = localStorage.getItem("workflow");
    if (saved) {
      setWorkflow(JSON.parse(saved));
    }
  };

  const resetWorkflow = () => {
    setWorkflow(sampleWorkflow as Workflow);
    localStorage.setItem("workflow", JSON.stringify(sampleWorkflow));
  };

  const clearWorkflow = () => {
    // Prevent persisting the cleared state so app restarts with defaults
    setWorkflow({ nodes: [], edges: [] }, { suppressSaveOnce: true });
    // Ensure any previously saved workflow does not override defaults on reload
    localStorage.removeItem("workflow");
  };

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    setPast(newPast);
    setFuture((f) => [JSON.parse(JSON.stringify(workflow)), ...f]);
    setWorkflowState(previous);
  }, [past, workflow]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const [next, ...rest] = future;
    setFuture(rest);
    setPast((p) => [...p, JSON.parse(JSON.stringify(workflow))]);
    setWorkflowState(next);
  }, [future, workflow]);

  useEffect(() => {
    if (suppressNextSaveRef.current) {
      // Skip persisting this one change (e.g., clear action)
      suppressNextSaveRef.current = false;
      return;
    }
    saveWorkflow();
  }, [workflow, saveWorkflow]);

  useEffect(() => {
    setCanUndo(past.length > 0);
  }, [past]);

  useEffect(() => {
    setCanRedo(future.length > 0);
  }, [future]);

  // Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y or Ctrl+Shift+Z (redo)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      if (!isCtrlOrMeta) return;
      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        e.key.toLowerCase() === "y" ||
        (e.key.toLowerCase() === "z" && e.shiftKey)
      ) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  return (
    <WorkflowContext.Provider
      value={{
        workflow,
        setWorkflow,
        updateNode,
        addNode,
        deleteNode,
        saveWorkflow,
        loadWorkflow,
        resetWorkflow,
        clearWorkflow,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider");
  }
  return context;
};
