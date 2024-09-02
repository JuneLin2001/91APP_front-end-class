import { createContext, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export const IssueContext = createContext({
  apiResult: [],
  allIssues: { openCount: 0, closedCount: 0 },
  authors: [],
  labels: [],
  selectedAuthor: "all",
  selectedLabel: "all",
  searchValue: "",
  stateOpenOrClosed: "open",
  repoName: "",
  owner: "",
  handleAuthorChange: () => {},
  handleLabelChange: () => {},
  handleSearchClick: () => {},
  handleClearAll: () => {},
  fetchInitialData: () => {},
  fetchDataAndUpdateUrl: () => {},
  handleCheckboxChange: () => {},
  handleFetchError: () => {},
});

export const IssueContextProvider = ({ children }) => {
  const [apiResult, setApiResult] = useState([]);
  const [allIssues, setAllIssues] = useState({ openCount: 0, closedCount: 0 });
  const [authors, setAuthors] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedLabel, setSelectedLabel] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [stateOpenOrClosed, setStateOpenOrClosed] = useState("open");
  const { repoName, owner } = useParams();
  const navigate = useNavigate();

  const handleFetchError = useCallback(
    (error) => {
      console.error("Failed to fetch data:", error);
      const errorMessage = error.message || "Something went wrong";
      navigate("/error", { state: { errorMessage } });
    },
    [navigate]
  );

  const parseUrlParams = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get("q") || "";

    const params = query.split("+").reduce(
      (acc, param) => {
        if (param.startsWith("repo:")) {
          acc.repo = param.substring(5);
        } else if (param.startsWith("is:")) {
          acc.state = param.substring(3);
        } else if (param.startsWith("label:")) {
          acc.labels = acc.labels || [];
          acc.labels.push(param.substring(6));
        } else if (param.startsWith("author:")) {
          acc.author = param.substring(7);
        }
        return acc;
      },
      { labels: [] }
    );

    const searchResult = query
      .split("+")
      .filter(
        (param) =>
          !param.startsWith("repo:") &&
          !param.startsWith("is:") &&
          !param.startsWith("label:") &&
          !param.startsWith("author:")
      )
      .join(" ");

    return {
      state: params.state || "open",
      author: params.author || "all",
      labels: params.labels || [],
      searchResult: searchResult.trim(),
    };
  }, []);

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
      handleFetchError(error);
    }
  }, [owner, repoName, handleFetchError]);

  const fetchDataAndUpdateUrl = useCallback(() => {
    if (!owner || !repoName || !stateOpenOrClosed) {
      const errorMessage = "Repository owner, name, and state are required.";
      navigate("/error", { state: { errorMessage } });
      return;
    }

    const updateUrlParams = () => {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams();

      const state =
        stateOpenOrClosed === "open"
          ? "is:issue is:open"
          : `is:issue is:${stateOpenOrClosed}`;
      const author = selectedAuthor !== "all" ? `author:${selectedAuthor}` : "";
      const label = selectedLabel !== "all" ? `${selectedLabel}` : "";
      const searchResult = searchValue || "";

      const queryString = [state, author, label, searchResult]
        .filter(Boolean)
        .join(" ");

      if (queryString.trim() !== "is:issue is:open") {
        searchParams.set("q", queryString);
      } else {
        searchParams.delete("q");
      }
      url.search = searchParams.toString();
      window.history.pushState({}, "", url);
    };

    updateUrlParams();

    const fetchFilteredIssues = async () => {
      try {
        const authorFilter = selectedAuthor || "all";
        const labelFilter = selectedLabel || "";
        const searchResult = searchValue || "";
        const q = parseUrlParams();

        const response = await api.fetchFilteredIssues(
          q.searchResult,
          owner,
          repoName,
          authorFilter,
          labelFilter,
          stateOpenOrClosed,
          searchResult
        );

        setApiResult(response);
      } catch (error) {
        handleFetchError(error);
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
    stateOpenOrClosed,
    parseUrlParams,
    handleFetchError,
  ]);

  useEffect(() => {
    const { state, author, labels, searchResult } = parseUrlParams();
    setSelectedAuthor(author);
    setSelectedLabel(labels.join(" "));
    setSearchValue(searchResult);
    setStateOpenOrClosed(state);
    fetchInitialData();
  }, [fetchInitialData, parseUrlParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDataAndUpdateUrl();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    fetchDataAndUpdateUrl,
    searchValue,
    selectedAuthor,
    selectedLabel,
    stateOpenOrClosed,
  ]);

  return (
    <IssueContext.Provider
      value={{
        apiResult,
        allIssues,
        authors,
        labels,
        selectedAuthor,
        selectedLabel,
        searchValue,
        stateOpenOrClosed,
        setSelectedAuthor,
        setSelectedLabel,
        setSearchValue,
        setStateOpenOrClosed,
        handleFilterChange: (type, value) => {
          if (type === "label") {
            setSelectedLabel(value);
          } else if (type === "author") {
            setSelectedAuthor(value);
          }
          fetchDataAndUpdateUrl();
        },
        handleSearchClick: async (e, newSearchValue) => {
          e.preventDefault();
          setSearchValue(newSearchValue);
          fetchDataAndUpdateUrl();
        },
        handleCheckboxChange: (issueId) => {
          console.log(`Checkbox for issue ${issueId} changed.`);
        },
        handleClearAll: () => {
          setSelectedAuthor("all");
          setSelectedLabel("all");
          setSearchValue("");
          setStateOpenOrClosed("open");
          fetchInitialData();
        },
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};
