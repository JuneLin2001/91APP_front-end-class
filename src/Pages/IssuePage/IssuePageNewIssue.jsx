import { useContext } from "react";
import {
  Button,
  ThemeProvider,
  Box,
  PageLayout,
  TextInput,
} from "@primer/react";
import { IssueContext } from "../../context/issueContext";
import CommentBox from "../CommentPage/CommentBox";
import PageLayoutPane from "../CommentPage/PageLayoutPane";
function IssuePageNewIssue() {
  const {
    title, // 從 context 中獲取 title
    setTitle, // 從 context 中獲取 setTitle 函數
    currentTextareaValue,
    handleTextareaChange,
    handleCreateIssue,
  } = useContext(IssueContext);

  const isSubmitDisabled = !title.trim() || !currentTextareaValue.trim();

  return (
    <ThemeProvider>
      <PageLayout>
        <PageLayout.Content>
          <Box
          // ={7}
          >
            <h4>Add a title</h4>
            <TextInput
              placeholder="Enter the title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* 內容輸入框 */}
            <h4>Write a comment</h4>
            <CommentBox
              onTextareaChange={handleTextareaChange}
              hasMarkdownBtn={true}
              value={currentTextareaValue}
            />

            <Box
              mt={3}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              sx={{ gap: 2 }}
            >
              <Button
                variant="primary"
                onClick={() => handleCreateIssue(title, currentTextareaValue)} // 使用 handleCreateIssue
                disabled={isSubmitDisabled}
              >
                Submit new issue
              </Button>
            </Box>
          </Box>
        </PageLayout.Content>
        <PageLayoutPane />
      </PageLayout>
    </ThemeProvider>
  );
}

export default IssuePageNewIssue;
