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
} from "@primer/react";

import { KebabHorizontalIcon } from "@primer/octicons-react";
function CommentPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { issue_number } = useParams();

  const owner = "JuneLin2001";
  const repo = "91APP_front-end-class";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("fetch到的資料", result);
        setData(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [issue_number]);

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
                      <ActionList.Item
                        onSelect={() => alert("Copy link clicked")}
                      >
                        Copy link
                      </ActionList.Item>
                      <ActionList.Item
                        onSelect={() => alert("Quote reply clicked")}
                      >
                        Quote reply
                      </ActionList.Item>
                      <ActionList.Item
                        onSelect={() => alert("Reference in new issue clicked")}
                      >
                        Reference in new issue
                      </ActionList.Item>
                      <ActionList.Divider />
                      <ActionList.Item
                        onSelect={() => alert("Edit comment clicked")}
                      >
                        Edit
                      </ActionList.Item>
                      <ActionList.Item
                        onSelect={() => alert("Hide comment clicked")}
                      >
                        Hide
                      </ActionList.Item>
                      <ActionList.Item
                        variant="danger"
                        onSelect={() => alert("Delete comment clicked")}
                      >
                        Delete
                      </ActionList.Item>
                      <ActionList.Divider />
                      <ActionList.Item
                        onSelect={() => alert("Delete file clicked")}
                      >
                        Report content
                      </ActionList.Item>
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
    </ThemeProvider>
  );
}

export default CommentPage;
