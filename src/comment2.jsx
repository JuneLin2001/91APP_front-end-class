import React, { useState } from "react";
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

const CommentBox2 = () => {
  const [inputValue, setInputValue] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const handleTabClick = (tab) => {
    setIsPreview(tab === "Preview");
  };

  return (
    <Box borderWidth={1} borderColor="border.default" borderRadius={2} p={3} bg="canvas.default">
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
            placeholder="Leave a comment"
            aria-label="Comment"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ width: "100%", height: "150px", resize: "none" }}
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
        <Text display="flex" alignItems="center">
          <MarkdownIcon /> Markdown is supported
          <Text as="span" ml={2} variant="secondary">
            Paste, drop, or click to add files
          </Text>
        </Text>
      </Box>

      <Box mt={3} display="flex" justifyContent="flex-end" alignItems="center">
        <Button aria-label="Close issue" variant="invisible" sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <IssueClosedIcon color="fg.done" mr={1} />
          Close issue
        </Button>

        <Button variant="primary">Comment</Button>
      </Box>
    </Box>
  );
};

export default CommentBox2;
