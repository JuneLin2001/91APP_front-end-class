import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Text, Box, Link } from "@primer/react";
import { CommentContext } from "../../context/commentContext";
import styled from "styled-components";
import IssueLabels from "../../components/IssueLabels";
import IssuePageNewIssueAddLabel from "../../Pages/IssuePage/IssuePageNewIssueAddLabel";
import { IssueContext } from "../../context/issueContext";
import { AuthContext } from "../../context/authContext";
import api from "../../utils/api";

// const Pane = styled(PageLayout.Pane)
const Pane = styled.div`
  overflow: "visible";
  min-width: 256px;
  max-width: 296px;
  display: flex;
  flex-direction: column;
  width: 100%;
  order: 3;
  margin-left: 16px;

  @media screen and (min-width: 768px) {
    overflow: "visible";
  }
`;

const PageLayoutPane = ({ children }) => {
  const { owner, repoName, issueNumber } = useParams();
  const { issueData } = useContext(CommentContext);
  const issueLabels = issueData.labels || [];
  const { labels } = useContext(IssueContext);
  const allLabels = labels;
  const { CRUDtoken } = useContext(AuthContext);
  const token = CRUDtoken;

  const handleUpdateLabels = async (newLabels) => {
    const repo = repoName;
    try {
      const updatedLabels = await api.putLabels(
        owner,
        repo,
        issueNumber, // issue 編號
        newLabels, // 新的 labels 陣列
        token // 從 AuthContext 獲取的認證 token
      );
      console.log("Labels updated:", updatedLabels);
      // 在這裡進行更新界面上的 labels 或其他操作
    } catch (error) {
      console.error("Failed to update labels:", error);
    }
  };

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
            onSelect={handleUpdateLabels}
          />
          <Text
            sx={{
              fontSize: 0,
              color: "fg.muted",
              lineHeight: "condensed",
            }}
          >
            {issueLabels.length > 0 ? (
              <>
                {issueLabels.map((label, index) => (
                  <React.Fragment key={index}>
                    <IssueLabels
                      key={index}
                      name={label.name}
                      color={label.color}
                      description={label.description}
                    />
                  </React.Fragment>
                ))}
              </>
            ) : (
              <Text>{issueLabels === 0 && "None yet "}</Text>
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
