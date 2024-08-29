import {
  Box,
  Text,
  Avatar,
  Timeline,
  ActionMenu,
  ActionList,
  Button,
  RelativeTime,
  Label,
  Link,
  PointerBox,
} from "@primer/react";
import { KebabHorizontalIcon, SmileyIcon } from "@primer/octicons-react";
import { useContext } from "react";
import { CommentContext } from "./context/commentContext";
import CommentBox from "./comment";

const TimelineComment = () => {
  const {
    commentData,
    editingCommentId,
    currentTextareaValue,
    handleDelete,
    handleUpdate,
    handleTextareaChange,
    setEditingCommentId,
    getHeaderColor,
  } = useContext(CommentContext);

  return (
    <Timeline>
      {commentData.map((comment) => (
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
              src={comment.actor.avatar_url}
              alt={comment.actor.login}
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
              <PointerBox
                caret="left-top"
                px={3}
                py={2}
                bg={getHeaderColor(comment.actor.login)}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderColor="border.default"
                borderTopLeftRadius={2}
                borderTopRightRadius={2}
              >
                <Box>
                  <Text fontWeight="bold">
                    {comment.actor.login} commented{" "}
                  </Text>
                  {comment.updated_at && (
                    <Link href={comment.html_url}>
                      <RelativeTime date={new Date(comment.updated_at)} />
                    </Link>
                  )}

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
              </PointerBox>
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
  );
};

export default TimelineComment;
