import { useContext } from "react";
import { IssueContext } from "../../context/issueContext";
import { Center } from "../../style/Center.styled";
import IssueSearch from "./IssuePageSearch";
import IssuePageHeader from "./IssuePageHeader";
import IssuePageList from "./IssuePageList";
import { IssueAllContainer } from "../../style/IssuePage.styled";
import { Button } from "@primer/react";
import { XCircleFillIcon } from "@primer/octicons-react";

const IssuePage = () => {
  const {
    apiResult,
    allIssues,
    authors,
    labels,
    selectedAuthor,
    selectedLabel,
    searchValue,
    stateOpenOrClosed,
    owner,
    repoName,
    setStateOpenOrClosed,
    handleFilterChange,
    handleSearchClick,
    handleCheckboxChange,
    handleClearAll,
  } = useContext(IssueContext);

  const isDefaultState = () => {
    return (
      selectedAuthor === "all" &&
      selectedLabel === "all" &&
      searchValue === "" &&
      stateOpenOrClosed === "open"
    );
  };

  return (
    <Center>
      <IssueSearch
        handleSearchClick={handleSearchClick}
        labelNum={labels.length}
      />
      <IssueAllContainer>
        {!isDefaultState() && (
          <Button
            leadingVisual={XCircleFillIcon}
            variant="invisible"
            onClick={handleClearAll}
          >
            Clear current search query, filters, and sorts
          </Button>
        )}
        <IssuePageHeader
          openCount={allIssues.openCount}
          closedCount={allIssues.closedCount}
          stateOpenOrClosed={stateOpenOrClosed}
          setStateOpenOrClosed={setStateOpenOrClosed}
          authors={authors}
          labels={labels}
          handleAuthorChange={(author) => handleFilterChange("author", author)}
          handleLabelChange={(labels) => {
            const formattedString =
              labels.length > 0
                ? labels.map((label) => `label:"${label}"`).join(" ")
                : "all";
            handleFilterChange("label", formattedString);
          }}
        />
        <IssuePageList
          issuesToDisplay={apiResult}
          stateOpenOrClosed={stateOpenOrClosed}
          repoName={repoName}
          handleCheckboxChange={handleCheckboxChange}
          owner={owner}
        />
      </IssueAllContainer>
    </Center>
  );
};

export default IssuePage;
