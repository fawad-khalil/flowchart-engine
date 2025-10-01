<div align="center">

# SynthGraph Editor

An interactive, React-based flowchart editor for building and managing node-based workflows.

</div>

---

## Overview

SynthGraph Editor lets you visually design workflows using draggable nodes and connect them with edges. It supports custom node types, pan/zoom, a minimap, and a details drawer to edit node properties. Workflows can be saved locally, exported/imported as JSON, and manipulated with subtree copy/delete utilities.

## Key Features

- Visual canvas powered by React Flow (drag, connect, select, pan, zoom)
- Custom node types: `start`, `action`, `decision`, `terminal`
- Node details drawer to edit label and configuration
- Subtree operations: copy and delete (BFS-based)
- Minimap, zoom controls, and background grid
- Save to localStorage; export/import JSON; reset to sample workflow
- Clear canvas action to remove all nodes/edges (defaults restored on reload)
- Undo/Redo for workflow edits (toolbar buttons + keyboard shortcuts)

## Tech Stack

- React 18, TypeScript, Vite
- React Flow (`reactflow`) for graph rendering & interactions
- Tailwind CSS + shadcn/ui (Radix primitives) for UI
- Lucide icons, Sonner toasts

## Getting Started

Prerequisites: Node.js 18+ and npm (or pnpm/bun).

```sh
# Clone
git clone git@github.com:fawad-khalil/flowchart-engine.git
cd synthgraph-editor

# Install
npm i

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open the dev server URL shown in your terminal (typically `http://localhost:5173`).

## Usage Guide

1. Add Nodes

- Use the toolbar "Add Node" menu to insert `start`, `action`, `decision`, or `terminal` nodes. New nodes appear within the canvas viewport.

2. Drag, Pan, and Zoom

- Drag nodes to reposition them. Pan the canvas by dragging the empty space. Zoom with mouse wheel or touchpad pinch. Use the controls or minimap for quick navigation.

3. Connect Nodes

- Drag from a node’s handle to another node to create an edge. Edges can be labeled (via node config/conditions if desired) and are rendered animated by default.

4. Inspect & Edit Node Details

- Click a node to open the drawer. Edit the node label and any configuration fields shown. Click "Save Changes" to persist. Changes update immediately on the canvas.

5. Subtree Operations

- In the node drawer, use "Copy Subtree" to duplicate a node and all of its descendants with an offset, or "Delete Subtree" to remove a node and all nodes reachable from it.

6. Save, Export/Import, Reset

- Save: writes the current workflow to `localStorage`.
- Export: downloads the workflow JSON.
- Import: upload a JSON file to replace the current workflow.
- Reset: restores the bundled sample workflow.

7. Clear Canvas

- Clear: empties the current flowchart (nodes and edges). The cleared state is not persisted, so reloading the app shows the default sample again.

8. Undo / Redo

- Use the toolbar buttons to Undo and Redo.
- Keyboard shortcuts:
  - Undo: `Ctrl/Cmd + Z`
  - Redo: `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z`

## Application Workflow (How It Works)

- State is managed in `WorkflowContext` and persisted to `localStorage`.
- `FlowCanvas` adapts `workflow.nodes`/`workflow.edges` to React Flow’s internal structures.
- Node drags update position on drag stop, preventing flicker and ensuring smooth interactions.
- Custom React components render each node type and expose `Handle`s for connections.
- `NodeDrawer` provides a controlled form for node label/config editing.
- Graph utilities (`getSubtree`, `copySubtree`, `deleteSubtree`) implement BFS-based operations.

## Project Structure

```
src/
  components/
    FlowCanvas/            # Canvas and custom nodes
    NodeDrawer/            # Node details drawer
    Toolbar/               # Add/Save/Export/Import/Reset/Clear/Undo/Redo
    ui/                    # shadcn UI primitives
  context/
    WorkflowContext.tsx    # App workflow state, persistence
  data/
    sampleWorkflow.json    # Default sample workflow
  types/
    workflow.ts            # Types for nodes/edges/workflow
  utils/
    graph.ts               # Subtree BFS utilities
  pages/
    Index.tsx              # Main page composition
  App.tsx                  # Providers and routing
```

## Configuration & Scripts

- `npm run dev`: start Vite dev server
- `npm run build`: production build
- `npm run preview`: preview production build
- `npm run lint`: run ESLint

## Troubleshooting

- Nodes blink/disappear during drag
  - Positions now persist on drag stop to avoid re-render loops. If you still see issues, ensure your browser is not throttling background tabs, and avoid importing corrupted workflows.
- Imported workflow doesn’t render
  - Validate JSON structure matches `Workflow` types in `src/types/workflow.ts`.
- Nothing appears on load
  - Try "Reset" from the toolbar to load the sample; check console errors.

## Roadmap Ideas

- Edge labels editing on canvas
- New node types and custom palettes
- Validation rules and execution simulation
- Multi-select and bulk operations
- Server-side persistence and collaboration

---

Made with React Flow and shadcn/ui. PRs and suggestions are welcome.
