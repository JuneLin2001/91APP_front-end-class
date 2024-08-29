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
} from "../style/IssuePage.styled.jsx";
import SelectPanelLabel from "../SelectPanelLebels.jsx";
import SelectPanelAuthor from "../SelectPanelAuthor.jsx";

const IssuePageHeader = ({
  allIssues,
  stateFilter,
  setStateFilter,
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
            color: stateFilter === "open" ? "#000000" : "#84878b",
            fontWeight: stateFilter === "open" ? "bold" : "normal",
          }}
          onClick={() => setStateFilter("open")}
        >
          {`${allIssues.filter((issue) => !issue.pull_request).length} Open`}
        </IssueOpenClosedButton>

        <IssueOpenClosedButton
          aria-label="Closed Issues"
          leadingVisual={CheckIcon}
          sx={{
            color: stateFilter === "closed" ? "#000000" : "#84878b",
            fontWeight: stateFilter === "closed" ? "bold" : "normal",
          }}
          onClick={() => setStateFilter("closed")}
        >
          {`${
            allIssues.filter(
              (issue) => issue.state === "closed" && !issue.pull_request
            ).length
          } Closed`}
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
