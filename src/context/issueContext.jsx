import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";
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
  currentTextareaValue: "",
  title: "",
  selectedLabels: [],
  currentPage: 1,
  pageCount: 1,
  setCurrentPage: () => {},
  setPageCount: () => {},
  handleAuthorChange: () => {},
  handleLabelChange: () => {},
  handleSearchClick: () => {},
  handleClearAll: () => {},
  getInitialData: () => {},
  fetchDataAndUpdateUrl: () => {},
  handleCheckboxChange: () => {},
  handleFetchError: () => {},
  handleTextareaChange: () => {},
  setTitle: () => {},
  handleCreateIssue: () => {},
  setSelectedLabels: () => {},
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const { repoName, owner } = useParams();
  const { CRUDtoken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [currentTextareaValue, setCurrentTextareaValue] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);

  const handleTextareaChange = (value) => {
    setCurrentTextareaValue(value);
  };

  const handleCreateIssue = async () => {
    try {
      const newIssue = await api.postIssue(
        owner,
        repoName,
        title,
        currentTextareaValue,
        selectedLabels,
        CRUDtoken
      );

      setTitle("");
      setCurrentTextareaValue("");
      setSelectedLabels([]);

      if (newIssue && newIssue.number) {
        navigate(`/${owner}/${repoName}/issue/comment/${newIssue.number}`);
      }
    } catch (error) {
      handleFetchError(error);
    }
  };

  const handleCheckboxChange = useCallback((issueId, isSelected) => {
    setApiResult((prevResult) => {
      return prevResult.map((issue) =>
        issue.id === issueId ? { ...issue, isSelected: isSelected } : issue
      );
    });
  }, []);

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

  const getInitialData = useCallback(async () => {
    try {
      if (owner && repoName && !window.location.href.includes("comment")) {
        const response = await api.getInitialData(owner, repoName, CRUDtoken);
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
  }, [owner, repoName, CRUDtoken, handleFetchError]);

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

    const getFilteredIssues = async () => {
      if (owner && repoName && !window.location.href.includes("comment")) {
        try {
          const authorFilter = selectedAuthor || "all";
          const labelFilter = selectedLabel || "";
          const searchResult = searchValue || "";

          const response = await api.getFilteredIssues(
            CRUDtoken,
            owner,
            repoName,
            authorFilter,
            labelFilter,
            stateOpenOrClosed,
            searchResult,
            currentPage
          );

          const totalCount = response.totalCount;
          const issues = response.issues;
          const totalPages = Math.ceil(totalCount / 10);

          setApiResult(issues);
          setPageCount(totalPages);
          if (totalPages <= 1) {
            setCurrentPage(1);
          }
        } catch (error) {
          handleFetchError(error);
        }
      } else {
        console.log("URL contains 'comment' or owner/repoName is not defined");
      }
    };

    getFilteredIssues();
  }, [
    owner,
    repoName,
    stateOpenOrClosed,
    navigate,
    selectedAuthor,
    selectedLabel,
    searchValue,
    CRUDtoken,
    currentPage,
    handleFetchError,
  ]);

  useEffect(() => {
    const { state, author, labels, searchResult } = parseUrlParams();
    setSelectedAuthor(author);
    setSelectedLabel(labels.join(" "));
    setSearchValue(searchResult);
    setStateOpenOrClosed(state);
    getInitialData();
  }, [getInitialData, parseUrlParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [stateOpenOrClosed]);

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
        currentTextareaValue,
        title,
        currentPage,
        setCurrentPage,
        pageCount,
        setPageCount,
        setTitle,
        handleTextareaChange,
        handleCreateIssue,
        setSelectedAuthor,
        setSelectedLabel,
        setSelectedLabels,
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
          setCurrentPage(1);
        },
        handleCheckboxChange,
        handleClearAll: () => {
          setSelectedAuthor("all");
          setSelectedLabel("all");
          setSearchValue("");
          setCurrentPage(1);
          setStateOpenOrClosed("open");
          getInitialData();
        },
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};
