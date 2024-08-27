import { useState } from "react";

import { Box, TabNav, Textarea, Text, IconButton } from "@primer/react";
import {
  FileIcon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListUnorderedIcon,
  ListOrderedIcon,
  QuoteIcon,
  MentionIcon,
  CodeIcon,
} from "@primer/octicons-react";
import PropType from "prop-types";

const CommentBox = ({ initialValue, onTextareaChange }) => {
  const [inputValue, setInputValue] = useState(initialValue || "");
  const [isPreview, setIsPreview] = useState(false);

  const handleTabClick = (tab) => {
    setIsPreview(tab === "Preview");
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onTextareaChange(newValue);
  };
  return (
    <Box
      borderWidth={1}
      borderStyle="solid"
      borderColor="border.default"
      borderRadius={2}
      p={3}
      bg="canvas.default"
    >
      <TabNav aria-label="Comment">
        <TabNav.Link
          selected={!isPreview}
          onClick={() => handleTabClick("Write")}
        >
          Write
        </TabNav.Link>
        <TabNav.Link
          selected={isPreview}
          onClick={() => handleTabClick("Preview")}
        >
          Preview
        </TabNav.Link>
        <Box>
          <IconButton icon={FileIcon} aria-label="Attach files" mr={2} />
          <IconButton icon={BoldIcon} aria-label="Bold" mr={2} />
          <IconButton icon={ItalicIcon} aria-label="Italic" mr={2} />
          <IconButton icon={CodeIcon} aria-label="Code" mr={2} />
          <IconButton icon={LinkIcon} aria-label="Link" mr={2} />
          <IconButton
            icon={ListUnorderedIcon}
            aria-label="Unordered list"
            mr={2}
          />
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
            value={inputValue}
            onChange={handleInputChange}
            sx={{ width: "100%", height: "100%", resize: "none" }}
          />
        ) : (
          <Box
            p={3}
            borderColor="border.default"
            borderWidth={1}
            borderStyle="solid"
          >
            {inputValue.trim() ? (
              <Text>{inputValue}</Text>
            ) : (
              <Text
                color="fg.muted"
                sx={{ width: "400px", height: "150px", resize: "none" }}
              >
                Nothing to preview
              </Text>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

CommentBox.propTypes = {
  initialValue: PropType.string,
  onTextareaChange: PropType.func,
};

export default CommentBox;
