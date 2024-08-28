import { useContext } from "react";
import {
  Box,
  Timeline,
  Text,
  Label,
  ActionMenu,
  ActionList,
  RelativeTime,
  Button,
} from "@primer/react";
import { KebabHorizontalIcon, SmileyIcon } from "@primer/octicons-react";
import { CommentContext } from "./context/commentContext";
import CommentBox from "./comment";

const IssueBody = () => {
  const {
    issueData,
    editingCommentId,
    currentTextareaValue,
    handleDelete,
    handleUpdate,
    handleTextareaChange,
    setEditingCommentId,
    getHeaderColor,
  } = useContext(CommentContext);

  return (
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
            <Button variant="danger" onClick={() => setEditingCommentId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleUpdate(issueData.id, currentTextareaValue)}
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
  );
};

export default IssueBody;
