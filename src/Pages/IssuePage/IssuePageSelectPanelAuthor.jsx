import { useState } from "react";
import { Button, SelectPanel } from "@primer/react";
import { TriangleDownIcon } from "@primer/octicons-react";
import PropType from "prop-types";

const SelectPanelAuthor = ({ authors = [], onSelect }) => {
  SelectPanelAuthor.propTypes = {
    authors: PropType.array,
    onSelect: PropType.func,
  };
  const [selected, setSelected] = useState(authors[0]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  const filteredItems = [
    { text: "all", id: "all" },
    ...authors.map((author) => ({
      key: author,
      text: author,
    })),
  ].filter((item) => item.text.toLowerCase().startsWith(filter.toLowerCase()));

  const handleSelectedChange = (selected) => {
    setSelected(selected);
    if (onSelect) {
      onSelect(selected.text);
    }
  };

  return (
    <>
      <SelectPanel
        title="Filter by author"
        renderAnchor={({
          "aria-labelledby": ariaLabelledBy,
          ...anchorProps
        }) => (
          <Button
            variant="invisible"
            trailingAction={TriangleDownIcon}
            aria-labelledby={` ${ariaLabelledBy}`}
            {...anchorProps}
          >
            {"Author"}
          </Button>
        )}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={handleSelectedChange}
        onFilterChange={setFilter}
        showItemDividers={true}
        ButtonOutline={{ border: "0px solid #000000" }}
        overlayProps={{
          width: "small",
          height: "auto",
        }}
      />
    </>
  );
};
export default SelectPanelAuthor;
