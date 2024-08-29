import { useContext } from "react";
import {
  Text,
  ActionMenu,
  ActionList,
  ThemeProvider,
  RelativeTime,
  Button,
  IconButton,
  PageHeader,
  StateLabel,
  Box,
  PageLayout,
  Link,
} from "@primer/react";
import { IssueClosedIcon, CopyIcon } from "@primer/octicons-react";
import { CommentContext } from "./context/commentContext";
import CommentBox from "./comment";
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
  } = useContext(CommentContext);

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;
  if (!commentData) return <div>無數據</div>;

  return (
    <ThemeProvider>
      <PageLayout>
        <PageLayout.Header>
          <PageHeader>
            <PageHeader.TitleArea>
              <PageHeader.Title as="h1">
                {issueData.title} &nbsp;
                <Link
                  href="https://github.com/github/primer/issues/1115"
                  sx={{
                    color: "fg.muted",
                    fontWeight: "light",
                  }}
                >
                  #{issueData.number}
                </Link>
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
                    alert("This button copies the permalink to the clipboard");
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
                <StateLabel
                  sx={{
                    marginRight: "8px",
                  }}
                  status="issueOpened"
                >
                  Open
                </StateLabel>
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

        {/* <Pagehead>
        <PageHeader.Title
          sx={{
            lineHeight: "1.25",
            fontWeight: "normal",
            fontSize: ["26px", "26px", "var(--text-title-size-large, 32px)"],
          }}
        >
          {issueData.title}
        </PageHeader.Title>
        <p color="f1-light color-fg-muted">#{issueData.number}</p>
        <StateLabel status="issueOpened">{issueData.state}</StateLabel>
        <Text fontWeight="bold">{issueData.user.login}</Text>
        <Text color="fg.muted"> opened this issue </Text>
        <RelativeTime date={new Date(issueData.created_at)} color="fg.muted" />
        <Text color="fg.muted"> · {issueData.comments} comments</Text>
      </Pagehead> */}
        <PageLayout.Content>
          <IssueBody />
          <TimelineComment />
          <h4>Add a comment </h4>
          <CommentBox onTextareaChange={handleTextareaChange} />
          <Box
            mt={3}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <ActionMenu>
              <ActionMenu.Button
                aria-label="Close issue"
                sx={{ display: "flex", alignItems: "center", mr: 2 }}
              >
                <IssueClosedIcon
                  sx={{
                    backgroundColor: "success.fg",
                    color: "fg.done",
                    mr: 3,
                    pr: 5,
                  }}
                  mr={1}
                  size={16}
                />{" "}
                Close issue
              </ActionMenu.Button>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Item>
                    <IssueClosedIcon className="color-fg-done" size={16} />
                    Close and cent
                  </ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
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
