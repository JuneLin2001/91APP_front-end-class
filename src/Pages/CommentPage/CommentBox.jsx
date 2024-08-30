import { useState } from "react";

import {
  Box,
  TabNav,
  Textarea,
  Text,
  IconButton,
  Button,
  ActionBar,
} from "@primer/react";
import {
  CrossReferenceIcon,
  MarkdownIcon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListUnorderedIcon,
  ListOrderedIcon,
  QuoteIcon,
  MentionIcon,
  CodeIcon,
  ReplyIcon,
  HeadingIcon,
  PaperclipIcon,
  FileMediaIcon,
  DiffIgnoredIcon,
} from "@primer/octicons-react";
import PropType from "prop-types";

const CommentBox = ({ initialValue, onTextareaChange, hasMarkdownBtn }) => {
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
      <TabNav aria-label="Comment" sx={{ height: "39px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "canvas.subtle",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            justifyContent: "space-between",
            width: "-webkit-fill-available",
            height: "39px",
            alignItems: "center",
          }}
          as="header"
        >
          <Box sx={{ width: "20%", padding: "2px 0px", height: "34px" }}>
            <TabNav.Link
              selected={!isPreview}
              onClick={() => handleTabClick("Write")}
              sx={{ width: "50%", padding: "8px 16px" }}
            >
              Write
            </TabNav.Link>
            <TabNav.Link
              selected={isPreview}
              onClick={() => handleTabClick("Preview")}
              sx={{ width: "50%", padding: "8px 16px" }}
            >
              Preview
            </TabNav.Link>
          </Box>

          <Box sx={{ width: "80%" }}>
            <ActionBar>
              <ActionBar.IconButton
                icon={HeadingIcon}
                variant="invisible"
                aria-label="Attach files"
                key="HeadingIcon"
              />
              <ActionBar.IconButton
                icon={BoldIcon}
                variant="invisible"
                aria-label="Bold"
                key="BoldIcon"
              />
              <ActionBar.IconButton
                icon={ItalicIcon}
                variant="invisible"
                aria-label="Italic"
                key="ItalicIcon"
              />
              <ActionBar.IconButton
                icon={CodeIcon}
                variant="invisible"
                aria-label="Code"
                key="CodeIcon"
              />
              <ActionBar.IconButton
                icon={LinkIcon}
                variant="invisible"
                aria-label="Link"
                key="LinkIcon"
              />
              <ActionBar.IconButton
                icon={ListUnorderedIcon}
                variant="invisible"
                aria-label="Unordered list"
                key="ListUnorderedIcon"
              />
              <ActionBar.IconButton
                icon={ListOrderedIcon}
                variant="invisible"
                aria-label="Ordered list"
                key="ListOrderedIcon"
              />
              <ActionBar.IconButton
                icon={QuoteIcon}
                variant="invisible"
                aria-label="Quote"
                key="QuoteIcon"
              />
              <ActionBar.IconButton
                icon={PaperclipIcon}
                variant="invisible"
                aria-label="Data files attachment"
                key="PaperclipIcon"
              />
              <ActionBar.IconButton
                icon={MentionIcon}
                variant="invisible"
                aria-label="Mention"
                key="MentionIcon"
              />
              <ActionBar.IconButton
                icon={CrossReferenceIcon}
                variant="invisible"
                aria-label="Mention"
                key="CrossReferenceIcon"
              />
              <ActionBar.IconButton
                icon={ReplyIcon}
                variant="invisible"
                aria-label="Mention"
                key="ReplyIcon"
              />
              <ActionBar.IconButton
                icon={DiffIgnoredIcon}
                variant="invisible"
                aria-label="Mention"
                key="DiffIgnoredIcon"
              />
            </ActionBar>
          </Box>
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
            {hasMarkdownBtn ? (
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
            ) : null}
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
