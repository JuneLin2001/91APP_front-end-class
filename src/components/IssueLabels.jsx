import { Label, Tooltip } from "@primer/react";
import getBrightness from "../utils/colorContrast";

const IssueLabels = ({ name, color, description }) => {
  const labelColor = `#${color}`;
  const brightness = getBrightness(color);
  const textColor = brightness > 128 ? "black" : "white";
  const borderColor = brightness > 220 ? "border.default" : labelColor;

  return (
    <Tooltip text={description} direction="s">
      <Label
        sx={{
          marginRight: "4px",
          backgroundColor: labelColor,
          color: textColor,
          borderColor: borderColor,
          cursor: "pointer",
        }}
      >
        {name}
      </Label>
    </Tooltip>
  );
};

export default IssueLabels;
