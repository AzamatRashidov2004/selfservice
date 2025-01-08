import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { TypeIcon } from "./Type-Icon";
import { useFiles } from "../../../context/fileContext";
import {
  getKbId,
  getPdfFileUrl,
} from "../../../api/kronos/getKronos";
import keycloak from "../../../keycloak";
import { clearSelection } from "../../../utility/chonkyActionCalls";

export const CustomNode = (props) => {
  const { droppable, data } = props.node;
  const indent = props.depth * 24;
  const { setCurrentFolder, getProjectForNode, currentFolder } = useFiles();

  const setPdfVisible = props.setPdfVisible;
  const setPdfUrl = props.setPdfUrl;

  const findChonkyContainerWithTimeout = (selector, timeout = 3000, interval = 100) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const attemptFind = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error(`Element not found within ${timeout}ms: ${selector}`));
        } else {
          setTimeout(attemptFind, interval);
        }
      };

      attemptFind();
    });
  };

  const handleContextMenu = async (event) => {
    if (event.altKey) {
      return; // Do nothing if the Alt key is pressed
    }

    // Prevent the default context menu from appearing
    event.preventDefault();
    clearSelection();
    props.setHighlightedNodeId(props.node.id);
    if (props.node.droppable) {
      setCurrentFolder(props.node.parent.toString())
    } else {
      setCurrentFolder(props.node.parent.toString());

      const chonkyContainer = document.querySelector('.chonky-fileListWrapper');
    }

    console.log("Right-click detected at coordinates:", event.clientX, event.clientY);

    // Get the mouse position from the right-click event
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Find the Chonky container (assuming you have a selector for it)
    const chonkyContainer = await findChonkyContainerWithTimeout(`span[title="${props.node.text}"]`) // Replace with the correct selector

    if (chonkyContainer) {
      // Create a new MouseEvent to simulate a right-click at the mouse position
      const mouseEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        button: 2, // Right-click button
        clientX: mouseX,
        clientY: mouseY,
      });

      // Dispatch the right-click event within the Chonky container
      chonkyContainer.dispatchEvent(mouseEvent);
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    props.setHighlightedNodeId(props.node.id);
    props.onToggle(props.node.id);

    // Is it a file
    if (!props.node.droppable) {
      setCurrentFolder(props.node.parent.toString());
      return;
    }

    // It is a folder
    if (props.isOpen) {
      setCurrentFolder(props.node.parent.toString());
      return;
    }

    setCurrentFolder(props.node.id.toString());
  };

  useEffect(() => {
    props.updateNode(props.node);
  }, [props.parent]);

  useEffect(() => {
    // If current folder is set to this node and it is closed
    if (parseInt(currentFolder) == props.node.id && !props.isOpen) {
      props.onToggle(props.node.id);
      props.setHighlightedNodeId(props.node.id);
    }
  }, [currentFolder])

  useEffect(() => {
    props.updateNode(props.node);
  }, [props.hasChild]);

  async function handleDoubleClick() {
    setPdfVisible(true);
    console.log("Double-clicked on PDF node.");
    if (!keycloak || !keycloak.token) return;

    const file = data;
    if (file && file.fileType === "pdf") {
      const number_id = parseInt(props.node.id);
      const project = getProjectForNode(number_id);

      if (project) {
        const { kronosProjectId: projectId, text: text } = project;

        console.log("project id: ", projectId);

        try {
          const kb_id = await getKbId(projectId, keycloak.token);
          const url = await getPdfFileUrl(
            projectId,
            kb_id,
            text,
            keycloak.token
          );
          console.log("the url is: ", url);
          console.log("token: ", keycloak.token);
          if (url != "") {
            setPdfVisible(true);
            setPdfUrl(url);
          } else {
            console.error("No content in PDF blob.");
          }
        } catch (error) {
          console.error("Error fetching PDF:", error);
        }
      } else {
        console.error("Project not found for node:", number_id);
      }
    }
  }

  return (
    <div
      style={{
        paddingInlineStart: indent,
        cursor: "pointer",
        backgroundColor:
          props.highlightedNodeId === props.node.id ? "#e0f7fa" : "transparent",
      }}
      className={`node-root depth-${props.depth}`}
      onClick={(e) => {
        handleToggle(e);
      }}
      onDoubleClick={data?.fileType === "pdf" ? handleDoubleClick : () => { }}
      onContextMenu={handleContextMenu}
    >
      <div
        className={`expandIconWrapper ${props.isOpen ? "isOpen" : ""}`}
        onClick={(e) => {
          handleToggle(e);
        }}
      >
        {props.node.droppable && <ArrowRightIcon />}
      </div>
      <div>
        <TypeIcon droppable={droppable} fileType={data?.fileType} />
      </div>
      <div
        className="labelGridItem"
        style={{
          textOverflow: "ellipsis !important",
          whiteSpace: "nowrap !important",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="body2"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {props.node.text}
        </Typography>
      </div>
    </div>
  );
};
