import React, { useContext } from "react";
import { Text, Box, Link } from "@primer/react";
import { CommentContext } from "../../context/commentContext";
import styled from "styled-components";
import IssueLabels from "../../components/IssueLabels";
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
  const { issueData } = useContext(CommentContext);

  const labels = issueData.labels || [];
  console.log("issueData:", issueData.labels);
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
          <Text
            sx={{
              fontSize: 0,
              fontWeight: "bold",
              display: "block",
              color: "fg.muted",
            }}
          >
            Labels
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: "fg.muted",
              lineHeight: "condensed",
            }}
          >
            {labels.length > 0 ? (
              <>
                {labels.map((label, index) => (
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
              <Text>{labels === 0 && "None yet "}</Text>
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
