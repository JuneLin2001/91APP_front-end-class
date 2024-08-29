import { useState, useRef } from "react";
import { TriangleDownIcon } from "@primer/octicons-react";
import { SelectPanel, Button } from "@primer/react";

const LabelSelectPanel = ({ labels = [], onSelect }) => {
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

  const handleSelectedChange = (selectedItems) => {
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
  // console.log("selected in SelectPanelLebels " + selected); //TODO:selected

  return (
    <>
      <SelectPanel
        title="Filter by label"
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
            {"Label"}
          </Button>
        )}
        anchorRef={buttonRef}
        placeholderText="Filter labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        // renderItem={({ item }) => (
        //   <span
        //     style={{
        //       display: "inline-block",
        //       width: "12px",
        //       height: "12px",
        //       backgroundColor: item.color,
        //       borderRadius: "50%",
        //       marginRight: "8px",
        //       border: "1px solid gray",
        //     }}
        //   ></span>
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
