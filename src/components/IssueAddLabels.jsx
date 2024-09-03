import { useState, useRef, useEffect } from "react";
import { TriangleDownIcon } from "@primer/octicons-react";
import { SelectPanel, Button } from "@primer/react";

const IssuePageNewIssueAddLabel = ({
  labels = [],
  issueLabels = [],
  onSelect,
}) => {
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const selectedNames = issueLabels.map((label) => label.name);
    setSelected(selectedNames);
  }, [issueLabels]);

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
    setSelected(selectedNames);
    if (onSelect) {
      onSelect(selectedNames);
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
        onOpenChange={setOpen}
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
