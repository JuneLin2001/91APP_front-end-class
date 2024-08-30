import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import { Center } from "../../style/Center.styled";
import { useParams } from "react-router-dom";
import IssueSearch from "./IssuePageSearch";
import IssuePageHeader from "./IssuePageHeader";
import IssuePageList from "./IssuePageList";
import { IssueAllContainer } from "../../style/IssuePage.styled";

const IssuePage = () => {
  const [apiResult, setApiResult] = useState([]);
  const [allIssues, setAllIssues] = useState({ openCount: 0, closedCount: 0 });
  const [authors, setAuthors] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedLabel, setSelectedLabel] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [stateFilter, setStateFilter] = useState("open");
  const { repoName, owner } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const q = searchValue || "";
      const authorFilter = selectedAuthor || "all";
      const labelFilter = selectedLabel || "all";
      const searchResult = searchValue || "";

      if (owner && repoName) {
        const response = await api.getAllIssuesAndSearchIssues(
          owner,
          repoName,
          q,
          authorFilter,
          labelFilter,
          stateFilter,
          searchResult
        );

        setApiResult(response.issues);
        setLabels(response.labels);
        setAllIssues({
          openCount: response.openCount,
          closedCount: response.closedCount,
        });

        const uniqueAuthors = Array.from(
          new Set(response.issues.map((issue) => issue.user.login))
        );
        setAuthors(uniqueAuthors);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [
    owner,
    repoName,
    stateFilter,
    selectedAuthor,
    selectedLabel,
    searchValue,
  ]);

  useEffect(() => {
    const debouncedFetchData = () => {
      const timer = setTimeout(() => {
        fetchData();
      }, 500);

      return () => clearTimeout(timer);
    };

    updateUrlParams({
      q: searchValue || "",
      author: selectedAuthor !== "all" ? selectedAuthor : "",
      label: selectedLabel !== "all" ? selectedLabel : "",
    });

    const cleanup = debouncedFetchData();

    return cleanup;
  }, [fetchData, searchValue, selectedAuthor, selectedLabel]);

  const updateUrlParams = (params) => {
    const url = new URL(window.location.href);

    Object.keys(params).forEach((key) => {
      if (params[key]) {
        url.searchParams.set(key, params[key]);
      } else {
        url.searchParams.delete(key);
      }
    });

    window.history.pushState({}, "", url);
  };

  const handleFilterChange = (type, value) => {
    setIsSearching(false);

    const params = new URLSearchParams(window.location.search);
    const currentQuery = params.get("q") || "";
    const currentLabels = params.get("label")
      ? params.get("label").split(" ")
      : [];
    const currentAuthor = params.get("author") || "all";

    const newLabels =
      type === "label"
        ? [...new Set([...(currentLabels || []), value])]
        : currentLabels;

    const newParams = {
      q: currentQuery,
      label: newLabels.join(" "),
      author: currentAuthor,
    };

    updateUrlParams(newParams);
  };

  const handleAuthorChange = (selectedAuthor) => {
    console.log("Selected author:", selectedAuthor);
    setSelectedAuthor(selectedAuthor);
    handleFilterChange("author", selectedAuthor);
  };

  const handleLabelChange = (labels) => {
    const formattedString = labels.map((label) => `label:"${label}"`).join(" ");
    console.log("formattedString: ", formattedString);
    handleFilterChange("label", formattedString);
    setSelectedLabel(formattedString);
  };

  const handleSearchClick = async (e, newSearchValue) => {
    e.preventDefault();
    setIsSearching(true);
    console.log("searchValue: ", newSearchValue);
    setSearchValue(newSearchValue);
  };

  const filteredIssues = (issues) =>
    issues.filter(
      (issue) =>
        (selectedAuthor === "all" || issue.user.login === selectedAuthor) &&
        (selectedLabel === "all" ||
          issue.labels.some((label) => label.name === selectedLabel))
    );

  const issuesToDisplay = isSearching ? filteredIssues(apiResult) : apiResult;

  const handleCheckboxChange = (issueId) => {
    console.log(`Checkbox for issue ${issueId} changed.`);
  };

  return (
    <Center>
      <IssueSearch
        handleSearchClick={handleSearchClick}
        labelNum={labels.length}
      />
      <IssueAllContainer>
        <IssuePageHeader
          openCount={allIssues.openCount}
          closedCount={allIssues.closedCount}
          stateFilter={stateFilter}
          setStateFilter={setStateFilter}
          authors={authors}
          labels={labels}
          handleAuthorChange={handleAuthorChange}
          handleLabelChange={handleLabelChange}
        />
        <IssuePageList
          issuesToDisplay={issuesToDisplay}
          stateFilter={stateFilter}
          repoName={repoName}
          handleCheckboxChange={handleCheckboxChange}
          owner={owner}
        />
      </IssueAllContainer>
    </Center>
  );
};

export default IssuePage;
