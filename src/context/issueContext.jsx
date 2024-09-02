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
  const { CRUDtoken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState(""); // 新增 title 狀態
  const [currentTextareaValue, setCurrentTextareaValue] = useState("");

  const handleTextareaChange = (value) => {
    setCurrentTextareaValue(value);
  };

  const handleCreateIssue = async (currentTextareaValue) => {
    console.log("現在的create textarea: ", currentTextareaValue);
    try {
      // 調用 api.postIssue 方法來發送 POST 請求
      const newIssue = await api.postIssue(
        owner, // 儲存庫的擁有者
        repoName, // 儲存庫名稱
        title, // Issue 的標題
        currentTextareaValue, // Issue 的內容描述
        CRUDtoken
      );

      // 清空輸入欄位
      setTitle("");
      setCurrentTextareaValue("");

      // 處理成功邏輯，例如通知使用者
      console.log("Issue 成功建立:", newIssue);
    } catch (e) {
      console.error("錯誤:", e);
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
      if (owner && repoName) {
        const response = await api.getInitialData(owner, repoName);
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

    const getFilteredIssues = async () => {
      try {
        const authorFilter = selectedAuthor || "all";
        const labelFilter = selectedLabel || "";
        const searchResult = searchValue || "";
        const q = parseUrlParams();

        const response = await api.getFilteredIssues(
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

    getFilteredIssues();
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
    getInitialData();
  }, [getInitialData, parseUrlParams]);

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
        setTitle,
        handleTextareaChange,
        handleCreateIssue,
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
        handleCheckboxChange,
        handleClearAll: () => {
          setSelectedAuthor("all");
          setSelectedLabel("all");
          setSearchValue("");
          setStateOpenOrClosed("open");
          getInitialData();
        },
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};
