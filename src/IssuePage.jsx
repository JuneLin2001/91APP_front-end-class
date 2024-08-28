import { useState, useEffect, useContext } from "react";
import api from "./utils/api";
import {
  ActionList,
  Box,
  Text,
  RelativeTime,
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
} from "@primer/octicons-react";
import { Link } from "react-router-dom";
import { Center } from "./style/Center.styled";
import {
  IssueHeader,
  IssueCheckbox,
  IssueLabelBox,
  IssueOpenClosedButton,
  IssueCardContainer,
} from "./style/IssuePage.styled";
import { useParams } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import IssueSearch from "./IssueSearch";
import SelectPanelLabel from "./SelectPanelLebels.jsx";
import SelectPanelAuthor from "./SelectPanelAuthor.jsx";

const IssuePage = () => {
  const [apiResult, setApiResult] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedLabel, setSelectedLabel] = useState("all");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [stateFilter, setStateFilter] = useState("open");
  const { repoName } = useParams();
  const { user } = useContext(AuthContext);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const searchParams = new URLSearchParams(window.location.search);
  //     const q = searchParams.get("q") || "";
  //     const authorFilter = "all";
  //     const labelFilter = "all";
  //     // FIXME:``需要反斜線
  //     if (user && user.reloadUserInfo && user.reloadUserInfo.screenName) {
  //       const { screenName } = user.reloadUserInfo;

  //       try {
  //         const [issuesData, labelsData, allIssuesData] = await Promise.all([
  //           api.getSearchIssues(
  //             screenName,
  //             repoName,
  //             q,
  //             authorFilter,
  //             labelFilter,
  //             stateFilter
  //           ),
  //           api.getAllLabels(screenName, repoName),
  //           api.getAllIssues(screenName, repoName),
  //         ]);

  //         setApiResult(issuesData);
  //         setAllIssues(allIssuesData);

  //         const uniqueAuthors = [
  //           ...new Set(issuesData.map((issue) => issue.user.login)),
  //         ];
  //         setAuthors(uniqueAuthors);
  //         setLabels(labelsData);
  //       } catch (error) {
  //         console.error("Failed to fetch data:", error);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [user, repoName, stateFilter]);

  useEffect(() => {
    const fetchData = async () => {
      // const searchParams = new URLSearchParams(window.location.search);
      // const q = searchParams.get("q") || "";
      const q = "";
      const authorFilter = "all";
      const labelFilter = "all";

      if (user && user.reloadUserInfo && user.reloadUserInfo.screenName) {
        const { screenName } = user.reloadUserInfo;

        try {
          const [issuesData, labelsData, allIssuesData] = await Promise.all([
            api.getSearchIssues(
              screenName,
              repoName,
              q,
              authorFilter,
              labelFilter,
              stateFilter
            ),
            api.getAllLabels(screenName, repoName),
            api.getAllIssues(screenName, repoName),
          ]);

          setApiResult(issuesData);
          setLabels(labelsData); // 新增
          setAllIssues(allIssuesData); // 新增

          const uniqueAuthors = [
            ...new Set(issuesData.map((issue) => issue.user.login)),
          ];
          setAuthors(uniqueAuthors);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };

    fetchData();
  }, [repoName, stateFilter, user]); // 根據實際依賴項修改

  const updateUrlParams = (params) => {
    const url = new URL(window.location.href);

    const currentSearch = url.search;

    url.search = currentSearch.replace(/([&?](label:[^&]*|author=[^&]*))/g, "");

    const newSearchParams = [];
    if (params.q) newSearchParams.push(`q=${encodeURIComponent(params.q)}`);
    if (params.label)
      newSearchParams.push(`label=${encodeURIComponent(params.label)}`);
    if (params.author)
      newSearchParams.push(`author=${encodeURIComponent(params.author)}`);

    url.search = `${url.search}${url.search ? "&" : "?"}${newSearchParams.join(
      "&"
    )}`;
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

    // 根據 type 更新參數
    const newParams = {
      q: currentQuery,
      label:
        type === "label"
          ? value === "all"
            ? "" // 如果 value 是 "all"，則清空所有標籤
            : [...new Set([...currentLabels, value])].join(" ") // 添加新標籤並去除重複
          : currentLabels.join(" "),
      author:
        type === "author"
          ? value === "all"
            ? "" // 如果 value 是 "all"，則清空作者過濾器
            : value
          : currentAuthor,
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

  const handleSearchClick = async (e, searchValue) => {
    e.preventDefault();
    setIsSearching(true);
    console.log("searchValue: ", searchValue);

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

  const issuesToDisplay = filteredIssues(apiResult);
  // isSearching ? apiResult : filteredIssues(apiResult);

  const handleCheckboxChange = (issueId) => {
    console.log(`Checkbox for issue ${issueId} changed.`);
  };

  return (
    <Center>
      <IssueSearch handleSearchClick={handleSearchClick} />
      <Box display="flex"></Box>
      <Box
        border={"1px solid"}
        borderColor={"#dee3e8"}
        width={"100%"}
        maxWidth={"1214px"} //TODO:要找官方文件
        borderRadius={"0.375rem"} //應該有個官方規範叫做borderRadius-medium
        margin={"auto"}
      >
        <IssueHeader>
          <IssueCheckbox />
          <SegmentedControl
            aria-label="File view"
            variant="invisible"
            sx={{ bg: "#f6f8fa" }}
          >
            <IssueOpenClosedButton
              defaultSelected
              aria-label="Open Issues"
              leadingVisual={IssueOpenedIcon}
              sx={{
                color: stateFilter === "open" ? "#000000" : "#84878b", //TODO:要改用官方文件的顏色
                fontWeight: stateFilter === "open" ? "bold" : "normal",
              }}
              onClick={() => setStateFilter("open")}
            >
              {`${allIssues.length} `}Open
            </IssueOpenClosedButton>
            <IssueOpenClosedButton //選中的關鍵字是aria-current
              aria-label={"Raw"}
              leadingVisual={CheckIcon}
              onClick={() => setStateFilter("closed")}
              sx={{
                color: stateFilter === "closed" ? "#000000" : "#84878b", //TODO:要改用官方文件的顏色
                fontWeight: stateFilter === "closed" ? "bold" : "normal",
              }}
            >
              {`1 `}Closed
            </IssueOpenClosedButton>
          </SegmentedControl>
          <Box
            sx={{
              ml: "auto",
            }}
          >
            <ButtonGroup>
              <SelectPanelAuthor
                authors={authors}
                onSelect={handleAuthorChange}
              />
              <SelectPanelLabel labels={labels} onSelect={handleLabelChange} />

              <Button
                variant="invisible"
                trailingAction={TriangleDownIcon}
                sx={{ fontSize: "14px" }}
              >
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
        </IssueHeader>
        <CheckboxGroup>
          <ActionList sx={{ p: 0 }}>
            {issuesToDisplay.map((issue) => (
              <IssueCardContainer key={issue.id}>
                <Box display="flex" alignItems="center">
                  <IssueCheckbox
                    onChange={() => handleCheckboxChange(issue.id)}
                  />
                  <IconButton
                    aria-label={
                      stateFilter === "open" ? "Open issue" : "Closed issue"
                    }
                    variant="invisible"
                    size="small"
                    icon={
                      stateFilter === "open" ? IssueOpenedIcon : IssueClosedIcon
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
                      <IssueLabelBox
                        key={label.id}
                        bg={`#${label.color}`}
                        color={isWhite ? "black" : "white"}
                        border={isWhite ? "1px solid gray" : "0"}
                        borderColor={isWhite ? "gray" : "transparent"}
                        aria-label={label.description}
                      >
                        {label.name}
                      </IssueLabelBox>
                    );
                  })}
                  {issue.comments > 0 && (
                    <Box ml={"auto"} display={"flex"} alignItems={"center"}>
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
                      <Text fontSize={"12px"} fontWeight={"bold"}>
                        {issue.comments}
                      </Text>
                    </Box>
                  )}
                </Box>

                <Box ml={7}>
                  <Text color="fg.muted" fontSize={"12px"}>
                    {`#${issue.number} `}
                    {stateFilter === "open" ? (
                      <>
                        {`opened on `}
                        <RelativeTime date={new Date(issue.created_at)} />{" "}
                        {` by ${issue.user.login}`}
                      </>
                    ) : (
                      <>
                        {` by ${issue.user.login}`}
                        {`was closed `}
                        <RelativeTime date={new Date(issue.closed_at)} />
                      </>
                    )}
                  </Text>
                </Box>
              </IssueCardContainer>
            ))}
          </ActionList>
        </CheckboxGroup>
      </Box>
    </Center>
  );
};

export default IssuePage;
