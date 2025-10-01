import { useState } from "react";
import {
  Plus,
  Save,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Undo2,
  Redo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkflow } from "@/context/WorkflowContext";
import { WorkflowNode, NodeType } from "@/types/workflow";
import { toast } from "sonner";

export const Toolbar = () => {
  const {
    workflow,
    addNode,
    saveWorkflow,
    setWorkflow,
    resetWorkflow,
    clearWorkflow,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useWorkflow();

  const handleAddNode = (type: NodeType) => {
    const newNode: WorkflowNode = {
      id: `${type}_${Date.now()}`,
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      config: {},
    };
    addNode(newNode);
    toast.success(`${type} node added`);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "workflow.json";
    link.click();
    toast.success("Workflow exported");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          setWorkflow(imported);
          toast.success("Workflow imported");
        } catch (error) {
          toast.error("Invalid workflow file");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    saveWorkflow();
    toast.success("Workflow saved to localStorage");
  };

  const handleReset = () => {
    resetWorkflow();
    toast.success("Workflow reset to sample");
  };

  const handleClear = () => {
    clearWorkflow();
    toast.success("Flow chart cleared");
  };

  return (
    <div className="border-b bg-card px-4 py-3">
      <div className="flex items-center gap-2 max-w-7xl mx-auto">
        <h1 className="text-lg font-semibold mr-4">Workflow Editor</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Add Node
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleAddNode("start")}>
              Start Node
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("action")}>
              Action Node
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("decision")}>
              Decision Node
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode("terminal")}>
              Terminal Node
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" variant="outline" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <Button size="sm" variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>

        <label htmlFor="import-file">
          <Button size="sm" variant="outline" asChild>
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </span>
          </Button>
        </label>
        <input
          id="import-file"
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />

        <Button size="sm" variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>

        <Button size="sm" variant="destructive" onClick={handleClear}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>

        <Button size="sm" variant="outline" onClick={undo} disabled={!canUndo}>
          <Undo2 className="w-4 h-4 mr-2" />
          Undo
        </Button>

        <Button size="sm" variant="outline" onClick={redo} disabled={!canRedo}>
          <Redo2 className="w-4 h-4 mr-2" />
          Redo
        </Button>
      </div>
    </div>
  );
};
