import { useContext } from "react";

import {
  Box,
  Timeline,
  Avatar,
  Text,
  Label,
  ActionMenu,
  ActionList,
  ThemeProvider,
  RelativeTime,
  Button,
  Pagehead,
  PageHeader,
  Link,
  StateLabel,
  Tooltip,
} from "@primer/react";
import {
  KebabHorizontalIcon,
  SmileyIcon,
  IssueClosedIcon,
  MarkdownIcon,
} from "@primer/octicons-react";

import CommentBox from "./comment";
import TimelineComment from "./TimelineComment";
import { AuthContext } from "./context/authContext";
import { CommentContext } from "./context/commentContext";
function CommentPage() {
  const { user } = useContext(AuthContext);

  const {
    issueData,
    commentData,
    loading,
    error,
    editingCommentId,
    currentTextareaValue,

    handleDelete,
    handleUpdate,
    handleTextareaChange,
    handleCreateComment,
    setEditingCommentId,
  } = useContext(CommentContext);

  const getHeaderColor = (userLogin) => {
    if (
      Object.keys(user).length !== 0 &&
      user.reloadUserInfo.screenName === userLogin
    ) {
      return "var(--bgColor-accent-muted)";
    }
    return "var(--control-bgColor-rest)";
  };

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
      {issueData && (
        <Box
          borderWidth={1}
          borderStyle="solid"
          borderColor="border.default"
          borderRadius={2}
        >
          <Box
            px={3}
            py={2}
            bg={getHeaderColor(issueData.user.login)}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom="1px solid"
            borderColor="border.default"
            borderTopLeftRadius={2}
            borderTopRightRadius={2}
          >
            <Box>
              <Text fontWeight="bold">{issueData.user.login} commented </Text>

              <RelativeTime date={new Date(issueData.created_at)} />

              {issueData.author_association === "OWNER" && (
                //<Tooltip aria-label="Hello, Tooltip!">
                <Label ml={2} color="fg.muted">
                  {issueData.author_association}
                </Label>
                //</Tooltip>
              )}
            </Box>

            <ActionMenu>
              <ActionMenu.Button
                aria-label="Actions"
                sx={{
                  '[data-component="trailingAction"]': {
                    display: "none",
                  },
                  border: "none",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "&:focus": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "&:active": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "&:hover:not([disabled]):not([data-inactive])": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "& svg": {
                    color: "currentColor",
                    "&:hover": {
                      color: "var(--bgColor-accent-emphasis)",
                    },
                    "&:focus": {
                      color: "var(--bgColor-accent-emphasis)",
                    },
                  },
                  "&[aria-expanded='true']": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <KebabHorizontalIcon />
              </ActionMenu.Button>
              <ActionMenu.Overlay width="medium">
                <ActionList>
                  <ActionList.Item>Copy link</ActionList.Item>
                  <ActionList.Item>Quote reply</ActionList.Item>
                  <ActionList.Item>Reference in new issue</ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item
                    onSelect={() => setEditingCommentId(issueData.id)}
                  >
                    Edit
                  </ActionList.Item>
                  <ActionList.Item>Hide</ActionList.Item>
                  <ActionList.Item
                    variant="danger"
                    onClick={() => handleDelete(issueData.id)}
                  >
                    Delete
                  </ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item>Report content</ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </Box>
          <Box>
            {editingCommentId === issueData.id ? (
              <>
                <CommentBox
                  initialValue={issueData.body}
                  onTextareaChange={handleTextareaChange}
                />
                <Button
                  variant="danger"
                  onClick={() => setEditingCommentId(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    handleUpdate(issueData.id, currentTextareaValue)
                  }
                >
                  Update comment
                </Button>
              </>
            ) : (
              <>
                <Box p={3}>
                  <Text>{issueData.body}</Text>
                </Box>
                <Box px={3} pb={3} display="flex" alignItems="center">
                  <Timeline.Badge
                    variant="invisible"
                    sx={{
                      fontSixe: "14px",
                      display: "flex",
                      padding: "0px",
                      width: "26px",
                      height: "26px",
                      marginLeft: "0",
                    }}
                  >
                    <SmileyIcon />
                  </Timeline.Badge>
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
      <TimelineComment />
      <h4>Add a comment </h4>
      <CommentBox onTextareaChange={handleTextareaChange} />
      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>
          <MarkdownIcon /> Markdown is supported
        </Text>
      </Box>

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
