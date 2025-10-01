import { useEffect, useState } from "react";
import { X, Save, Trash2, Copy } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWorkflow } from "@/context/WorkflowContext";
import { WorkflowNode } from "@/types/workflow";
import { copySubtree, deleteSubtree } from "@/utils/graph";
import { toast } from "sonner";

interface NodeDrawerProps {
  node: WorkflowNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NodeDrawer = ({ node, open, onOpenChange }: NodeDrawerProps) => {
  const { workflow, updateNode, deleteNode, setWorkflow } = useWorkflow();
  const [editedConfig, setEditedConfig] = useState<Record<string, string>>({});
  const [editedLabel, setEditedLabel] = useState("");

  // Initialize edit state whenever a new node is selected or drawer opens
  useEffect(() => {
    if (node) {
      setEditedLabel(node.label || "");
      const cfg: Record<string, string> = {};
      const source = node.config || {};
      Object.keys(source).forEach((k) => {
        cfg[k] = String((source as Record<string, unknown>)[k] ?? "");
      });
      setEditedConfig(cfg);
    } else {
      setEditedLabel("");
      setEditedConfig({});
    }
  }, [node, open]);

  if (!node) return null;

  const handleSave = () => {
    updateNode(node.id, {
      label: editedLabel || node.label,
      config: { ...(node.config || {}), ...(editedConfig || {}) },
    });
    toast.success("Node updated successfully");
    onOpenChange(false);
  };

  const handleDelete = () => {
    deleteNode(node.id);
    toast.success("Node deleted");
    onOpenChange(false);
  };

  const handleDeleteSubtree = () => {
    const result = deleteSubtree(node.id, workflow.nodes, workflow.edges);
    setWorkflow(result);
    toast.success("Subtree deleted");
    onOpenChange(false);
  };

  const handleCopySubtree = () => {
    const result = copySubtree(node.id, workflow.nodes, workflow.edges);
    setWorkflow({
      nodes: [...workflow.nodes, ...result.nodes],
      edges: [...workflow.edges, ...result.edges],
    });
    toast.success("Subtree copied");
  };

  const nodeTypeColors = {
    start: "bg-success text-success-foreground",
    action: "bg-primary text-primary-foreground",
    decision: "bg-warning text-warning-foreground",
    terminal: "bg-destructive text-destructive-foreground",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Node Details</SheetTitle>
            <Badge className={nodeTypeColors[node.type]}>
              {node.type.toUpperCase()}
            </Badge>
          </div>
          <SheetDescription>View and edit node configuration</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <Label htmlFor="label">Node Label</Label>
            <Input
              id="label"
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              className="mt-2"
            />
          </div>

          <Separator />

          <div>
            <Label className="text-base font-semibold">Configuration</Label>
            <div className="mt-3 space-y-3">
              {node.config &&
                Object.keys(node.config).map((key) => (
                  <div key={key}>
                    <Label htmlFor={key} className="capitalize">
                      {key.replace(/_/g, " ")}
                    </Label>
                    <Input
                      id={key}
                      value={editedConfig[key] ?? ""}
                      onChange={(e) =>
                        setEditedConfig({
                          ...editedConfig,
                          [key]: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                ))}
              {(!node.config || Object.keys(node.config).length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No configuration available
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-semibold">Node ID</Label>
            <p className="text-sm text-muted-foreground mt-1">{node.id}</p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={handleSave} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>

            <Button
              onClick={handleCopySubtree}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Subtree
            </Button>

            <Button
              onClick={handleDelete}
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Node
            </Button>

            <Button
              onClick={handleDeleteSubtree}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Subtree
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
