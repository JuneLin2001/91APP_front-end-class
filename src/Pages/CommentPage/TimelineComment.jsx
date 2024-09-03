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
  Octicon,
} from "@primer/react";
import {
  KebabHorizontalIcon,
  SmileyIcon,
  XIcon,
  IssueClosedIcon,
  IssueReopenedIcon,
  TagIcon,
  SkipIcon,
  PencilIcon,
} from "@primer/octicons-react";
import React, { useContext } from "react";
import { CommentContext } from "../../context/commentContext";
import { IssueContext } from "../../context/issueContext";
import CommentBox from "./CommentBox";
import IssueLabels from "../../components/IssueLabels";

const TimelineComment = () => {
  const {
    commentData,
    editingCommentId,
    currentTextareaValue,
    handleDeleteComment,
    handleUpdateComment,
    handleTextareaChange,
    setEditingCommentId,
    getHeaderColor,
  } = useContext(CommentContext);
  const { labels } = useContext(IssueContext);

  const eventMapping = {
    comment_deleted: {
      iconName: XIcon,
      content: "deleted a comment from ",
    },
    closed: {
      not_planned: {
        iconName: SkipIcon,
        content: "closed this as not planned ",
      },
      null: {
        iconName: IssueClosedIcon,
        content: "closed this as completed ",
        iconColor: "var(--bgColor-default)",
        backgroundColor: "var(--bgColor-done-emphasis)",
      },
    },
    reopened: {
      iconName: IssueReopenedIcon,
      content: "reopened this ",
      iconColor: "var(--bgColor-default)",
      backgroundColor: "var(--bgColor-open-emphasis)",
    },
    renamed: {
      iconName: PencilIcon,
      content: "changed the title ",
    },
    labeling: {
      iconName: TagIcon,
    },
  };
  return (
    <Timeline>
      {commentData.map((comment) =>
        comment.event === "commented" ? (
          <Timeline.Item
            key={comment.id}
            id={`event-${comment.id}`}
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
                left: "-40px",
                top: "0px",
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
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderTopLeftRadius={2}
                  borderTopRightRadius={2}
                  borderBottomLeftRadius={0}
                  borderBottomRightRadius={0}
                  border="none"
                  bg={getHeaderColor(comment.actor.login)}
                  borderColor="border.default"
                >
                  <Box>
                    <Text fontWeight="bold">
                      {comment.actor.login} commented{" "}
                    </Text>
                    {comment.updated_at && (
                      <Link href={`#event-${comment.id}`}>
                        <RelativeTime date={new Date(comment.updated_at)} />
                      </Link>
                    )}
                  </Box>
                  <Box display="flex" alignItems="center">
                    {comment.author_association && (
                      <Label ml={2} color="fg.muted">
                        {comment.author_association}
                      </Label>
                    )}
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
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Delete
                          </ActionList.Item>
                          <ActionList.Divider />
                          <ActionList.Item>Report content</ActionList.Item>
                        </ActionList>
                      </ActionMenu.Overlay>
                    </ActionMenu>
                  </Box>
                </PointerBox>
                <Box borderTop="1px solid var(--borderColor-default)" p={2}>
                  {editingCommentId === comment.id ? (
                    <>
                      <CommentBox
                        initialValue={comment.body}
                        onTextareaChange={handleTextareaChange}
                        hasMarkdownBtn={false}
                      />
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        mt={2}
                        sx={{ gap: 2 }}
                      >
                        <Button
                          variant="danger"
                          onClick={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleUpdateComment(
                              comment.id,
                              currentTextareaValue
                            )
                          }
                        >
                          Update comment
                        </Button>
                      </Box>
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
                            fontSize: "14px",
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
        ) : (
          (() => {
            const eventConfig =
              eventMapping[comment.event]?.[comment.state_reason] ||
              eventMapping[comment.event];

            if (!eventConfig) {
              return null;
            }

            const { iconName, content, iconColor, backgroundColor } =
              eventConfig;

            return (
              <Box key={comment.id} id={`event-${comment.id}`} ml={1}>
                <Timeline.Item>
                  <Timeline.Badge sx={{ backgroundColor: backgroundColor }}>
                    <Octicon icon={iconName} color={iconColor} />
                  </Timeline.Badge>
                  <Timeline.Body>
                    <Avatar
                      size={20}
                      src={comment.actor.avatar_url}
                      alt={comment.actor.login}
                    />
                    <Link
                      href={comment.actor.html_url}
                      sx={{
                        fontWeight: "bold",
                        color: "fg.default",
                        mr: 1,
                      }}
                      muted
                    >
                      {" "}
                      {comment.actor.login}
                    </Link>
                    {content}
                    {comment.event === "renamed" && (
                      <>
                        <Text
                          sx={{
                            textDecoration: "line-through",
                            fontWeight:
                              "var(--base-text-weight-semibold, 600) !important",
                          }}
                        >
                          {" "}
                          {comment.rename?.from}{" "}
                        </Text>
                        <Text
                          sx={{
                            fontWeight:
                              "var(--base-text-weight-semibold, 600) !important",
                          }}
                        >
                          {comment.rename?.to}{" "}
                        </Text>
                      </>
                    )}

                    {comment.labeledLabels?.length > 0 && (
                      <React.Fragment>
                        {comment.labeledLabels.map((label, index) => {
                          const matchingLabel = labels.find(
                            (labels) => labels.name === label.name
                          );
                          const description = matchingLabel
                            ? matchingLabel.description
                            : null;

                          return (
                            <React.Fragment key={index}>
                              <IssueLabels
                                key={index}
                                name={label.name}
                                color={label.color}
                                description={description}
                              />
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    )}

                    {comment.unlabeledLabels?.length > 0 && (
                      <React.Fragment>
                        <Text>
                          {" "}
                          {comment.labeledLabels.length > 0 &&
                            "and "}removed {""}
                        </Text>

                        {comment.unlabeledLabels.map((label, index) => {
                          const matchingLabel = labels.find(
                            (labels) => labels.name === label.name
                          );
                          const description = matchingLabel
                            ? matchingLabel.description
                            : null;

                          return (
                            <React.Fragment key={index}>
                              <IssueLabels
                                key={index}
                                name={label.name}
                                color={label.color}
                                description={description}
                              />
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    )}
                    <Link href={`#event-${comment.id}`}>
                      <RelativeTime date={new Date(comment.created_at)} />
                    </Link>
                  </Timeline.Body>
                </Timeline.Item>
              </Box>
            );
          })()
        )
      )}

      <Timeline.Break />
    </Timeline>
  );
};

export default TimelineComment;
