import {
  Details,
  TextInput,
  Button,
  Box,
  ActionMenu,
  ActionList,
  Textarea,
  SelectPanel,
  IconButton,
  Text,
} from "@primer/react";
import { XIcon, SearchIcon, LinkExternalIcon } from "@primer/octicons-react";
import React, { useState, useRef } from "react";

const IssueSearch = () => {
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
  const selectedType = options[selectedIndex];
  return (
    <>
      <Box my={4} height="32px" width="100%" display="flex" justifyContent="flex-end" alignItems="center">
        <ActionMenu>
          <ActionMenu.Button
            aria-label="Close issue"
            sx={{
              display: "flex",
              alignItems: "center",
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
              fontSize: 0,
              borderRight: "none",
            }}
          >
            Filter
          </ActionMenu.Button>

          <ActionMenu.Overlay>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              borderBottom="1px solid #e1e4e8"
            >
              <h3>Filter Options</h3>
            </Box>
            <ActionList selectionVariant="single" showDividers>
              <ActionList.Group>
                {options.map((options, index) => (
                  <ActionList.Item
                    key={index}
                    selected={index === selectedIndex}
                    onSelect={() => setSelectedIndex(index)}
                    sx={{ fontSize: "12px" }}
                  >
                    {options.name}
                  </ActionList.Item>
                ))}
              </ActionList.Group>
              <ActionList.Item>
                <IconButton
                  icon={LinkExternalIcon}
                  variant="invisible"
                  name="link-external"
                  sx={{ "hover:not([disabled])": "none" }}
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
            width: "inherit",
            borderRadius: "6px",
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            backgroundColor: "var(--bgColor-muted)",
            border: "1px solid var(--control-borderColor-rest)",
            paddingLeft: "8px",
            "&:focus-within": {
              border: "1px solid var(--focus-outlineColor)",
              backgroundColor: "white",
            },
          }}
        >
          <SearchIcon
            sx={{
              pointerEvents: "none",
            }}
          />
          <TextInput
            size="small"
            placeholder="is:issue is:open "
            sx={{
              width: "inherit",
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
    </>
  );
};

export default IssueSearch;
