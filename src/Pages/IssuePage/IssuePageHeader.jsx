import { Box, SegmentedControl, Button, ButtonGroup } from "@primer/react";
import {
  IssueOpenedIcon,
  CheckIcon,
  TriangleDownIcon,
} from "@primer/octicons-react";

import {
  IssueHeader,
  IssueCheckbox,
  IssueOpenClosedButton,
} from "../../style/IssuePage.styled.jsx";
import SelectPanelLabel from "./IssuePageSelectPanelLebels.jsx";
import SelectPanelAuthor from "./IssuePageSelectPanelAuthor.jsx";

const IssuePageHeader = ({
  openCount,
  closedCount,
  stateOpenOrClosed,
  setStateOpenOrClosed,
  authors,
  labels,
  handleAuthorChange,
  handleLabelChange,
}) => {
  return (
    <IssueHeader>
      <IssueCheckbox />
      <SegmentedControl
        aria-label="File view"
        variant="invisible"
        sx={{ bg: "#f6f8fa" }}
      >
        <IssueOpenClosedButton
          defaultSelected
          aria-label="Open Issues"
          leadingVisual={IssueOpenedIcon}
          sx={{
            color: stateOpenOrClosed === "open" ? "#000000" : "#84878b",
            fontWeight: stateOpenOrClosed === "open" ? "bold" : "normal",
          }}
          onClick={() => setStateOpenOrClosed("open")}
        >
          {`${openCount} Open`}
        </IssueOpenClosedButton>

        <IssueOpenClosedButton
          aria-label="Closed Issues"
          leadingVisual={CheckIcon}
          sx={{
            color: stateOpenOrClosed === "closed" ? "#000000" : "#84878b",
            fontWeight: stateOpenOrClosed === "closed" ? "bold" : "normal",
          }}
          onClick={() => setStateOpenOrClosed("closed")}
        >
          {`${closedCount} Closed`}
        </IssueOpenClosedButton>
      </SegmentedControl>

      <Box sx={{ ml: "auto" }}>
        <ButtonGroup>
          <SelectPanelAuthor authors={authors} onSelect={handleAuthorChange} />
          <SelectPanelLabel labels={labels} onSelect={handleLabelChange} />

          <Button
            variant="invisible"
            trailingAction={TriangleDownIcon}
            sx={{ fontSize: "14px" }}
          >
            Projects
          </Button>
          <Button variant="invisible" trailingAction={TriangleDownIcon}>
            Milestones
          </Button>
          <Button variant="invisible" trailingAction={TriangleDownIcon}>
            Assignee
          </Button>
          <Button variant="invisible" trailingAction={TriangleDownIcon}>
            Sort
          </Button>
        </ButtonGroup>
      </Box>
    </IssueHeader>
  );
};

export default IssuePageHeader;
