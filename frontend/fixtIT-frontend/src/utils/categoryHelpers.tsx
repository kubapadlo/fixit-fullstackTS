import {
  Build as BuildIcon,
  Plumbing as PlumbingIcon,
  FormatPaint as PaintIcon,
  ElectricalServices as ElecIcon,
  Weekend as CarpenterIcon,
  MeetingRoom as LocksmithIcon,
} from "@mui/icons-material";
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
      return { icon: <ElecIcon />, color: "#ffb74d" };
    case "Hydraulik":
      return { icon: <PlumbingIcon />, color: "#4fc3f7" };
    case "Murarz":
      return { icon: <BuildIcon />, color: "#9e9e9e" };
    case "Malarz":
      return { icon: <PaintIcon />, color: "#f06292" };
    case "Stolarz":
      return { icon: <CarpenterIcon />, color: "#8d6e63" };
    case "Ślusarz":
      return { icon: <LocksmithIcon />, color: "#78909c" };
    default:
      return { icon: <BuildIcon />, color: "#bdbdbd" };
  }
};
