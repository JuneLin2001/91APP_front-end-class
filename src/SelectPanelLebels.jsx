import { useState, useRef } from "react";
import { TriangleDownIcon } from "@primer/octicons-react";
import { SelectPanel, Button } from "@primer/react";

export const LabelSelectPanel = ({ labels = [], onSelect }) => {
  const [selected, setSelected] = useState([]); // 初始選擇為空陣列
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
    // 取得選擇的項目名稱
    const selectedNames = selectedItems.map((item) => item.text);

    const newSelection = selectedNames.reduce((acc, name) => {
      if (acc.includes(name)) {
        return acc.filter((item) => item !== name);
      } else {
        return [...acc, name];
      }
    }, []);

    setSelected(newSelection);

    if (onSelect) {
      onSelect(newSelection);
    }
  };

  return (
    <>
      <SelectPanel
        title="Filter by label"
        renderAnchor={({
          children,
          "aria-labelledby": ariaLabelledBy,
          ...anchorProps
        }) => (
          <Button
            trailingAction={TriangleDownIcon}
            aria-labelledby={ariaLabelledBy}
            {...anchorProps}
          >
            {children ?? "Select Labels"}
          </Button>
        )}
        anchorRef={buttonRef}
        placeholderText="Filter labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={filteredItems.filter((item) => selected.includes(item.text))}
        onSelectedChange={handleSelectedChange}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{
          width: "small",
          height: "auto",
        }}
        footer={
          <div style={{ padding: "8px", fontSize: "12px", color: "#6a737d" }}>
            <div style={{ marginBottom: "4px" }}>
              Use{" "}
              <kbd
                style={{
                  backgroundColor: "#f1f1f1",
                  fontSize: "12px",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                alt
              </kbd>{" "}
              +{" "}
              <kbd
                style={{
                  backgroundColor: "#f1f1f1",
                  fontSize: "12px",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                click/return
              </kbd>{" "}
              to exclude labels
            </div>
            <div>
              or{" "}
              <kbd
                style={{
                  backgroundColor: "#f1f1f1",
                  fontSize: "12px",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                ⇧
              </kbd>{" "}
              +{" "}
              <kbd
                style={{
                  backgroundColor: "#f1f1f1",
                  fontSize: "12px",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                click/return
              </kbd>{" "}
              for logical OR
            </div>
          </div>
        }
      />
    </>
  );
};
