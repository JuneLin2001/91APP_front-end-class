import { Details, TextInput, Button, Box, ActionMenu, ActionList, Textarea } from "@primer/react";
import { IssueClosedIcon, SearchIcon } from "@primer/octicons-react";

const IssueSearch = () => {
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
            <ActionList>
              <ActionList.Item>Close and cent</ActionList.Item>
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
