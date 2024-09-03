import { useContext } from "react";
import {
  Text,
  ActionMenu,
  ActionList,
  ThemeProvider,
  RelativeTime,
  Button,
  IconButton,
  PageHeader,
  StateLabel,
  Box,
  PageLayout,
  Link,
  Octicon,
} from "@primer/react";
import { IssueClosedIcon, CopyIcon, SkipIcon } from "@primer/octicons-react";
import { CommentContext } from "../../context/commentContext";
import CommentBox from "./CommentBox";
import TimelineComment from "./TimelineComment";
import IssueBody from "./IssueBody";
import PageLayoutPane from "../../components/PageLayoutPane";
import { useParams, useNavigate } from "react-router-dom";

function CommentPage() {
  const {
    issueData,
    commentData,
    loading,
    error,
    currentTextareaValue,
    handleTextareaChange,
    handleCreateComment,
  } = useContext(CommentContext);

  const navigate = useNavigate();
  const { owner, repoName } = useParams();

  const handleNewIssueClick = () => {
    navigate(`/${owner}/${repoName}/issue/new`);
  };

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;
  if (!commentData) return <div>無數據</div>;

  return (
    <ThemeProvider>
      <PageLayout>
        <PageLayout.Header>
          <PageHeader>
            <PageHeader.TitleArea>
              <PageHeader.Title as="h1">
                {issueData.title} &nbsp;
                <Text
                  sx={{
                    color: "fg.muted",
                    fontWeight: "light",
                  }}
                >
                  #{issueData.number}
                </Text>
              </PageHeader.Title>
            </PageHeader.TitleArea>
            <PageHeader.ContextArea>
              <PageHeader.ContextBar
                sx={{
                  gap: "8px",
                }}
              >
                <Button
                  onClick={() => {
                    alert("The title will go into edit mode");
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleNewIssueClick();
                  }}
                >
                  New Issue
                </Button>
              </PageHeader.ContextBar>
              <PageHeader.ContextAreaActions>
                <IconButton
                  aria-label="Copy permalink"
                  icon={CopyIcon}
                  variant="invisible"
                  unsafeDisableTooltip={false}
                  onClick={() => {
                    alert("This button copies the permalink to the clipboard");
                  }}
                />
              </PageHeader.ContextAreaActions>
            </PageHeader.ContextArea>
            <PageHeader.Actions></PageHeader.Actions>

            <PageHeader.Description
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: 3,
              }}
            >
              <Box sx={{ verticalAlign: "middle" }}>
                <StateLabel
                  sx={{
                    marginRight: "8px",
                  }}
                  status="issueOpened"
                >
                  Open
                </StateLabel>
                <Text fontWeight="bold">{issueData.user.login}</Text>
                <Text color="fg.muted"> opened this issue </Text>
                <RelativeTime
                  date={new Date(issueData.created_at)}
                  color="fg.muted"
                />
                <Text color="fg.muted"> · {issueData.comments} comments</Text>
              </Box>
              <Box
                role="separator"
                sx={{
                  width: "100%",
                  height: 1,
                  backgroundColor: "border.default",
                }}
              ></Box>
            </PageHeader.Description>
          </PageHeader>
        </PageLayout.Header>
        <PageLayout.Content>
          <Box ml={7}>
            <IssueBody />
            <TimelineComment />
          </Box>
          <h4>Add a comment </h4>
          <CommentBox
            onTextareaChange={handleTextareaChange}
            hasMarkdownBtn={true}
          />
          <Box
            mt={3}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ gap: 2 }}
          >
            <ActionMenu>
              <ActionMenu.Button
                aria-label="Close issue"
                leadingVisual={() => (
                  <Octicon
                    icon={IssueClosedIcon}
                    color="var(--bgColor-done-emphasis)"
                  />
                )}
              >
                Leading visual
              </ActionMenu.Button>

              <ActionMenu.Overlay side="outside-bottom" align="end">
                <ActionList>
                  <ActionList.Item
                    sx={{ padding: "8px 8px 8px 30px", width: "max-content" }}
                  >
                    <ActionList.LeadingVisual>
                      <Octicon
                        icon={IssueClosedIcon}
                        color="var(--bgColor-done-emphasis)"
                      />
                    </ActionList.LeadingVisual>
                    Close as Completed
                  </ActionList.Item>
                  <ActionList.Item
                    sx={{ padding: "8px 8px 8px 30px", width: "max-content" }}
                  >
                    <ActionList.LeadingVisual>
                      <Octicon
                        icon={SkipIcon}
                        color="var(--bgColor-neutral-emphasis)"
                      />
                    </ActionList.LeadingVisual>
                    Close as not planned
                  </ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
            <Button
              variant="primary"
              onClick={() => handleCreateComment(currentTextareaValue)}
            >
              Comment
            </Button>
          </Box>
        </PageLayout.Content>
        <PageLayoutPane />
      </PageLayout>
    </ThemeProvider>
  );
}

export default CommentPage;
