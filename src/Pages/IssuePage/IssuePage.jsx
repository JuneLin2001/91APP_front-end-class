import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import { Center } from "../../style/Center.styled";
import IssueSearch from "./IssuePageSearch";
import IssuePageHeader from "./IssuePageHeader";
import IssuePageList from "./IssuePageList";
import { IssueAllContainer } from "../../style/IssuePage.styled";

const IssuePage = () => {
  const [apiResult, setApiResult] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedLabel, setSelectedLabel] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [stateFilter, setStateFilter] = useState("open");
  const { owner, repoName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get("q") || "";
      const authorFilter = urlParams.get("author") || "all";
      const labelFilter = urlParams.get("label") || "all";
      const searchResult = urlParams.get("searchResult") || "";

      const formattedLabelFilter = labelFilter
        ? labelFilter
            .match(/label:"[^"]+"|label:\S+/g)
            ?.map((label) => label.trim())
            .join(" ")
        : "";

      const shouldUpdateUrl =
        q !== "" ||
        authorFilter !== "all" ||
        labelFilter !== "all" ||
        searchResult !== "";

      if (shouldUpdateUrl) {
        updateUrlParams({
          q,
          author: authorFilter !== "all" ? authorFilter : "",
          label: labelFilter !== "all" ? labelFilter : "",
          searchResult,
        });
      }

      if (owner) {
        const repoOwner = owner;

        try {
          const [issuesData, labelsData, allIssuesData] = await Promise.all([
            api.getSearchIssues(
              repoOwner,
              repoName,
              q,
              authorFilter,
              formattedLabelFilter,
              "open",
              searchResult
            ),
            api.getAllLabels(repoOwner, repoName),
            api.getAllIssues(repoOwner, repoName),
          ]);

          setApiResult(issuesData);
          setLabels(labelsData);
          setAllIssues(allIssuesData);

          const uniqueAuthors = [
            ...new Set(issuesData.map((issue) => issue.user.login)),
          ];
          setAuthors(uniqueAuthors);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          const errorMessage = error.message || "Something went wrong";
          navigate("/error", { state: { errorMessage } });
        }
      }
    };
    fetchData();
  }, [repoName, owner, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const q = "";
      const authorFilter = selectedAuthor || "all";
      const labelFilter = selectedLabel || "all";
      const searchResult = searchValue;

      if (owner) {
        const repoOwner = owner;
        console.log("repoOwner: ", repoOwner);

        try {
          const issuesData = await api.getSearchIssues(
            repoOwner,
            repoName,
            q,
            authorFilter,
            labelFilter,
            stateFilter,
            searchResult
          );

          setApiResult(issuesData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };

    updateUrlParams({
      q: searchValue || "",
      author: selectedAuthor !== "all" ? selectedAuthor : "",
      label: selectedLabel !== "all" ? selectedLabel : "",
    });

    fetchData();
  }, [
    repoName,
    stateFilter,
    owner,
    selectedAuthor,
    selectedLabel,
    searchValue,
  ]);

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
    console.log("formattedString: ", formattedString); // 現在是字串 formattedString:  label:"invalid" label:"question" label:"enhancement"
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
          allIssues={allIssues}
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
