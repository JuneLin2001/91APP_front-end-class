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

const IssueSearch = ({ handleSearchClick, labelNum }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const getPlaceholder = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q") || "";
    const authorFilter = searchParams.get("author") || "all";
    const labelFilter = searchParams.get("label") || "all";

    const parts = ["is:issue", "is:open"];

    if (authorFilter !== "all") {
      parts.push(`author:${authorFilter}`);
    }

    if (labelFilter !== "all") {
      const decodedLabels = decodeURIComponent(labelFilter).split("+");
      decodedLabels.forEach((label) => {
        parts.push(`label:"${label}"`);
      });
    }

    if (q) {
      parts.push(q);
    }

    return parts.join(" ");
  };

  const options = [
    {
      name: "Fast forward",
    },
    {
      name: "Recursive",
    },
    {
      name: "Ours",
    },
    {
      name: "Octopus",
    },
    {
      name: "Resolve",
    },
    {
      name: "Subtree",
    },
  ];
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  // const selectedType = options[selectedIndex];
  // console.log("in filter that choose" + selectedType);
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
                  <Text sx={{ fontSize: "12px" }}>External Link</Text>
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
        <Button variant="primary" ml={3}>
          New Issue
        </Button>
      </Box>
    </>
  );
};

export default IssueSearch;
