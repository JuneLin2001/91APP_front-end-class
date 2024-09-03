import { useState, useRef } from "react";
import { TriangleDownIcon } from "@primer/octicons-react";
import { SelectPanel, Button } from "@primer/react";

const IssuePageNewIssueAddLabel = ({
  labels = [],
  selectedLabels,
  onSelect,
  onClose,
}) => {
  const [selected, setSelected] = useState(selectedLabels);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  const filteredItems = labels
    .filter((label) =>
      label.name.toLowerCase().startsWith(filter.toLowerCase())
    )
    .map((label) => ({
      key: label.id,
      text: label.name,
      description: label.description,
      color: `#${label.color}`,
    }));

  const handleSelectedChange = (selectedItems) => {
    const selectedNames = selectedItems.map((item) => item.text);
    console.log("selectedNames", selectedNames);
    setSelected(selectedNames);
    if (onSelect) {
      console.log("onSelect觸發");
      onSelect(selectedNames);
    }
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen && onClose) {
      onClose();
    }
  };

  return (
    <>
      <SelectPanel
        renderAnchor={({
          //   children,
          "aria-labelledby": ariaLabelledBy,
          ...anchorProps
        }) => (
          <Button
            ref={buttonRef}
            variant="invisible"
            trailingAction={TriangleDownIcon}
            aria-labelledby={` ${ariaLabelledBy}`}
            {...anchorProps}
          >
            {"Label"}
          </Button>
        )}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={handleOpenChange}
        items={filteredItems}
        selected={filteredItems.filter((item) => selected.includes(item.text))}
        onSelectedChange={handleSelectedChange}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{
          width: "small",
          height: "medium",
        }}
        footer={
          <Button size="small" block>
            Edit labels
          </Button>
        }
      />
    </>
  );
};

export default IssuePageNewIssueAddLabel;
