import { useState, useEffect, useContext } from "react";
import api from "./utils/api";
import { ActionList, Box, Text, RelativeTime, Select } from "@primer/react";
import { Link } from "react-router-dom";
import { Center } from "./style/Center.styled";
import { useParams } from "react-router-dom";
import { AuthContext } from "./context/authContext";
// import { LabelSelectPanel } from "./SelectPanelAuthor";

const IssuePage = () => {
  const [apiResult, setApiResult] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedLabel, setSelectedLabel] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { repoName } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const q = searchParams.get("q") || "";
      const authorFilter = searchParams.get("author") || "all";
      const labelFilter = searchParams.get("label") || "all";

      if (user && user.reloadUserInfo && user.reloadUserInfo.screenName) {
        const { screenName } = user.reloadUserInfo;

        try {
          const [issuesData, labelsData] = await Promise.all([
            q
              ? api.getSearchIssues(screenName, repoName, q, authorFilter)
              : api.getAllIssue(screenName, repoName),
            labelFilter
              ? api.getLabelsWithFilter(screenName, repoName, q, labelFilter)
              : api.getAllLabelFromIssue(screenName, repoName),
          ]);

          setApiResult(issuesData);

          const uniqueAuthors = [
            ...new Set(issuesData.map((issue) => issue.user.login)),
          ];
          setAuthors(uniqueAuthors);
          setLabels(labelsData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };

    fetchData();
  }, [user, repoName]);

  const updateUrlParams = (params) => {
    const url = new URL(window.location.href);

    let searchQuery = params.q || "";
    const existingQueryParts = new URLSearchParams(searchQuery);

    existingQueryParts.delete("author");
    existingQueryParts.delete("label");

    if (params.author && params.author !== "all") {
      existingQueryParts.set("author", params.author);
    }
    if (params.label && params.label !== "all") {
      existingQueryParts.set("label", params.label);
    }

    searchQuery = existingQueryParts.toString();
    url.searchParams.set("q", searchQuery);

    if (params.author === "all") url.searchParams.delete("author");
    if (params.label === "all") url.searchParams.delete("label");

    window.history.replaceState({}, "", url);
  };

  const handleFilterChange = (type, value) => {
    setIsSearching(false);

    const params = new URLSearchParams(window.location.search);
    const currentQuery = params.get("q") || "";

    const newParams = {
      q: currentQuery,
      author:
        type === "author" ? (value === "all" ? "" : value) : selectedAuthor,
      label: type === "label" ? (value === "all" ? "" : value) : selectedLabel,
    };

    updateUrlParams(newParams);
  };

  const handleAuthorChange = (e) => {
    const selectedAuthor = e.target.value;
    setSelectedAuthor(selectedAuthor);
    handleFilterChange("author", selectedAuthor);
  };

  const handleLabelChange = (e) => {
    const selectedLabel = e.target.value;
    setSelectedLabel(selectedLabel);
    handleFilterChange("label", selectedLabel);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClick = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      updateUrlParams({
        q: searchValue,
        author: selectedAuthor === "all" ? "" : selectedAuthor,
        label: selectedLabel === "all" ? "" : selectedLabel,
      });

      const searchResults = await api.getSearchIssues(
        user.reloadUserInfo.screenName,
        repoName,
        searchValue,
        selectedAuthor,
        selectedLabel
      );
      const filteredResults = searchResults.filter(
        (issue) => !issue.pull_request
      );
      setSearchResult(filteredResults);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const filteredIssues = (issues) =>
    issues
      .filter(
        (issue) =>
          (selectedAuthor === "all" || issue.user.login === selectedAuthor) &&
          (selectedLabel === "all" ||
            issue.labels.some((label) => label.name === selectedLabel))
      )
      .filter((issue) => !issue.pull_request);

  const issuesToDisplay = isSearching
    ? searchResult
    : filteredIssues(apiResult);

  return (
    <Center>
      <Box>
        <label htmlFor="author-select">篩選作者:</label>
        <Select
          id="author-select"
          value={selectedAuthor}
          onChange={handleAuthorChange}
        >
          <option value="all">all</option>
          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </Select>
      </Box>
      <Box>
        <label htmlFor="label-select">篩選標籤:</label>
        <Select
          id="label-select"
          value={selectedLabel}
          onChange={handleLabelChange}
        >
          <option value="all">all</option>
          {labels.map((label) => (
            <option key={label.id} value={label.name}>
              {label.name}
            </option>
          ))}
        </Select>
      </Box>
      <Box>
        <form>
          <input
            placeholder="is:issue is:open"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <button onClick={handleSearchClick}>搜尋</button>
        </form>
      </Box>

      <Box border={"1px solid"} borderColor={"red"} width={"75%"}>
        <ActionList>
          {issuesToDisplay.map((issue) => (
            <ActionList.Item
              key={issue.id}
              style={{
                border: "1px solid gray",
                cursor: "default",
              }}
              sx={{
                ":hover": {
                  backgroundColor: "#f6f8fa",
                },
              }}
            >
              <Box display="flex" alignItems="center">
                <Text>
                  <Link
                    to={`/comment/${issue.number}`}
                    style={{
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {issue.title}
                  </Link>
                </Text>
                {issue.labels.map((label) => {
                  const isWhite = label.color === "ffffff";
                  return (
                    <Box
                      as="span"
                      key={label.id}
                      bg={`#${label.color}`}
                      color={isWhite ? "black" : "white"}
                      borderRadius={100}
                      ml={1}
                      px={2}
                      py={0.75}
                      fontSize={10}
                      fontWeight="bold"
                      border={isWhite ? "1px solid" : 0}
                      borderColor={isWhite ? "gray" : "transparent"}
                    >
                      {label.name}
                    </Box>
                  );
                })}
              </Box>
              <Box mt={1}>
                <Text color="fg.muted" fontSize={10}>
                  {`#${issue.number} `}
                  {`opened on `}
                  <RelativeTime date={new Date(issue.updated_at)} />
                  {` by ${issue.user.login}`}
                </Text>
              </Box>
            </ActionList.Item>
          ))}
        </ActionList>
      </Box>
    </Center>
  );
};

export default IssuePage;
