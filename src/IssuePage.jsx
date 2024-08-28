import { useState, useEffect, useContext } from "react";
import api from "./utils/api";
import {
  ActionList,
  Box,
  Text,
  RelativeTime,
  Header,
  Checkbox,
  CheckboxGroup,
  IconButton,
  SegmentedControl,
  Button,
  ButtonGroup,
} from "@primer/react";
import {
  IssueOpenedIcon,
  IssueClosedIcon,
  CheckIcon,
  TriangleDownIcon,
  CommentIcon,
  // TagIcon,
  // MilestoneIcon,
} from "@primer/octicons-react";
import { Link } from "react-router-dom";
import { Center } from "./style/Center.styled";
import { useParams } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import IssueSearch from "./IssueSearch";
import SelectPanelLabel from "./SelectPanelLebels.jsx";
import SelectPanelAuthor from "./SelectPanelAuthor.jsx";

const IssuePage = () => {
  const [apiResult, setApiResult] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedLabel, setSelectedLabel] = useState("all");
  // const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [stateFilter, setStateFilter] = useState("open");
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
              labelFilter,
              stateFilter
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
  }, [user, repoName, stateFilter]);

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

  // const handleSearchChange = (e) => {
  //   setSearchValue(e.target.value);
  // };

  const handleSearchClick = async (e, searchValue) => {
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
    } finally {
      setIsSearching(false);
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

  const handleCheckboxChange = (issueId) => {
    console.log(`Checkbox for issue ${issueId} changed.`);
  };

  return (
    <Center>
      <Box>
        <IssueSearch handleSearchClick={handleSearchClick} />
        <Box display="inline-flex"></Box>
        <Box
          border={"1px solid"}
          borderColor={"#dee3e8"}
          width={"80vw"}
          borderRadius={"0.375rem"} //應該有個官方規範叫做borderRadius-medium
        >
          <Header
            sx={{
              bg: "#f6f8fa",
              m: 0,
              p: 2,
            }}
          >
            <Checkbox sx={{ mr: 2, ml: 0 }} />
            <SegmentedControl aria-label="File view" variant="invisible">
              {" "}
              {/*TODO:改成透明背景 */}
              <SegmentedControl.Button
                defaultSelected
                variant="invisible"
                aria-label={"Preview"}
                leadingIcon={IssueOpenedIcon}
                sx={{
                  color: "#636c76",
                  bg: "#f6f8fa",
                }}
                onClick={() => setStateFilter("open")}
              >
                Open
              </SegmentedControl.Button>
              <SegmentedControl.Button //選中的關鍵字是aria-current
                aria-label={"Raw"}
                leadingIcon={CheckIcon}
                sx={{
                  color: "#636c76",
                  bg: "#f6f8fa",
                  outline: "none",
                  '[data-component="trailingAction"]': {
                    display: "none",
                  },
                  border: "none",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "&:focus": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "&:active": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "&:hover:not([disabled]):not([data-inactive])": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "& svg": {
                    color: "currentColor",
                    "&:hover": {
                      color: "var(--bgColor-accent-emphasis)",
                    },
                    "&:focus": {
                      color: "var(--bgColor-accent-emphasis)",
                    },
                  },
                  "&[aria-expanded='true']": {
                    backgroundColor: "transparent",
                  },
                }}
                onClick={() => setStateFilter("closed")}
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
              <ButtonGroup>
                <SelectPanelAuthor
                  authors={authors}
                  onSelect={handleAuthorChange}
                />
                <SelectPanelLabel
                  labels={labels}
                  onSelect={handleLabelChange}
                />

                <Button variant="invisible" trailingAction={TriangleDownIcon}>
                  {"Projects"}
                </Button>
                <Button variant="invisible" trailingAction={TriangleDownIcon}>
                  {"Milestones"}
                </Button>
                <Button variant="invisible" trailingAction={TriangleDownIcon}>
                  {"Assignee"}
                </Button>
                <Button variant="invisible" trailingAction={TriangleDownIcon}>
                  {"Sort"}
                </Button>
              </ButtonGroup>
            </Box>
          </Header>
          <CheckboxGroup>
            <ActionList sx={{ p: 0 }}>
              {issuesToDisplay.map((issue) => (
                <ActionList.Item
                  key={issue.id}
                  style={{
                    borderTop: "1px solid",
                    // borderBottom: "1px solid",
                    borderColor: "#dee3e8", //TODO:要改用官方文件的顏色
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
                  <Box display="flex" flexWrap="wrap" alignItems="center">
                    <Checkbox
                      onChange={() => handleCheckboxChange(issue.id)}
                      style={{ marginRight: "4px" }}
                    />
                    <IconButton
                      aria-label={
                        stateFilter === "open" ? "Open issue" : "Closed issue"
                      }
                      variant="invisible"
                      size="small"
                      icon={
                        stateFilter === "open"
                          ? IssueOpenedIcon
                          : IssueClosedIcon
                      }
                      unsafeDisableTooltip={false}
                      sx={{
                        color: stateFilter === "open" ? "green" : "purple", //TODO:要改用官方文件的顏色
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
                          fontSize: "16px",
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
                          fontSize={"12px"}
                          fontWeight="bold"
                          border={isWhite ? "1px solid" : 0}
                          borderColor={isWhite ? "gray" : "transparent"} //加個hover顯示文字，如aria-label="XXX"
                        >
                          {label.name}
                        </Box>
                      );
                    })}
                    {issue.comments > 0 && (
                      <Box ml={"auto"}>
                        <IconButton
                          icon={CommentIcon}
                          variant="invisible"
                          unsafeDisableTooltip={false}
                          sx={{
                            ":hover": {
                              color: "blue", // TODO: 替換為官方文件中的顏色
                            },
                          }}
                        />
                        {issue.comments}
                      </Box>
                    )}
                  </Box>
                  <Box mt={1} ml={7}>
                    <Text color="fg.muted" fontSize={"12px"}>
                      {`#${issue.number} `}
                      {stateFilter === "open" ? (
                        <>
                          {`opened on `}
                          <RelativeTime
                            date={new Date(issue.created_at)}
                          />{" "}
                          {` by ${issue.user.login}`}
                        </>
                      ) : (
                        <>
                          {` by ${issue.user.login}`}
                          {`was closed `}
                          <RelativeTime date={new Date(issue.closed_at)} />{" "}
                        </>
                      )}
                    </Text>
                  </Box>
                </ActionList.Item>
              ))}
            </ActionList>
          </CheckboxGroup>
        </Box>
      </Box>
    </Center>
  );
};

export default IssuePage;
