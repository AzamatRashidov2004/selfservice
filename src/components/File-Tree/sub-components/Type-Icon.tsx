import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DescriptionIcon from "@mui/icons-material/Description";

interface TypeIconProps {
    type?: string;
    droppable: boolean
  }

export const TypeIcon: React.FC<TypeIconProps> = ({type, droppable}) => {
  if (droppable) {
    return <FolderIcon />;
  }

  switch (type) {
    case "image":
      return <ImageIcon />;
    case "csv":
      return <ListAltIcon />;
    case "text":
      return <DescriptionIcon />;
    default:
      return null;
  }
};