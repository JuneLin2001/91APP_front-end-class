import { useContext } from "react";
import {
  Box,
  ActionList,
  Text,
  RelativeTime,
  IconButton,
  Button,
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
import IssueLabels from "../../components/IssueLabels";
import { IssueContext } from "../../context/issueContext";

const IssuePageList = ({ issuesToDisplay, repoName, owner }) => {
  const { handleCheckboxChange } = useContext(IssueContext);

  return (
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
                checked={issue.isSelected}
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
              {issue.labels.length > 0 &&
                issue.labels.map((label) => (
                  <IssueLabels
                    key={label.id}
                    name={label.name}
                    color={label.color}
                    description={label.description}
                  />
                ))}
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
  );
};

export default IssuePageList;
