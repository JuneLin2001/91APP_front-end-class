import { useContext } from "react";
import {
  Button,
  ThemeProvider,
  Box,
  PageLayout,
  TextInput,
  Timeline,
  Avatar,
  Text,
  Link,
} from "@primer/react";
import { InfoIcon } from "@primer/octicons-react";
import { IssueContext } from "../../context/issueContext";
import CommentBox from "../CommentPage/CommentBox";
import PageLayoutPane from "../../components/PageLayoutPane";
import { AuthContext } from "../../context/authContext";

function IssuePageNewIssue() {
  const {
    title,
    setTitle,
    currentTextareaValue,
    handleTextareaChange,
    handleCreateIssue,
  } = useContext(IssueContext);
  const { user } = useContext(AuthContext);

  const isSubmitDisabled = !title.trim() || !currentTextareaValue.trim();

  return (
    <ThemeProvider>
      <PageLayout>
        <PageLayout.Content>
          <Box>
            <Timeline.Badge
              sx={{
                position: "absolute",
                left: "-40px",
                top: "0px",
                width: "40px",
                height: "40px",
              }}
            >
              <Avatar size={40} src={user.photoURL} alt={user.displayName} />
            </Timeline.Badge>
            <Box display="flex" flexDirection="column" sx={{ gap: "8px" }}>
              <Text as="h4" m={0}>
                Add a title
              </Text>
              <TextInput
                placeholder="Enter the title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 3, width: "100%" }}
              />
            </Box>

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
                onClick={() => handleCreateIssue(title, currentTextareaValue)}
                disabled={isSubmitDisabled}
              >
                Submit new issue
              </Button>
            </Box>
            <InfoBox />
          </Box>
        </PageLayout.Content>
        <PageLayoutPane />
      </PageLayout>
    </ThemeProvider>
  );
}

const InfoBox = () => (
  <Box
    display="flex"
    alignItems="center"
    className="text-small color-fg-muted mt-3 mt-md-2 mb-2"
    my={3}
    color="var(--fgColor-muted, var(--color-fg-muted)) !important"
  >
    <InfoIcon size={16} />
    <Text sx={{ fontSize: "12px", paddingLeft: "4px" }}>
      Remember, contributions to this repository should follow our{" "}
      <Link
        href="https://docs.github.com/articles/github-community-guidelines"
        sx={{ textDecoration: "underline" }}
      >
        GitHub Community Guidelines
      </Link>
      .
    </Text>
  </Box>
);

export default IssuePageNewIssue;
