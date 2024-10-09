import React, { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import {
  Tree,
  NodeModel,
  DragLayerMonitorProps
} from "@minoru/react-dnd-treeview";
import { TreeNode } from "../../utility/types";
import { Node } from "./sub-components/Node";
import { CustomDragPreview } from "./CustomDragPreview";
import { theme } from "./theme";
import styles from "./App.module.css";
import SampleData from "./sample_data.json";

function App() {
  const [treeData, setTreeData] = useState<NodeModel[]>(SampleData);
  const handleDrop = (newTree: NodeModel[]) => setTreeData(newTree);
  const [selectedNode, setSelectedNode] = useState<NodeModel>(null);
  const handleSelect = (node: NodeModel) => setSelectedNode(node);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={styles.app}>
          <div className={styles.current}>
            <p>
              Current node:{" "}
              <span className={styles.currentLabel}>
                {selectedNode ? selectedNode.text : "none"}
              </span>
            </p>
          </div>
          <Tree
            tree={treeData}
            rootId={0}
            render={(
              node: NodeModel<TreeNode>,
              { depth, isOpen, onToggle }
            ) => (
              <Node
                node={node}
                depth={depth}
                isOpen={isOpen}
                isSelected={node.id === selectedNode?.id}
                onToggle={onToggle}
                onSelect={handleSelect}
              />
            )}
            dragPreviewRender={(
              monitorProps: DragLayerMonitorProps<CustomData>
            ) => <CustomDragPreview monitorProps={monitorProps} />}
            onDrop={handleDrop}
            classes={{
              draggingSource: styles.draggingSource,
              dropTarget: styles.dropTarget
            }}
          />
        </div>
      </ThemeProvider>
  );
}

export default App;
