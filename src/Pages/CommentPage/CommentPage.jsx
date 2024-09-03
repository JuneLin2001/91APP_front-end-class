import { useContext, useState, useEffect } from "react";
import {
  Text,
  ActionMenu,
  ActionList,
  ThemeProvider,
  RelativeTime,
  ButtonGroup,
  Button,
  IconButton,
  PageHeader,
  StateLabel,
  Box,
  PageLayout,
  Link,
  Octicon,
} from "@primer/react";
import {
  IssueOpenedIcon,
  IssueClosedIcon,
  CopyIcon,
  SkipIcon,
  TriangleDownIcon,
} from "@primer/octicons-react";
import { CommentContext } from "../../context/commentContext";
import CommentBox from "./CommentBox";
import TimelineComment from "./TimelineComment";
import IssueBody from "./IssueBody";

function CommentPage() {
  const {
    issueData,
    commentData,
    loading,
    error,
    currentTextareaValue,
    handleTextareaChange,
    handleCreateComment,
    handleIssueState,
  } = useContext(CommentContext);

  const issueStateMapping = [
    {
      id: 0,
      state: "open",
      stateReason: "reopened",
      label: "Reopen issue",
      color: "var(--bgColor-open-emphasis)",
      stateLabel: "issueOpened",
      description: "",
      labelStatus: "issueOpened",
    },
    {
      id: 1,
      state: "closed",
      stateReason: "completed",
      label: "Close as completed",
      icon: IssueClosedIcon,
      color: "var(--bgColor-done-emphasis)",
      stateLabel: "issueClosedNotPlanned",
      description: "Done, closed, fixed, resolved",
      labelStatus: "issueClosed",
    },
    {
      id: 2,
      state: "closed",
      stateReason: "not_planned",
      label: "Close as not planned",
      icon: SkipIcon,
      color: "var(--bgColor-neutral-emphasis)",
      stateLabel: "issueClosed",
      description: "Wont't fix, can't repo, duplicate, stale",
      labelStatus: "issueClosedNotPlanned",
    },
  ];

  const filteredActions = issueStateMapping.filter((item) => {
    if (issueData) {
      if (issueData.state === "open") {
        return item.state === "closed";
      } else if (issueData.state === "closed") {
        return (
          item.stateReason !== issueData.state_reason ||
          item.stateReason === "reopened"
        );
      }
    }
    return false;
  });

  const matchedState =
    issueData &&
    issueStateMapping.find(
      (item) =>
        item.state === issueData.state &&
        item.stateReason === issueData.state_reason
    );

  const [selectedIndex, setSelectedIndex] = useState(null);
  useEffect(() => {
    if (selectedIndex === null && filteredActions.length > 0) {
      setSelectedIndex(filteredActions[0].id);
    }
  }, [selectedIndex, filteredActions]);
  const selectedType = issueStateMapping[selectedIndex];

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;
  if (!commentData) return <div>無數據</div>;

  return (
    <ThemeProvider>
      <PageLayout>
        {issueData && (
          <PageLayout.Header>
            <PageHeader>
              <PageHeader.TitleArea>
                <PageHeader.Title as="h1">
                  {issueData.title} &nbsp;
                  <Text
                    sx={{
                      color: "fg.muted",
                      fontWeight: "light",
                    }}
                  >
                    #{issueData.number}
                  </Text>
                </PageHeader.Title>
              </PageHeader.TitleArea>
              <PageHeader.ContextArea>
                <PageHeader.ContextBar
                  sx={{
                    gap: "8px",
                  }}
                >
                  <Button
                    onClick={() => {
                      alert("The title will go into edit mode");
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      alert("New issue modal will open");
                    }}
                  >
                    New Issue
                  </Button>
                </PageHeader.ContextBar>
                <PageHeader.ContextAreaActions>
                  <IconButton
                    aria-label="Copy permalink"
                    icon={CopyIcon}
                    variant="invisible"
                    unsafeDisableTooltip={false}
                    onClick={() => {
                      alert(
                        "This button copies the permalink to the clipboard"
                      );
                    }}
                  />
                </PageHeader.ContextAreaActions>
              </PageHeader.ContextArea>
              <PageHeader.Actions></PageHeader.Actions>

              <PageHeader.Description
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  gap: 3,
                }}
              >
                <Box sx={{ verticalAlign: "middle" }}>
                  {matchedState && (
                    <StateLabel
                      sx={{
                        marginRight: "8px",
                      }}
                      status={matchedState.labelStatus}
                    >
                      {matchedState.state}
                    </StateLabel>
                  )}

                  <Text fontWeight="bold">{issueData.user.login}</Text>
                  <Text color="fg.muted"> opened this issue </Text>
                  <RelativeTime
                    date={new Date(issueData.created_at)}
                    color="fg.muted"
                  />
                  <Text color="fg.muted"> · {issueData.comments} comments</Text>
                </Box>

                <Box
                  role="separator"
                  sx={{
                    width: "100%",
                    height: 1,
                    backgroundColor: "border.default",
                  }}
                ></Box>
              </PageHeader.Description>
            </PageHeader>
          </PageLayout.Header>
        )}

        <PageLayout.Content>
          <Box ml={7}>
            <IssueBody />
            <TimelineComment />
          </Box>
          <h4>Add a comment </h4>
          <CommentBox
            onTextareaChange={handleTextareaChange}
            hasMarkdownBtn={true}
          />
          <Box
            mt={3}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ gap: 2 }}
          >
            {selectedType && (
              <ButtonGroup>
                <ActionMenu>
                  <Button
                    onClick={() =>
                      handleIssueState(
                        selectedType.state,
                        selectedType.stateReason
                      )
                    }
                    leadingVisual={() => (
                      <Octicon
                        icon={
                          selectedType.state === "closed"
                            ? selectedType.icon
                            : IssueOpenedIcon
                        }
                        color={selectedType.color}
                      />
                    )}
                  >
                    {selectedType.label}
                  </Button>
                  <ActionMenu.Button icon={TriangleDownIcon} />

                  <ActionMenu.Overlay width="auto" side="outside-bottom">
                    <ActionList selectionVariant="single">
                      {filteredActions.map((item) => (
                        <ActionList.Item
                          display="flex"
                          flexDirection="column"
                          key={item.id}
                          sx={{
                            padding: "8px 8px 8px 30px",
                            width: "max-content",
                          }}
                          selected={item.id === selectedIndex}
                          onSelect={() => setSelectedIndex(item.id)}
                        >
                          <ActionList.LeadingVisual>
                            <Octicon
                              icon={
                                item.state === "closed"
                                  ? item.icon
                                  : IssueOpenedIcon
                              }
                              color={item.color}
                            />
                          </ActionList.LeadingVisual>
                          {item.label}
                          <Text sx={{ color: "fg.muted" }}>
                            <br />
                            {item.description}
                          </Text>
                        </ActionList.Item>
                      ))}
                    </ActionList>
                  </ActionMenu.Overlay>
                </ActionMenu>
              </ButtonGroup>
            )}

            <Button
              variant="primary"
              onClick={() => handleCreateComment(currentTextareaValue)}
            >
              Comment
            </Button>
          </Box>
        </PageLayout.Content>
        <PageLayout.Pane>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box>
              <Text
                sx={{
                  fontSize: 0,
                  fontWeight: "bold",
                  display: "block",
                  color: "fg.muted",
                }}
              >
                Assignees
              </Text>
              <Text
                sx={{
                  fontSize: 0,
                  color: "fg.muted",
                  lineHeight: "condensed",
                }}
              >
                No one –{" "}
                <Link href="#" muted>
                  assign yourself
                </Link>
              </Text>
            </Box>
            <Box
              role="separator"
              sx={{
                width: "100%",
                height: 1,
                backgroundColor: "border.default",
              }}
            ></Box>
            <Box>
              <Text
                sx={{
                  fontSize: 0,
                  fontWeight: "bold",
                  display: "block",
                  color: "fg.muted",
                }}
              >
                Labels
              </Text>
              <Text
                sx={{
                  fontSize: 0,
                  color: "fg.muted",
                  lineHeight: "condensed",
                }}
              >
                None yet
              </Text>
            </Box>
            <Box
              role="separator"
              sx={{
                width: "100%",
                height: 1,
                backgroundColor: "border.default",
              }}
            ></Box>
            <Box>
              <Text
                sx={{
                  fontSize: 0,
                  fontWeight: "bold",
                  display: "block",
                  color: "fg.muted",
                }}
              >
                Projects
              </Text>
              <Text
                sx={{
                  fontSize: 0,
                  color: "fg.muted",
                  lineHeight: "condensed",
                }}
              >
                None yet
              </Text>
            </Box>
            <Box
              role="separator"
              sx={{
                width: "100%",
                height: 1,
                backgroundColor: "border.default",
              }}
            ></Box>
            <Box>
              <Text
                sx={{
                  fontSize: 0,
                  fontWeight: "bold",
                  display: "block",
                  color: "fg.muted",
                }}
              >
                Milestone
              </Text>
              <Text
                sx={{
                  fontSize: 0,
                  color: "fg.muted",
                  lineHeight: "condensed",
                }}
              >
                None yet
              </Text>
            </Box>
            <Box
              role="separator"
              sx={{
                width: "100%",
                height: 1,
                backgroundColor: "border.default",
              }}
            ></Box>
            <Box>
              <Text
                sx={{
                  fontSize: 0,
                  fontWeight: "bold",
                  display: "block",
                  color: "fg.muted",
                }}
              >
                Development
              </Text>
              <Text
                sx={{
                  fontSize: 0,
                  color: "fg.muted",
                  lineHeight: "condensed",
                }}
              >
                No branches or pull requests
              </Text>
            </Box>
          </Box>
        </PageLayout.Pane>
      </PageLayout>
    </ThemeProvider>
  );
}

export default CommentPage;
