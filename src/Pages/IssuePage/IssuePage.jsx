import { useState, useEffect, useCallback } from "react";
import { Center } from "../../style/Center.styled";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();

  const parseUrlParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q") || "";
    const authorFilter = searchParams.get("author") || "all";
    const labelFilter = searchParams.get("label") || "all";
    const state = searchParams.get("state") || "open";

    setSearchValue(q);
    setSelectedAuthor(authorFilter);
    setSelectedLabel(labelFilter);
    setStateFilter(state);

    if (state === "closed") {
      setStateFilter("closed");
    } else {
      setStateFilter("open");
    }
  };

  const fetchInitialData = useCallback(async () => {
    try {
      if (owner && repoName) {
        const response = await api.fetchInitialData(owner, repoName);
        setApiResult(response.issues);
        setLabels(response.labels);
        setAllIssues({
          openCount: response.openCount,
          closedCount: response.closedCount,
        });
        setAuthors(response.uniqueAuthors);
      }
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      const errorMessage = error.message || "Something went wrong";
      navigate("/error", { state: { errorMessage } });
    }
  }, [navigate, owner, repoName]);

  const fetchDataAndUpdateUrl = useCallback(() => {
    const updateUrlParams = () => {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams();

      const q = searchValue ? `is:issue ${searchValue}` : "is:issue";
      const author = selectedAuthor !== "all" ? `author:${selectedAuthor}` : "";
      const label = selectedLabel !== "all" ? `label:${selectedLabel}` : "";
      const state = stateFilter ? `is:${stateFilter}` : "";

      searchParams.set(
        "q",
        [q, author, label, state].filter(Boolean).join(" ")
      );

      url.search = searchParams.toString();
      window.history.pushState({}, "", url);
    };

    updateUrlParams();

    const fetchFilteredIssues = async () => {
      try {
        const q = searchValue || "";
        const authorFilter = selectedAuthor || "all";
        const labelFilter = selectedLabel || "all";
        const searchResult = searchValue || "";

        if (owner && repoName) {
          const response = await api.fetchFilteredIssues(
            owner,
            repoName,
            q,
            authorFilter,
            labelFilter,
            stateFilter,
            searchResult
          );
          setApiResult(response);
        }
      } catch (error) {
        console.error("Failed to fetch filtered issues:", error);
        const errorMessage = error.message || "Something went wrong";
        navigate("/error", { state: { errorMessage } });
      }
    };

    fetchFilteredIssues();
  }, [
    navigate,
    owner,
    repoName,
    searchValue,
    selectedAuthor,
    selectedLabel,
    stateFilter,
  ]);

  useEffect(() => {
    parseUrlParams();
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const debouncedFetchDataAndUpdateUrl = () => {
      const timer = setTimeout(() => {
        fetchDataAndUpdateUrl();
      }, 500);

      return () => clearTimeout(timer);
    };

    const cleanup = debouncedFetchDataAndUpdateUrl();

    return cleanup;
  }, [
    fetchDataAndUpdateUrl,
    searchValue,
    selectedAuthor,
    selectedLabel,
    stateFilter,
  ]);

  const handleFilterChange = (type, value) => {
    setIsSearching(false);

    if (type === "label") {
      setSelectedLabel(value);
    } else if (type === "author") {
      setSelectedAuthor(value);
    }

    // 觸發 URL 和數據更新
    fetchDataAndUpdateUrl();
  };

  const handleAuthorChange = (selectedAuthor) => {
    console.log("Selected author:", selectedAuthor);
    handleFilterChange("author", selectedAuthor);
  };

  const handleLabelChange = (labels) => {
    const formattedString = labels.map((label) => `label:${label}`).join(" ");
    console.log("formattedString: ", formattedString);
    handleFilterChange("label", formattedString);
  };

  const handleSearchClick = async (e, newSearchValue) => {
    e.preventDefault();
    setIsSearching(true);
    console.log("searchValue: ", newSearchValue);
    setSearchValue(newSearchValue);
    fetchDataAndUpdateUrl();
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
