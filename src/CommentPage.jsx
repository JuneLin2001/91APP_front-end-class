import { useContext } from "react";
import {
  Box,
  Text,
  ActionMenu,
  ActionList,
  ThemeProvider,
  RelativeTime,
  Button,
  Pagehead,
  PageHeader,
  StateLabel,
} from "@primer/react";
import { IssueClosedIcon, MarkdownIcon } from "@primer/octicons-react";
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
      <Pagehead>
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
      </Pagehead>
      <IssueBody />
      <TimelineComment />
      <h4>Add a comment </h4>
      <CommentBox onTextareaChange={handleTextareaChange} />
      <Box mt={3} display="flex" justifyContent="flex-end" alignItems="center">
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
    </ThemeProvider>
  );
}

export default CommentPage;
