import {
  TextInput,
  Button,
  Box,
  ActionMenu,
  ActionList,
  ButtonGroup,
  IconButton,
  Text,
} from "@primer/react";
import {
  XIcon,
  SearchIcon,
  LinkExternalIcon,
  TagIcon,
  MilestoneIcon,
} from "@primer/octicons-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const IssueSearch = ({ handleSearchClick, labelNum, owner, repoName }) => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleNewIssueClick = () => {
    navigate(`/${owner}/${repoName}/issue/new`);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const getPlaceholder = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q") || "";
    const authorFilter = searchParams.get("author") || "all";
    const labelFilter = searchParams.get("label") || "all";

    const parts = [];
    const qParts = q.split("+").filter((part) => !part.startsWith("repo:"));
    const hasState = qParts.some(
      (part) => part.startsWith("is:") && part.includes("issue")
    );

    if (!hasState) {
      parts.push(`is:issue is:open`);
    }

    if (authorFilter !== "all") {
      parts.push(`author:${authorFilter}`);
    }

    if (labelFilter !== "all") {
      const labels = decodeURIComponent(labelFilter).split("+");
      labels.forEach((label) => {
        parts.push(`${label}`);
      });
    }

    if (qParts.length > 0) {
      parts.push(qParts.join(" "));
    }

    return parts.join(" ");
  };

  const options = [
    {
      name: "Open issues and pull requests",
    },
    {
      name: "Your issues",
    },
    {
      name: "Your pull requests",
    },
    {
      name: "Everything assigned to you",
    },
    {
      name: "Everything mentioning to you",
    },
  ];
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <>
      <Box
        mb={3}
        width="100%"
        maxWidth="1214px"
        display="flex"
        sx={{
          gap: "8px",
        }}
      >
        <Box
          height="32px"
          width="100%"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          <ActionMenu>
            <ActionMenu.Button
              aria-label="Close issue"
              sx={{
                display: "flex",
                alignItems: "center",
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px",
                borderRight: "none",
              }}
            >
              Filters
            </ActionMenu.Button>

            <ActionMenu.Overlay>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                borderBottom="1px solid #e1e4e8"
              >
                <Text as="h3" sx={{ fontSize: "12px" }}>
                  Filter Issues
                </Text>
                <IconButton
                  icon={XIcon}
                  variant="invisible"
                  aria-label="Close"
                />
              </Box>
              <ActionList selectionVariant="single" showDividers>
                <ActionList.Group>
                  {options.map((options, index) => (
                    <ActionList.Item
                      key={index}
                      selected={index === selectedIndex}
                      onSelect={() => setSelectedIndex(index)}
                      sx={{ fontSize: "12px", margin: "0px", padding: "8px" }}
                    >
                      {options.name}
                    </ActionList.Item>
                  ))}
                </ActionList.Group>
                <ActionList.Item
                  sx={{ display: "flex", alignItems: "center", padding: "8px" }}
                >
                  <IconButton
                    icon={LinkExternalIcon}
                    variant="invisible"
                    name="link-external"
                    sx={{
                      padding: 0,
                      height: "100%",
                      ":hover": { boxShadow: "none" },
                    }}
                  />
                  <Text sx={{ fontSize: "12px", fontWeight: "bold" }}>
                    View advanced search syntax
                  </Text>
                </ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
          <Box
            display="flex"
            alignItems="center"
            borderRadius="0px"
            position="relative"
            sx={{
              width: "100%",
              borderRadius: "6px",
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
              backgroundColor: "var(--bgColor-muted)",
              border: "1px solid var(--control-borderColor-rest)",
              "&:focus-within": {
                border: "1px solid var(--focus-outlineColor)",
                backgroundColor: "white",
              },
            }}
          >
            <Box as="form" onSubmit={handleSearchClick} sx={{ width: "100%" }}>
              <TextInput
                size="small"
                leadingVisual={SearchIcon}
                placeholder={getPlaceholder()}
                onChange={handleSearchChange}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearchClick(event, searchValue);
                  }
                }}
                sx={{
                  width: "100%",
                  backgroundColor: "transparent",
                  border: "none",
                  paddingY: "1px",
                  "&:focus-within": {
                    outline: "none",
                  },
                }}
              ></TextInput>
            </Box>
          </Box>
        </Box>
        <ButtonGroup>
          <Button leadingVisual={TagIcon} count={labelNum}>
            Labels{" "}
          </Button>
          <Button leadingVisual={MilestoneIcon} count={0}>
            Milestones{" "}
          </Button>
        </ButtonGroup>
        <Button variant="primary" ml={3} onClick={handleNewIssueClick}>
          New Issue
        </Button>
      </Box>
    </>
  );
};

export default IssueSearch;
