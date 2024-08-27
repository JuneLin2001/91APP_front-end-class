import { useState, useEffect } from "react";
import {
  Box,
  Timeline,
  Avatar,
  Text,
  Label,
  ActionMenu,
  ActionList,
  IconButton,
  ThemeProvider,
  RelativeTime,
} from "@primer/react";
import { KebabHorizontalIcon } from "@primer/octicons-react";
import api from "./utils/api";
import CommentBox from "./comment";
import IssueDiscussion2 from "./TimelineComment";
function CommentPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const owner = "rebeccaS47";
  const repo = "Wordle";
  const issue_number = 1;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const commentsData = await api.getIssueComments(owner, repo, issue_number);
  //       console.log("fetch到的資料", commentsData);
  //       setData(commentsData);
  //     } catch (e) {
  //       setError(e.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (loading) return <div>載入中...</div>;
  // if (error) return <div>錯誤: {error}</div>;
  // if (!data) return <div>無數據</div>;

  return (
    <ThemeProvider>
      <IssueDiscussion2 />
      <CommentBox />
    </ThemeProvider>
  );
}

export default CommentPage;
