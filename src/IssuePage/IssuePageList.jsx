import {
  ActionList,
  Box,
  Text,
  RelativeTime,
  CheckboxGroup,
  IconButton,
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
} from "../style/IssuePage.styled";

const IssuePageList = ({
  issuesToDisplay,
  stateFilter,
  repoName,
  handleCheckboxChange,
}) => {
  return (
    <CheckboxGroup>
      <CheckboxGroup.Label />
      <ActionList sx={{ p: 0 }}>
        {issuesToDisplay.map((issue) => (
          <IssueCardContainer key={issue.id}>
            <Box display="flex" alignItems="center">
              <IssueCheckbox onChange={() => handleCheckboxChange(issue.id)} />
              <IconButton
                aria-label={
                  stateFilter === "open" ? "Open issue" : "Closed issue"
                }
                variant="invisible"
                size="small"
                icon={
                  stateFilter === "open" ? IssueOpenedIcon : IssueClosedIcon
                }
                unsafeDisableTooltip={false}
                sx={{
                  color: stateFilter === "open" ? "green.5" : "purple.5", //TODO: 替換為 Primer 的官方顏色
                  cursor: "default",
                  ":hover": {
                    borderColor: "transparent",
                    bg: "transparent",
                  },
                }}
              />
              <Text>
                <Link
                  to={`/${repoName}/issue/comment/${issue.number}`}
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
                <Box ml={"auto"} display={"flex"} alignItems={"center"}>
                  <IconButton
                    icon={CommentIcon}
                    variant="invisible"
                    unsafeDisableTooltip={false}
                    sx={{
                      ":hover": {
                        color: "blue.5", // TODO: 替換為 Primer 的官方顏色
                      },
                    }}
                  />
                  <Text fontSize={"12px"}>{issue.comments}</Text>
                </Box>
              )}
            </Box>

            <Box ml={7}>
              <Text color="fg.muted" fontSize={"12px"}>
                {`#${issue.number} `}
                {stateFilter === "open" ? (
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
    </CheckboxGroup>
  );
};

export default IssuePageList;
