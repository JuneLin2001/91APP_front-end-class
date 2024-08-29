import {
  PageLayout,
  PageHeader,
  Button,
  Link,
  Token,
  IconButton,
  StateLabel,
  Box,
  Timeline,
  Octicon,
  Heading,
  Text,
} from "@primer/react";
import {
  CopyIcon,
  CrossReferenceIcon,
  PaperclipIcon,
} from "@primer/octicons-react";
import TimelineComment from "./TimelineComment";

const PageLayoutComponent = () => {
  return (
    <PageLayout>
      <PageLayout.Header>
        <PageHeader>
          <PageHeader.TitleArea>
            <PageHeader.Title as="h1">
              PageHeader component: A11y sign-off review - React to alpha &nbsp;
              <Link
                href="https://github.com/github/primer/issues/1115"
                sx={{
                  color: "fg.muted",
                  fontWeight: "light",
                }}
              >
                #1115
              </Link>
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
                  alert("New issue modal will open");
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
              <Text>
                AS-EBaiden opened this issue on Aug 16, 2023 · 10 comments
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
          </PageHeader.Description>
        </PageHeader>
      </PageLayout.Header>
      <PageLayout.Content>
        <Box
          sx={{
            border: "1px solid",
            borderRadius: 2,
            borderColor: "border.default",
            height: "auto",
            padding: 3,
            paddingTop: 0,
          }}
        >
          <h2>Context</h2>
          PageHeader will be responsible to determine the arrangement of the
          top-level headings, side actions, header metadata, parent links, and
          how all these elements adapt to different devices, pointer types, and
          smaller, mobile-friendly viewports.
          <h2 id="helpful-links">Helpful Links</h2>
          <ul aria-labelledby='helpful-links"'>
            <li>Primer documentation site: https://primer.style</li>
            <li>
              Primer React storybook: https://primer.style/react/storybook/
            </li>
          </ul>
        </Box>
        <Box>
          <Timeline>
            <Timeline.Item>
              <Timeline.Badge>
                <Octicon icon={CrossReferenceIcon} />
              </Timeline.Badge>
              <Timeline.Body>
                <Link
                  href="https://github.com/broccolinisoup"
                  sx={{
                    fontWeight: "bold",
                    color: "fg.default",
                    mr: 1,
                  }}
                  muted
                >
                  broccolinisoup
                </Link>
                mentioned this on Jul 20, 2022
              </Timeline.Body>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Badge>
                <Octicon icon={PaperclipIcon} />
              </Timeline.Badge>
              <Timeline.Body>
                <Link
                  href="https://github.com/lesliecdubbs"
                  sx={{
                    fontWeight: "bold",
                    color: "fg.default",
                    mr: 1,
                  }}
                  muted
                >
                  lesliecdubbs
                </Link>
                added react and accessibility labels on Jul 12, 2022
              </Timeline.Body>
            </Timeline.Item>
          </Timeline>
          <TimelineComment />
        </Box>
      </PageLayout.Content>
      <PageLayout.Pane>
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
      </PageLayout.Pane>
    </PageLayout>
  );
};

export default PageLayoutComponent;
