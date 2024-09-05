import { useState, useRef } from "react";

import { Box, TabNav, Textarea, Text, Button, ActionBar } from "@primer/react";
import { MarkdownIcon, FileMediaIcon } from "@primer/octicons-react";
import PropType from "prop-types";
import actionBarButtons from "../../constants/actionBarButtons";
import MarkdownPreview from "../../components/MarkdownPreview";

const CommentBox = ({ initialValue, onTextareaChange, hasMarkdownBtn }) => {
  const [inputValue, setInputValue] = useState(initialValue || "");
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef(null);

  const handleTabClick = (tab) => {
    setIsPreview(tab === "Preview");
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onTextareaChange(newValue);
  };

  // useEffect(() => {
  //   setInputValue(initialValue || "");
  // }, [initialValue]);

  const handleActionClick = (action) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputValue.substring(start, end);
    const newText = action(selectedText);
    const newValue =
      inputValue.substring(0, start) + newText + inputValue.substring(end);
    setInputValue(newValue);
    onTextareaChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + newText.length;
    }, 0);
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
              {actionBarButtons.map((button, index) => (
                <ActionBar.IconButton
                  key={index}
                  icon={button.icon}
                  variant="invisible"
                  aria-label={button.ariaLabel}
                  onClick={() => handleActionClick(button.action)}
                />
              ))}
            </ActionBar>
          </Box>
        </Box>
      </TabNav>
      <Box m={2}>
        {!isPreview ? (
          <>
            <Textarea
              ref={textareaRef}
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
              <MarkdownPreview content={inputValue} />
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
  hasMarkdownBtn: PropType.bool,
};

export default CommentBox;
