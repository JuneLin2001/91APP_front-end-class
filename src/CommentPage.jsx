import { useState, useEffect } from "react";
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
} from "@primer/react";
import { KebabHorizontalIcon } from "@primer/octicons-react";
import api from "./utils/api";
import CommentBox from "./comment";

function CommentPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const owner = "rebeccaS47";
  const repo = "Wordle";
  const issue_number = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const commentsData = await api.getIssueComments(owner, repo, issue_number);
        console.log("fetch到的資料", commentsData);
        setData(commentsData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;
  if (!data) return <div>無數據</div>;

  return (
    <ThemeProvider>
      <Timeline>
        {data.map((comment) => (
          <Timeline.Item key={comment.id}>
            <Avatar size={40} src={comment.user.avatar_url} alt="User Avatar" />
            <Timeline.Body ml={6} borderColor-accent-muted borderWidth={1}>
              <Box>
                <Text>{comment.user.login}</Text>
                {/* <Text>commented{comment.updated_at}</Text> */}
                <RelativeTime date={new Date(comment.updated_at)} />
                <Label>{comment.author_association}</Label>
                <Label>Author</Label>
                <ActionMenu>
                  <ActionMenu.Anchor>
                    <IconButton icon={KebabHorizontalIcon} unsafeDisableTooltip={false} variant="invisible" />
                  </ActionMenu.Anchor>

                  <ActionMenu.Overlay width="medium">
                    <ActionList>
                      <ActionList.Item onSelect={() => alert("Copy link clicked")}>Copy link</ActionList.Item>
                      <ActionList.Item onSelect={() => alert("Quote reply clicked")}>Quote reply</ActionList.Item>
                      <ActionList.Item onSelect={() => alert("Reference in new issue clicked")}>
                        Reference in new issue
                      </ActionList.Item>
                      <ActionList.Divider />
                      <ActionList.Item onSelect={() => alert("Edit comment clicked")}>Edit</ActionList.Item>
                      <ActionList.Item onSelect={() => alert("Hide comment clicked")}>Hide</ActionList.Item>
                      <ActionList.Item variant="danger" onSelect={() => alert("Delete comment clicked")}>
                        Delete
                      </ActionList.Item>
                      <ActionList.Divider />
                      <ActionList.Item onSelect={() => alert("Delete file clicked")}>Report content</ActionList.Item>
                    </ActionList>
                  </ActionMenu.Overlay>
                </ActionMenu>
              </Box>
              <Box>
                <Text>{comment.body}</Text>
              </Box>
            </Timeline.Body>
          </Timeline.Item>
        ))}
      </Timeline>
      <CommentBox />
    </ThemeProvider>
  );
}

export default CommentPage;
