import { useState, useEffect } from "react";

const IssuePage = () => {
  const [apiResult, setApiResult] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedLabel, setSelectedLabel] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.github.com/repos/JuneLin2001/91APP_front-end-class/issues"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setApiResult(responseJson);

        const uniqueAuthors = [
          ...new Set(responseJson.map((issue) => issue.user.login)),
        ];
        setAuthors(uniqueAuthors);
      })
      .catch((error) => console.error(error));

    fetch(
      "https://api.github.com/repos/JuneLin2001/91APP_front-end-class/labels"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setLabels(responseJson);
      })
      .catch((error) => console.error(error));
  }, []);

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

  const handleSearchClick = (e) => {
    e.preventDefault();
    setIsSearching(true);

    fetch(
      `https://api.github.com/search/issues?q=repo:JuneLin2001/91APP_front-end-class ${searchValue}`
    )
      .then((response) => response.json())
      .then((data) => {
        setSearchResult(data.items);
      })
      .catch((error) => console.error(error));
  };

  const filteredIssues = (issues) =>
    issues
      .filter(
        (issue) =>
          (selectedAuthor === "all" || issue.user.login === selectedAuthor) &&
          (selectedLabel === "all" ||
            issue.labels.some((label) => label.name === selectedLabel))
      )
      .filter((issue) => !issue.pull_request); // 排除 pull requests

  const issuesToDisplay = isSearching
    ? searchResult
    : filteredIssues(apiResult);

  return (
    <div>
      <h1>Issue Page</h1>

      <label htmlFor="author-select">篩選作者:</label>
      <select id="author-select" onChange={handleAuthorChange}>
        <option value="all">all</option>
        {authors.map((author) => (
          <option key={author} value={author}>
            {author}
          </option>
        ))}
      </select>

      <label htmlFor="label-select">篩選標籤:</label>
      <select id="label-select" onChange={handleLabelChange}>
        <option value="all">all</option>
        {labels.map((label) => (
          <option key={label.id} value={label.name}>
            {label.name}
          </option>
        ))}
      </select>

      <form>
        <input
          placeholder="is:issue is:open"
          value={searchValue}
          onChange={handleSearchChange}
        ></input>
        <button onClick={handleSearchClick}>搜尋</button>
      </form>
      <ul>
        {issuesToDisplay.map(
          (issue) =>
            !issue.pull_request && (
              <li key={issue.id}>
                <a href={issue.html_url}>{issue.title}</a>
                <p>創建時間: {new Date(issue.created_at).toLocaleString()}</p>
                <p>發布者: {issue.user.login}</p>
                {issue.labels.map((label) => (
                  <p key={label.id}>{label.name}</p>
                ))}
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default IssuePage;
