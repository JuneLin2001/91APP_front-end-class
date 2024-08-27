import { useState, useEffect, useContext } from "react";
import api from "./utils/api";
import {
  ActionList,
  Box,
  Text,
  RelativeTime,
  TextInput,
  Header,
  Checkbox,
  CheckboxGroup,
  IconButton,
  SegmentedControl,
} from "@primer/react";
import { SearchIcon, IssueOpenedIcon, CheckIcon } from "@primer/octicons-react";
import { Link } from "react-router-dom";
import { Center } from "./style/Center.styled";
import { useParams } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import { LabelSelectPanel } from "./SelectPanelLebels.jsx";
import SelectPanelAuthor from "./SelectPanelAuthor.jsx";

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
            api.getSearchIssues(
              screenName,
              repoName,
              q,
              authorFilter,
              labelFilter
            ),
            api.getLabelsWithFilter(screenName, repoName, q, labelFilter),
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
    Object.keys(params).forEach((key) => {
      if (params[key] === "all" || params[key] === "") {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, params[key]);
      }
    });
    window.history.pushState({}, "", url);
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

  const handleAuthorChange = (selectedAuthor) => {
    console.log("Selected author:", selectedAuthor);
    setSelectedAuthor(selectedAuthor);
    handleFilterChange("author", selectedAuthor);
  };

  const handleLabelChange = (label) => {
    setSelectedLabel((prevSelected) => {
      const normalizeLabelString = (labelString) => {
        return labelString
          .split("+") // 使用 "+" 符號分隔
          .map((part) => part.trim())
          .filter(Boolean)
          .join("+");
      };

      console.log("Previous Selected:", prevSelected);

      let selectedLabels =
        prevSelected === "all"
          ? []
          : normalizeLabelString(prevSelected).split("+");

      console.log("Normalized Labels:", selectedLabels);

      const labelsSet = new Set(selectedLabels);

      console.log("Labels Set (before change):", Array.from(labelsSet));

      if (labelsSet.has(label)) {
        labelsSet.delete(label);
      } else {
        labelsSet.add(label);
      }

      console.log("Labels Set (after change):", Array.from(labelsSet));

      const result = Array.from(labelsSet).join("+");

      console.log("Result String:", result);

      const finalResult = result.length ? result : "all";

      console.log("Final Result:", finalResult);

      handleFilterChange("label", finalResult);
      return finalResult;
    });
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
      setSearchResult(searchResults);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const filteredIssues = (issues) =>
    issues.filter(
      (issue) =>
        (selectedAuthor === "all" || issue.user.login === selectedAuthor) &&
        (selectedLabel === "all" ||
          issue.labels.some((label) => label.name === selectedLabel))
    );

  const issuesToDisplay = isSearching
    ? searchResult
    : filteredIssues(apiResult);

  const getPlaceholder = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q") || "";
    const authorFilter = searchParams.get("author") || "all";
    const labelFilter = searchParams.get("label") || "all";

    const parts = ["is:issue", "is:open"];

    if (authorFilter !== "all") {
      parts.push(`author:${authorFilter}`);
    }
    if (labelFilter !== "all") {
      const decodedLabel = decodeURIComponent(labelFilter);
      parts.push(`label:"${decodedLabel}"`);
    }
    if (q) {
      parts.push(q);
    }

    return parts.join(" ");
  };

  const handleCheckboxChange = (issueId) => {
    console.log(`Checkbox for issue ${issueId} changed.`);
  };

  return (
    <Center>
      <Box mb={2}>
        <form>
          <button onClick={handleSearchClick}>
            <SearchIcon />
          </button>
          <TextInput
            placeholder={getPlaceholder()}
            value={searchValue}
            onChange={handleSearchChange}
            sx={{
              width: "80vw",
            }}
          />
        </form>
      </Box>
      <Box border={"1px solid"} /*borderColor={"red"}*/ width={"80vw"}>
        <Header
          borderRadius={100}
          sx={{
            bg: "#f6f8fa",
            m: 0,
            p: 0,
            pl: 2,
          }}
        >
          <Checkbox sx={{ mr: 2, ml: 0 }} />
          <SegmentedControl aria-label="File view">
            {" "}
            {/*TODO:改成透明背景 */}
            <SegmentedControl.Button
              defaultSelected
              aria-label={"Preview"}
              leadingIcon={IssueOpenedIcon}
              sx={{
                color: "#636c76",
                bg: "transparent",
              }}
            >
              Open
            </SegmentedControl.Button>
            <SegmentedControl.Button
              aria-label={"Raw"}
              leadingIcon={CheckIcon}
              sx={{
                color: "#636c76",
                bg: "transparent",
              }}
            >
              Closed
            </SegmentedControl.Button>
          </SegmentedControl>
          <Box
            sx={{
              ml: "auto",
              mr: 4,
            }}
          >
            {/* <Select
              id="author-select"
              value={selectedAuthor}
              onChange={handleAuthorChange}
              sx={{
                borderRadius: 0,
                border: "0px solid #000000",
                bg: "#f6f8fa",
              }}
            >
              <option value="all">all</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </Select> */}
            <SelectPanelAuthor
              authors={authors}
              onSelect={handleAuthorChange}
            />
            {/*TODO:改成透明背景 */}
          </Box>
          <Box>
            {/* <Select
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
            </Select> */}
            <LabelSelectPanel labels={labels} onSelect={handleLabelChange} />
            {/*TODO:改成透明背景 */}
          </Box>
        </Header>
        <CheckboxGroup>
          <ActionList>
            {issuesToDisplay.map((issue) => (
              <ActionList.Item
                key={issue.id}
                style={{
                  borderTop: "1px solid",
                  // borderBottom: "1px solid",
                  borderColor: "gray",
                  cursor: "default",
                  margin: 0,
                  borderRadius: 0,
                }}
                sx={{
                  ":hover": {
                    backgroundColor: "#f6f8fa",
                  },
                }}
              >
                <Box display="flex" alignItems="center">
                  <Checkbox
                    onChange={() => handleCheckboxChange(issue.id)}
                    style={{ marginRight: "4px" }}
                  />
                  <IconButton
                    aria-label="Open issue"
                    variant="invisible"
                    size="small"
                    icon={IssueOpenedIcon}
                    unsafeDisableTooltip={false}
                    sx={{
                      color: "green",
                      cursor: "default",
                      ":hover": {
                        borderColor: "transparent",
                        bg: "transparent",
                      },
                    }}
                  />

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
        </CheckboxGroup>
      </Box>
    </Center>
  );
};

export default IssuePage;
