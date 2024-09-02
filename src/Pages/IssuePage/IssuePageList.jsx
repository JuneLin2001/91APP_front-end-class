import {
  ActionList,
  Box,
  Text,
  RelativeTime,
  IconButton,
  Button,
} from "@primer/react";
import {
  IssueOpenedIcon,
  IssueClosedIcon,
  CommentIcon,
} from "@primer/octicons-react";
import { Link } from "react-router-dom";
import {
  IssueCheckbox,
  IssueLabelBox,
  IssueCardContainer,
} from "../../style/IssuePage.styled";

const IssuePageList = ({
  issuesToDisplay,
  stateOpenOrClosed,
  repoName,
  handleCheckboxChange,
  owner,
}) => {
  return (
    <>
      <ActionList sx={{ p: 0 }}>
        {issuesToDisplay.map((issue) => (
          <IssueCardContainer key={issue.id}>
            <Box display="flex" alignItems="center">
              <IssueCheckbox onChange={() => handleCheckboxChange(issue.id)} />
              <IconButton
                aria-label={
                  issue.state === "open" ? "Open issue" : "Closed issue"
                }
                variant="invisible"
                size="small"
                icon={
                  issue.state === "open" ? IssueOpenedIcon : IssueClosedIcon
                }
                unsafeDisableTooltip={false}
                sx={{
                  color: issue.state === "open" ? "green" : "purple", //TODO: 替換為 Primer 的官方顏色
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
                const isWhite = label.color === "ffffff";
                return (
                  <IssueLabelBox
                    key={label.id}
                    bg={`#${label.color}`}
                    color={isWhite ? "black" : "white"}
                    border={isWhite ? "1px solid gray" : "0"}
                    borderColor={isWhite ? "gray" : "transparent"}
                    aria-label={label.description}
                  >
                    {label.name}
                  </IssueLabelBox>
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
                    {`was closed `}
                    <RelativeTime date={new Date(issue.closed_at)} />
                  </>
                )}
              </Text>
            </Box>
          </IssueCardContainer>
        ))}
      </ActionList>
    </>
  );
};

export default IssuePageList;
