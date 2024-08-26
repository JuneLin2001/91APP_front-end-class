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
function CommentPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const owner = "rebeccaS47";
  const repo = "Wordle";
  const issue_number = 1;

  useEffect(() => {
<<<<<<< HEAD
    const fetchData = async () => {
      try {
        setLoading(true);
        const commentsData = await api.getIssueComments(
          owner,
          repo,
          issue_number
        );
        console.log("fetch到的資料", commentsData);
        setData(commentsData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

=======
>>>>>>> 72eb6b9 (fix: fetchData add timestamp not from cache)
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const commentsData = await api.getIssueComments(
        owner,
        repo,
        issue_number,
        timestamp
      );
      console.log("fetch到的資料", commentsData);
      setData(commentsData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;
  if (!data) return <div>無數據</div>;

  return (
    <ThemeProvider>
      <CommentBox />
      <CommentBox2 />
    </ThemeProvider>
  );
}

export default CommentPage;
