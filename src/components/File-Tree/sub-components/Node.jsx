import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { TypeIcon } from "./Type-Icon";
import { useFiles } from "../../../context/fileContext";
import {
  getKbId,
  getPdfFile,
  getPdfFileUrl,
} from "../../../api/kronos/getKronos";
import keycloak from "../../../keycloak";

export const CustomNode = (props) => {
  const { droppable, data } = props.node;
  const indent = props.depth * 24;
  const { setCurrentFolder, getProjectForNode } = useFiles();

  const setPdfVisible = props.setPdfVisible;
  const setPdfUrl = props.setPdfUrl;

  const handleToggle = (e, target) => {
    e.stopPropagation();

    if (target === "row") {
      if (props.node.droppable) {
        setCurrentFolder(props.node.id.toString());
      } else {
        setCurrentFolder(props.node.parent.toString());
      }
      props.setHighlightedNodeId(props.node.id); // Update the highlighted node in the parent component
    }

    props.onToggle(props.node.id);
  };

  useEffect(() => {
    props.updateNode(props.node);
  }, [props.parent]);

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
        handleToggle(e, "row");
      }}
      onDoubleClick={data?.fileType === "pdf" ? handleDoubleClick : () => {}}
    >
      <div
        className={`expandIconWrapper ${props.isOpen ? "isOpen" : ""}`}
        onClick={(e) => {
          handleToggle(e, "arrow");
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
