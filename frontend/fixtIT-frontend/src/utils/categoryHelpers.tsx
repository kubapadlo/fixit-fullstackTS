import React from "react";
import {
  Build as BuildIcon,
  Plumbing as PlumbingIcon,
  FormatPaint as PaintIcon,
  ElectricalServices as ElecIcon,
  Weekend as CarpenterIcon,
  MeetingRoom as LocksmithIcon,
} from "@mui/icons-material";
//import { FaultCategory } from "../types/fault.type";
type FaultCategory =
  | "Elektryk"
  | "Hydraulik"
  | "Murarz"
  | "Malarz"
  | "Stolarz"
  | "Ślusarz";
export const getCategoryDetails = (category: FaultCategory) => {
  switch (category) {
    case "Elektryk":
      return { icon: <ElecIcon />, color: "#ffb74d" }; // Orange
    case "Hydraulik":
      return { icon: <PlumbingIcon />, color: "#4fc3f7" }; // Blue
    case "Murarz":
      return { icon: <BuildIcon />, color: "#9e9e9e" }; // Grey
    case "Malarz":
      return { icon: <PaintIcon />, color: "#f06292" }; // Pink
    case "Stolarz":
      return { icon: <CarpenterIcon />, color: "#8d6e63" }; // Brown
    case "Ślusarz":
      return { icon: <LocksmithIcon />, color: "#78909c" }; // BlueGrey
    default:
      return { icon: <BuildIcon />, color: "#bdbdbd" };
  }
};
