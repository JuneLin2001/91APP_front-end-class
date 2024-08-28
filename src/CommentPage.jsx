import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
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
import api from "./utils/api";
import CommentBox from "./comment";
import { AuthContext } from "./context/authContext";

function CommentPage() {
  const [issueData, setIssueData] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [currentTextareaValue, setCurrentTextareaValue] = useState("");
  const { issueNumber } = useParams();
  const { CRUDtoken } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const owner = "JuneLin2001";
  const repo = "91APP_front-end-class";

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

  const handleCreateComment = async (currentTextareaValue) => {
    console.log("現在的create textarea: ", currentTextareaValue);
    await api.createComment(
      owner,
      repo,
      issueNumber,
      currentTextareaValue,
      CRUDtoken
    );
    setCurrentTextareaValue("");
    fetchData();
  };

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
  if (!data) return <div>無數據</div>;

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

      <Timeline>
        {data.map((comment) => (
          <Timeline.Item
            key={comment.id}
            sx={{
              marginLeft: "0px",
              "::before": {
                left: "20px",
                zIndex: "-1 ",
              },
            }}
          >
            <Timeline.Badge
              sx={{
                position: "absolute",
                left: "-30px",
                top: "10px",
                width: "40px",
                height: "40px",
              }}
            >
              <Avatar
                size={40}
                src={comment.user.avatar_url}
                alt={comment.user.login}
              />
            </Timeline.Badge>
            <Timeline.Body
              bg="bg.muted"
              sx={{ zIndex: 1, backgroundColor: "white" }}
            >
              <Box
                borderWidth={1}
                borderStyle="solid"
                borderColor="border.default"
                borderRadius={2}
              >
                <Box
                  px={3}
                  py={2}
                  bg={getHeaderColor(comment.user.login)}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom="1px solid"
                  borderColor="border.default"
                  borderTopLeftRadius={2}
                  borderTopRightRadius={2}
                >
                  <Box>
                    <Text fontWeight="bold">
                      {comment.user.login} commented{" "}
                    </Text>
                    <Link href={comment.html_url}>
                      <RelativeTime date={new Date(comment.updated_at)} />
                    </Link>
                    {comment.author_association && (
                      <Label ml={2} color="fg.muted">
                        {comment.author_association}
                      </Label>
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
                        <ActionList.Item>
                          Reference in new issue
                        </ActionList.Item>
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
                    <>
                      <Box p={3}>
                        <Text>{comment.body}</Text>
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
            </Timeline.Body>
          </Timeline.Item>
        ))}

        <Timeline.Break />
      </Timeline>
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
