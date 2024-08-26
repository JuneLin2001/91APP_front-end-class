import { useState, useEffect, useContext } from "react";
import api from "./utils/api";
import { ActionList, Box, Text, RelativeTime, Select } from "@primer/react";
import { Link } from "react-router-dom";
import { Center } from "./style/Center.styled";
import { useParams } from "react-router-dom";
import { AuthContext } from "./context/authContext";

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
      if (user && user.reloadUserInfo && user.reloadUserInfo.screenName) {
        console.log("repoName:", repoName);
        console.log("user:", user.reloadUserInfo.screenName);
        try {
          const [issuesData, labelsData] = await Promise.all([
            api.getAllIssue(user.reloadUserInfo.screenName, repoName),
            api.getAllLabelFromIssue(user.reloadUserInfo.screenName, repoName),
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

  const handleAuthorChange = (e) => {
    setIsSearching(false);
    setSelectedAuthor(e.target.value);
  };

  const handleLabelChange = (e) => {
    setIsSearching(false);
    setSelectedLabel(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClick = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const searchResults = await api.getSearchIssues(
        //TODO:帳號跟repo要從context取
        "JuneLin2001",
        "91APP_front-end-class",
        searchValue
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
        <Select id="author-select" onChange={handleAuthorChange}>
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
        <Select id="label-select" onChange={handleLabelChange}>
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
          ></input>
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
