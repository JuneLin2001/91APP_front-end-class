import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Text, Box, Link } from "@primer/react";
import { CommentContext } from "../context/commentContext";
import styled from "styled-components";
import IssueLabels from "./IssueLabels";
import IssuePageNewIssueAddLabel from "./IssueAddLabel";
import { IssueContext } from "../context/issueContext";
import { AuthContext } from "../context/authContext";
import api from "../utils/api";

const Pane = styled.div`
  overflow: visible;
  min-width: 256px;
  max-width: 296px;
  display: flex;
  flex-direction: column;
  width: 100%;
  order: 3;
  margin-left: 16px;

  @media screen and (min-width: 768px) {
    overflow: visible;
  }
`;

const PageLayoutPane = ({ onLabelsChange }) => {
  const { owner, repoName, issueNumber } = useParams();
  const { issueData, fetchIssueBody, fetchTimelineComments } =
    useContext(CommentContext);
  const { labels } = useContext(IssueContext);
  const allLabels = labels;
  const { CRUDtoken } = useContext(AuthContext);
  const token = CRUDtoken;
  const issueLabels = issueData.labels || [];

  const [selectedLabels, setSelectedLabels] = useState([]);

  const handleUpdateLabels = async () => {
    const repo = repoName;
    const chosenLabels = selectedLabels;

    if (issueNumber !== undefined) {
      try {
        console.log("選擇的 labels", chosenLabels);
        await api.putLabels(owner, repo, issueNumber, chosenLabels, token);
        fetchIssueBody();
        fetchTimelineComments();
      } catch (error) {
        console.error("Failed to update labels:", error);
      }
    } else {
      console.log("issueNumber is undefined");
      onLabelsChange(chosenLabels);
      console.log(chosenLabels);
    }
  };

  const handleSelectedChange = (newLabels) => {
    console.log("父層 label 改變", newLabels);
    setSelectedLabels(newLabels);
    if (!window.location.href.includes("comment")) {
      onLabelsChange(newLabels);
    }
  };

  const handlePaneClose = () => {
    handleUpdateLabels();
  };

  const labelsToRender =
    issueLabels.length > 0
      ? issueLabels
      : allLabels.filter((label) => selectedLabels.includes(label.name));

  return (
    <Pane>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box>
          <Text
            sx={{
              fontSize: 0,
              fontWeight: "bold",
              display: "block",
              color: "fg.muted",
            }}
          >
            Assignees
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: "fg.muted",
              lineHeight: "condensed",
            }}
          >
            No one –{" "}
            <Link href="#" muted>
              assign yourself
            </Link>
          </Text>
        </Box>
        <Box
          role="separator"
          sx={{
            width: "100%",
            height: 1,
            backgroundColor: "border.default",
          }}
        ></Box>
        <Box>
          <IssuePageNewIssueAddLabel
            labels={allLabels}
            selectedLabels={issueLabels.map((label) => label.name)}
            onSelect={handleSelectedChange}
            onClose={handlePaneClose}
          />
          <Text
            sx={{
              fontSize: 0,
              color: "fg.muted",
              lineHeight: "condensed",
            }}
          >
            {labelsToRender.length > 0 ? (
              labelsToRender.map((label, index) => (
                <IssueLabels
                  key={index}
                  name={label.name}
                  color={label.color}
                  description={label.description}
                />
              ))
            ) : (
              <Text>None yet</Text>
            )}
          </Text>
        </Box>
        <Box
          role="separator"
          sx={{
            width: "100%",
            height: 1,
            backgroundColor: "border.default",
          }}
        ></Box>
        <Box>
          <Text
            sx={{
              fontSize: 0,
              fontWeight: "bold",
              display: "block",
              color: "fg.muted",
            }}
          >
            Projects
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: "fg.muted",
              lineHeight: "condensed",
            }}
          >
            None yet
          </Text>
        </Box>
        <Box
          role="separator"
          sx={{
            width: "100%",
            height: 1,
            backgroundColor: "border.default",
          }}
        ></Box>
        <Box>
          <Text
            sx={{
              fontSize: 0,
              fontWeight: "bold",
              display: "block",
              color: "fg.muted",
            }}
          >
            Milestone
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: "fg.muted",
              lineHeight: "condensed",
            }}
          >
            None yet
          </Text>
        </Box>
        <Box
          role="separator"
          sx={{
            width: "100%",
            height: 1,
            backgroundColor: "border.default",
          }}
        ></Box>
        <Box>
          <Text
            sx={{
              fontSize: 0,
              fontWeight: "bold",
              display: "block",
              color: "fg.muted",
            }}
          >
            Development
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: "fg.muted",
              lineHeight: "condensed",
            }}
          >
            No branches or pull requests
          </Text>
        </Box>
      </Box>
    </Pane>
  );
};

export default PageLayoutPane;
