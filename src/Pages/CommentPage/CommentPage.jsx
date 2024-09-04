import { useContext, useState, useEffect } from "react";
import {
  Text,
  ActionMenu,
  ActionList,
  ThemeProvider,
  RelativeTime,
  ButtonGroup,
  Button,
  PageHeader,
  StateLabel,
  Box,
  PageLayout,
  Octicon,
  TextInput,
} from "@primer/react";
import {
  IssueOpenedIcon,
  IssueClosedIcon,
  SkipIcon,
  TriangleDownIcon,
  IssueReopenedIcon,
} from "@primer/octicons-react";
import { CommentContext } from "../../context/commentContext";
import CommentBox from "./CommentBox";
import TimelineComment from "./TimelineComment";
import IssueBody from "./IssueBody";
import PageLayoutPane from "../../components/PageLayoutPane";
import Loading from "../../components/Loading";

function CommentPage() {
  const {
    issueData,
    commentData,
    loading,
    error,
    currentTextareaValue,
    handleTextareaChange,
    handleCreateComment,
    handleIssueState,
    handleTitleEdit,
    handleNewIssueClick,
  } = useContext(CommentContext);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [issueTitle, setIssueTitle] = useState(
    issueData ? issueData.title : null
  );

  const handleEditTitleClick = () => {
    setIssueTitle(issueData.title);
    setIsEditingTitle(true);
  };

  const handleTitleTextChange = (e) => {
    setIssueTitle(e.target.value);
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    handleTitleEdit(issueTitle);
  };

  const issueStateMapping = [
    {
      id: 0,
      state: "open",
      stateReason: null,
      icon: IssueOpenedIcon,
      labelStatus: "issueOpened",
    },
    {
      id: 1,
      state: "open",
      stateReason: "reopened",
      label: "Reopen issue",
      icon: IssueReopenedIcon,
      color: "var(--bgColor-open-emphasis)",
      stateLabel: "issueOpened",
      description: "",
      labelStatus: "issueOpened",
    },
    {
      id: 2,
      state: "closed",
      stateReason: "completed",
      label: "Close as completed",
      icon: IssueClosedIcon,
      color: "var(--bgColor-done-emphasis)",
      stateLabel: "issueClosedNotPlanned",
      description: "Done, closed, fixed, resolved",
      labelStatus: "issueClosed",
    },
    {
      id: 3,
      state: "closed",
      stateReason: "not_planned",
      label: "Close as not planned",
      icon: SkipIcon,
      color: "var(--bgColor-neutral-emphasis)",
      stateLabel: "issueClosed",
      description: "Wont't fix, can't repo, duplicate, stale",
      labelStatus: "issueClosedNotPlanned",
    },
  ];

  const filteredActions = issueStateMapping.filter((item) => {
    if (issueData) {
      if (issueData.state === "open") {
        return item.state === "closed";
      } else if (issueData.state === "closed") {
        return (
          item.stateReason === "reopened" ||
          (item.stateReason !== issueData.state_reason &&
            item.state === issueData.state)
        );
      }
    }
    return false;
  });

  const matchedState =
    issueData &&
    issueStateMapping.find(
      (item) =>
        item.state === issueData.state &&
        item.stateReason === issueData.state_reason
    );

  const [selectedIndex, setSelectedIndex] = useState(null);
  useEffect(() => {
    if (selectedIndex === null && filteredActions.length > 0) {
      setSelectedIndex(filteredActions[0].id);
    }
  }, [selectedIndex, filteredActions]);
  const selectedType = issueStateMapping[selectedIndex];

  if (loading) return <Loading />;
  if (error) return <div>錯誤: {error}</div>;
  if (!commentData) return <div>無數據</div>;

  return (
    <ThemeProvider>
      <PageLayout>
        {issueData && (
          <PageLayout.Header>
            <PageHeader>
              <PageHeader.TitleArea>
                <PageHeader.Title as="h1">
                  {isEditingTitle ? (
                    <TextInput
                      value={issueTitle}
                      onChange={handleTitleTextChange}
                      autoFocus
                      mr={2}
                    />
                  ) : (
                    <div>
                      {issueData.title} &nbsp;
                      <Text
                        sx={{
                          color: "fg.muted",
                          fontWeight: "light",
                        }}
                      >
                        #{issueData.number}
                      </Text>
                    </div>
                  )}
                </PageHeader.Title>
              </PageHeader.TitleArea>
              <PageHeader.Actions>
                <PageHeader.ContextBar
                  sx={{
                    gap: "8px",
                    "@media screen and (min-width: 768px)": {
                      display: "visible",
                      width: "fit-content",
                    },
                  }}
                >
                  {isEditingTitle ? (
                    <>
                      <Button onClick={handleTitleSave}>Save</Button>
                      <Button
                        variant="invisible"
                        sx={{ color: "fg.muted" }}
                        onClick={handleTitleCancel}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      {" "}
                      <Button onClick={handleEditTitleClick}>Edit</Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          handleNewIssueClick();
                        }}
                      >
                        New Issue
                      </Button>
                    </>
                  )}
                </PageHeader.ContextBar>
              </PageHeader.Actions>

              <PageHeader.Description
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  gap: 3,
                }}
              >
                <Box sx={{ verticalAlign: "middle" }}>
                  {matchedState && (
                    <StateLabel
                      sx={{
                        marginRight: "8px",
                      }}
                      status={matchedState.labelStatus}
                    >
                      {matchedState.state}
                    </StateLabel>
                  )}

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
        )}

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
            {selectedType && (
              <ButtonGroup>
                <ActionMenu>
                  <Button
                    onClick={() =>
                      handleIssueState(
                        issueData.title,
                        selectedType.state,
                        selectedType.stateReason
                      )
                    }
                    leadingVisual={() => (
                      <Octicon
                        icon={selectedType.icon}
                        color={selectedType.color}
                      />
                    )}
                  >
                    {selectedType.label}
                  </Button>
                  <ActionMenu.Button icon={TriangleDownIcon} />

                  <ActionMenu.Overlay width="auto" side="outside-bottom">
                    <ActionList selectionVariant="single">
                      {filteredActions.map((item) => (
                        <ActionList.Item
                          display="flex"
                          flexDirection="column"
                          key={item.id}
                          sx={{
                            padding: "8px 8px 8px 30px",
                            width: "max-content",
                          }}
                          selected={item.id === selectedIndex}
                          onSelect={() => setSelectedIndex(item.id)}
                        >
                          <ActionList.LeadingVisual>
                            <Octicon icon={item.icon} color={item.color} />
                          </ActionList.LeadingVisual>
                          {item.label}
                          <Text sx={{ color: "fg.muted" }}>
                            <br />
                            {item.description}
                          </Text>
                        </ActionList.Item>
                      ))}
                    </ActionList>
                  </ActionMenu.Overlay>
                </ActionMenu>
              </ButtonGroup>
            )}

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
