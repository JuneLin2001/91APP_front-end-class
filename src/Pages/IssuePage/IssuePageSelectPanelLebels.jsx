import { useState, useRef, useEffect } from "react";
import { TriangleDownIcon } from "@primer/octicons-react";
import { SelectPanel, Button } from "@primer/react";
import PropType from "prop-types";

const LabelSelectPanel = ({ labels = [], onSelect }) => {
  LabelSelectPanel.propTypes = {
    labels: PropType.array,
    onSelect: PropType.func,
  };
  const [selected, setSelected] = useState([]);
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

  useEffect(() => {
    const initialSelected = labels
      .filter((label) => label.selected)
      .map((label) => label.name);
    setSelected(initialSelected);
  }, [labels]);

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
        title="Filter by label"
        renderAnchor={({
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
        placeholderText="Filter labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        // renderItem={({ item }) => (
        //   <div>
        //     <span
        //       style={{
        //         display: "inline-block",
        //         width: "12px",
        //         height: "12px",
        //         backgroundColor: item.color,
        //         marginRight: "8px",
        //         borderRadius: "50%",
        //         border: "1px solid gray",
        //       }}
        //     ></span>
        //     <span>{item.text}</span>
        //     <span>{item.description}</span>
        //   </div>
        // )}
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

export default LabelSelectPanel;
