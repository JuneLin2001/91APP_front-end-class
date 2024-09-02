import { useContext } from "react";
import { Button, ThemeProvider, Box, PageLayout } from "@primer/react";
import { IssueContext } from "../../context/issueContext";
import CommentBox from "../CommentPage/CommentBox";

function IssuePageNewIssue() {
  const { currentTextareaValue, handleTextareaChange, handleCreateComment } =
    useContext(IssueContext);

  return (
    <ThemeProvider>
      <PageLayout>
        <PageLayout.Content>
          <Box ml={7}>
            {/* 可選擇在這裡顯示更多內容，例如 IssueBody 和 TimelineComment */}
          </Box>
          <h4>Add a title</h4>
          <CommentBox
            onTextareaChange={handleTextareaChange}
            hasMarkdownBtn={true}
            value={currentTextareaValue} // 確保 CommentBox 能夠接收當前文本值
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
              onClick={() => handleCreateComment(currentTextareaValue)}
            >
              Submit new issue
            </Button>
          </Box>
        </PageLayout.Content>
      </PageLayout>
    </ThemeProvider>
  );
}

export default IssuePageNewIssue;
