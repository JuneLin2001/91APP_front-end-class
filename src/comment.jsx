import { useState } from "react";

import { Box, TabNav, Textarea, Text, IconButton, Button } from "@primer/react";
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
  HeadingIcon,
  PaperclipIcon,
  FileMediaIcon,
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
          <IconButton
            icon={HeadingIcon}
            variant="invisible"
            aria-label="Attach files"
            mr={2}
          />
          <IconButton
            icon={BoldIcon}
            variant="invisible"
            aria-label="Bold"
            mr={2}
          />
          <IconButton
            icon={ItalicIcon}
            variant="invisible"
            aria-label="Italic"
            mr={2}
          />
          <IconButton
            icon={CodeIcon}
            variant="invisible"
            aria-label="Code"
            mr={2}
          />
          <IconButton
            icon={LinkIcon}
            variant="invisible"
            aria-label="Link"
            mr={2}
          />
          <IconButton
            icon={ListUnorderedIcon}
            variant="invisible"
            aria-label="Unordered list"
            mr={2}
          />
          <IconButton
            icon={ListOrderedIcon}
            variant="invisible"
            aria-label="Ordered list"
            mr={2}
          />
          <IconButton
            icon={QuoteIcon}
            variant="invisible"
            aria-label="Quote"
            mr={2}
          />
          <IconButton
            icon={PaperclipIcon}
            variant="invisible"
            aria-label="Data files attachment"
            mr={2}
          />
          <IconButton
            icon={MentionIcon}
            variant="invisible"
            aria-label="Mention"
            mr={2}
          />
        </Box>
      </TabNav>

      <Box m={2}>
        {!isPreview ? (
          <>
            <Textarea
              placeholder="Add your comment here..."
              aria-label="Comment"
              value={inputValue}
              onChange={handleInputChange}
              sx={{ width: "100%", height: "100%", resize: "none" }}
            />
            <Box
              mt={2}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Box>
                <Button
                  variant="invisible"
                  size="small"
                  leadingVisual={MarkdownIcon}
                >
                  Markdown is supported
                </Button>
              </Box>
              <Box
                role="separator"
                mx={1}
                sx={{
                  width: 1,
                  backgroundColor: "#e1e4e8",
                }}
              ></Box>
              <Box>
                <Button
                  variant="invisible"
                  size="small"
                  leadingVisual={FileMediaIcon}
                >
                  Paste, drop, or click to add files
                </Button>
              </Box>
            </Box>
          </>
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
