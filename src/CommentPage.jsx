import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Timeline,
  Avatar,
  Text,
  Label,
  ActionMenu,
  ActionList,
  IconButton,
  ThemeProvider,
  RelativeTime,
  Button,
} from "@primer/react";
import { KebabHorizontalIcon } from "@primer/octicons-react";
import api from "./utils/api";
import CommentBox from "./comment";
import { AuthContext } from "./context/authContext";
import { useContext } from "react";
import IssueDiscussion2 from "./TimelineComment";
function CommentPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [currentTextareaValue, setCurrentTextareaValue] = useState("");
  const { issueNumber } = useParams();
  const { CRUDtoken } = useContext(AuthContext);

  const owner = "rebeccaS47";
  const repo = "Wordle";

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        setLoading(true);
        const timestamp = new Date().getTime();
        const issueBodyData = await api.getIssueBody(
          owner,
          repo,
          issueNumber,
          CRUDtoken
        );
        const commentsData = await api.getIssueComments(
          owner,
          repo,
          issueNumber,
          timestamp
        );
        console.log("fetch到的資料", commentsData);
        console.log("fetch到的issueBodyData", issueBodyData);
        setIssueData(issueBodyData);
        setData(commentsData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitData();
  }, [issueNumber, CRUDtoken]);

  const fetchData = async () => {
    try {
      const timestamp = new Date().getTime();
      const commentsData = await api.getIssueComments(
        owner,
        repo,
        issueNumber,
        timestamp
      );
      console.log("不是首次fetch到的資料", commentsData);
      setData(commentsData);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const userConfirmed = confirm("Are you sure you want to delete this?");
      if (userConfirmed) {
        await api.deleteComment(owner, repo, commentId, CRUDtoken);
        fetchData();
      }
    } catch (e) {
      console.error("删除失敗", e.message);
    }
  };

  const handleUpdate = async (commentId, newContent) => {
    try {
      console.log("新的內容：", newContent);
      await api.updateComment(owner, repo, commentId, newContent, CRUDtoken);
      setEditingCommentId(null);
      fetchData();
    } catch (e) {
      console.error("修改失敗", e.message);
    }
  };

  const handleTextareaChange = (value) => {
    setCurrentTextareaValue(value);
  };

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;
  if (!data) return <div>無數據</div>;

  return (
    <ThemeProvider>
      <Timeline>
        {data.map((comment) => (
          <Timeline.Item key={comment.id} display="flex" mb={3}>
            <Avatar size={40} src={comment.user.avatar_url} alt="User Avatar" />
            <Timeline.Body
              ml={6}
              flex={1}
              borderWidth={1}
              borderStyle="solid"
              borderColor="border.default"
              borderRadius={2}
              bg="canvas.subtle"
              p={3}
            >
              <Box>
                <Text>{comment.user.login} commented </Text>
                <RelativeTime date={new Date(comment.updated_at)} />
                <Label>{comment.author_association}</Label>
                <Label>Author</Label>
                <ActionMenu>
                  <ActionMenu.Anchor>
                    <IconButton
                      icon={KebabHorizontalIcon}
                      unsafeDisableTooltip={false}
                      variant="invisible"
                    />
                  </ActionMenu.Anchor>
                  <ActionMenu.Overlay width="medium">
                    <ActionList>
                      <ActionList.Item>Copy link</ActionList.Item>
                      <ActionList.Item>Quote reply</ActionList.Item>
                      <ActionList.Item>Reference in new issue</ActionList.Item>
                      <ActionList.Divider />
                      <ActionList.Item
                        onSelect={() => setEditingCommentId(comment.id)}
                      >
                        Edit
                      </ActionList.Item>
                      <ActionList.Item>Hide</ActionList.Item>
                      <ActionList.Item
                        variant="danger"
                        onClick={() => handleDelete(comment.id)}
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
                {editingCommentId === comment.id ? (
                  <>
                    <CommentBox
                      initialValue={comment.body}
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
                        handleUpdate(comment.id, currentTextareaValue)
                      }
                    >
                      Update comment
                    </Button>
                  </>
                ) : (
                  <Text>{comment.body}</Text>
                )}
              </Box>
            </Timeline.Body>
          </Timeline.Item>
        ))}
        <Timeline.Break />
      </Timeline>
      <CommentBox />
      <IssueDiscussion2 />
    </ThemeProvider>
  );
}

export default CommentPage;
