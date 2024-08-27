import { Box, Text, Avatar, Timeline, ActionMenu, ActionList, Button } from "@primer/react";
import { KebabHorizontalIcon, SmileyIcon } from "@primer/octicons-react";
import { withTheme } from "styled-components";

const getHeaderColor = (role) => {
  switch (role) {
    case "Owner":
      return "var(--bgColor-accent-muted)"; // Example color for Owner
    default:
      return "var(--control-bgColor-rest)"; // Default color
  }
};

const CommentItem = ({ user, role, time, content, isEdited, isDeleted, editedBy }) => {
  return (
    <>
      <Timeline.Item
        sx={{
          marginLeft: "0px",
          "::before": {
            left: "20px",
            zIndex: "-1 ",
          },
        }}
      >
        <Timeline.Badge sx={{ position: "absolute", left: "-30px", top: "10px" }}>
          <Avatar src={user.avatarUrl} alt={user.name} />
        </Timeline.Badge>
        <Timeline.Body sx={{ zIndex: 1, backgroundColor: "white" }}>
          <Box borderWidth={1} borderStyle="solid" borderColor="border.default" borderRadius={2}>
            <Box
              px={3}
              py={2}
              bg={getHeaderColor(role)}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px solid"
              borderColor="border.default"
              borderTopLeftRadius={2}
              borderTopRightRadius={2}
            >
              <Box>
                <Text fontWeight="bold">{user.name}</Text>
                {role && (
                  <Text ml={2} color="fg.muted">
                    {role}
                  </Text>
                )}
                <Text ml={2} color="fg.muted">
                  {time}
                </Text>
                {isEdited && (
                  <Text ml={2} color="fg.muted">
                    • edited by {editedBy}
                  </Text>
                )}
              </Box>
              {!isDeleted && (
                <ActionMenu>
                  <ActionMenu.Button
                    aria-label="Actions"
                    sx={{
                      '[data-component="trailingAction"]': { display: "none" },
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
                  <ActionMenu.Overlay>
                    <ActionList>
                      <ActionList.Item>Delete</ActionList.Item>
                      <ActionList.Item>Edit</ActionList.Item>
                    </ActionList>
                  </ActionMenu.Overlay>
                </ActionMenu>
              )}
            </Box>

            <Box p={3}>
              {isDeleted ? <Text color="fg.muted">This comment has been deleted</Text> : <Text>{content}</Text>}
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
          </Box>
        </Timeline.Body>
      </Timeline.Item>
    </>
  );
};

const IssueDiscussion2 = () => (
  <Timeline>
    <CommentItem
      user={{ name: "JuneLin2001", avatarUrl: "https://github.com/JuneLin2001.png" }}
      role="Owner"
      time="4 days ago"
      content="try use api to get"
    />
    <CommentItem
      user={{ name: "JuneLin2001", avatarUrl: "https://github.com/JuneLin2001.png" }}
      role="Owner • Author"
      time="4 days ago"
      content="測試三hdinasd1!!!!!!!!!!!!!!"
      isEdited
      editedBy="rebeccaS47"
    />
    <CommentItem
      user={{ name: "rebeccaS47", avatarUrl: "https://github.com/rebeccaS47.png" }}
      time="yesterday"
      content=""
      isDeleted
    />
    <CommentItem
      user={{ name: "hsin-2333", avatarUrl: "https://github.com/hsin-2333.png" }}
      role="Collaborator"
      time="15 minutes ago"
      content="test"
    />
    <Timeline.Break />
  </Timeline>
);

export default IssueDiscussion2;
