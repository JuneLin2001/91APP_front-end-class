import { useState } from "react";

import { Box, Button, TabNav, Textarea, Text, IconButton, ActionList, ActionMenu } from "@primer/react";
import {
  FileIcon,
  MarkdownIcon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListUnorderedIcon,
  ListOrderedIcon,
  QuoteIcon,
  MentionIcon,
  CodeIcon,
  IssueClosedIcon,
} from "@primer/octicons-react";

const CommentBox = () => {
  const [inputValue, setInputValue] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const handleTabClick = (tab) => {
    setIsPreview(tab === "Preview");
  };
  return (
    <Box borderWidth={1} borderStyle="solid" borderColor="border.default" borderRadius={2} p={3} bg="canvas.default">
      <TabNav aria-label="Comment">
        <TabNav.Link selected={!isPreview} onClick={() => handleTabClick("Write")}>
          Write
        </TabNav.Link>
        <TabNav.Link selected={isPreview} onClick={() => handleTabClick("Preview")}>
          Preview
        </TabNav.Link>
        <Box>
          <IconButton icon={FileIcon} aria-label="Attach files" mr={2} />
          <IconButton icon={BoldIcon} aria-label="Bold" mr={2} />
          <IconButton icon={ItalicIcon} aria-label="Italic" mr={2} />
          <IconButton icon={CodeIcon} aria-label="Code" mr={2} />
          <IconButton icon={LinkIcon} aria-label="Link" mr={2} />
          <IconButton icon={ListUnorderedIcon} aria-label="Unordered list" mr={2} />
          <IconButton icon={ListOrderedIcon} aria-label="Ordered list" mr={2} />
          <IconButton icon={QuoteIcon} aria-label="Quote" mr={2} />
          <IconButton icon={MentionIcon} aria-label="Mention" mr={2} />
        </Box>
      </TabNav>

      <Box mt={3}>
        {!isPreview ? (
          <Textarea
            placeholder="Add your comment here..."
            aria-label="Comment"
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ width: "100%", height: "100%", resize: "none" }}
          />
        ) : (
          <Box p={3} borderColor="border.default" borderWidth={1} borderStyle="solid">
            {inputValue.trim() ? (
              <Text>{inputValue}</Text>
            ) : (
              <Text color="fg.muted" sx={{ width: "400px", height: "150px", resize: "none" }}>
                Nothing to preview
              </Text>
            )}
          </Box>
        )}
      </Box>

      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Text>
          <MarkdownIcon /> Markdown is supported
        </Text>
      </Box>

      <Box mt={3} display="flex" justifyContent="flex-end" alignItems="center">
        <ActionMenu>
          <ActionMenu.Button aria-label="Close issue" sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <IssueClosedIcon
              sx={{
                backgroundColor: "success.fg",
                color: "fg.done",
              }}
              mr={1}
              size={16}
            />
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
        <Button variant="primary">Comment</Button>
      </Box>
    </Box>
  );
};

export default CommentBox;
