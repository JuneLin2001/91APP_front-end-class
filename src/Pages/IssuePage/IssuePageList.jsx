import {
  ActionList,
  Box,
  Text,
  RelativeTime,
  IconButton,
  Button,
  Label,
  Tooltip,
} from "@primer/react";
import {
  IssueOpenedIcon,
  IssueClosedIcon,
  CommentIcon,
  SkipIcon,
} from "@primer/octicons-react";
import { Link } from "react-router-dom";
import {
  IssueCheckbox,
  IssueCardContainer,
} from "../../style/IssuePage.styled";
import getBrightness from "../../utils/colorContrast";

const IssuePageList = ({
  issuesToDisplay,
  repoName,
  handleCheckboxChange,
  owner,
}) => {
  return (
    <>
      <ActionList sx={{ p: 0 }}>
        {issuesToDisplay.map((issue) => {
          let issueStateIcon;
          let issueStateColor;
          let ariaLabel;

          if (issue.state === "open") {
            issueStateIcon = IssueOpenedIcon;
            issueStateColor = "green"; // TODO: 替換為 Primer 的官方顏色
            ariaLabel = "Open issue";
          } else if (issue.state_reason === "not_planned") {
            issueStateIcon = SkipIcon;
            issueStateColor = "#59636e"; // TODO: 替換為 Primer 的官方顏色
            ariaLabel = "Closed as not planned issue";
          } else {
            issueStateIcon = IssueClosedIcon;
            issueStateColor = "purple"; // TODO: 替換為 Primer 的官方顏色
            ariaLabel = "Closed issue";
          }

          return (
            <IssueCardContainer key={issue.id}>
              <Box display="flex" alignItems="center">
                <IssueCheckbox
                  onChange={() => handleCheckboxChange(issue.id)}
                />
                <IconButton
                  aria-label={ariaLabel}
                  variant="invisible"
                  size="small"
                  icon={issueStateIcon}
                  unsafeDisableTooltip={false}
                  sx={{
                    color: issueStateColor,
                    cursor: "default",
                  }}
                />
                <Text>
                  <Link
                    to={`/${owner}/${repoName}/issue/comment/${issue.number}`}
                    style={{
                      color: "black",
                      fontSize: "16px",
                    }}
                  >
                    {issue.title}
                  </Link>
                </Text>
                {issue.labels.map((label) => {
                  const labelColor = `#${label.color}`;
                  const brightness = getBrightness(label.color);
                  const textColor = brightness > 128 ? "black" : "white";
                  const borderColor =
                    brightness > 220 ? "border.default" : labelColor;
                  return (
                    <Tooltip key={label.id} text={label.description}>
                      <Label
                        sx={{
                          backgroundColor: labelColor,
                          color: textColor,
                          marginLeft: "4px",
                          borderColor: borderColor,
                        }}
                      >
                        {label.name}
                      </Label>
                    </Tooltip>
                  );
                })}
                {issue.comments > 0 && (
                  <Box
                    ml={"auto"}
                    display={"flex"}
                    alignItems={"center"}
                    sx={{
                      ":hover": {
                        color: "#0969da", // TODO: 替換為 Primer 的官方顏色
                      },
                    }}
                  >
                    <Button
                      leadingVisual={CommentIcon}
                      variant="invisible"
                      onClick={() =>
                        (window.location.href = `/${owner}/${repoName}/issue/comment/${issue.number}`)
                      }
                    >
                      {issue.comments}
                    </Button>
                  </Box>
                )}
              </Box>
              <Box ml={7}>
                <Text color="fg.muted" fontSize={"12px"}>
                  {`#${issue.number} `}
                  {issue.state === "open" ? (
                    <>
                      {`opened on `}
                      <RelativeTime date={new Date(issue.created_at)} />{" "}
                      {` by ${issue.user.login}`}
                    </>
                  ) : (
                    <>
                      {` by ${issue.user.login}`}
                      {` was closed `}
                      <RelativeTime date={new Date(issue.closed_at)} />
                    </>
                  )}
                </Text>
              </Box>
            </IssueCardContainer>
          );
        })}
      </ActionList>
    </>
  );
};

export default IssuePageList;
