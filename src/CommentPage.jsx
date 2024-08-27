import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { AuthContext } from "./context/authContext";
import { useContext } from "react";

function CommentPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { issueNumber } = useParams();
  const { CRUDtoken } = useContext(AuthContext);

  const owner = "rebeccaS47";
  const repo = "Wordle";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const commentsData = await api.getIssueComments(
        owner,
        repo,
        issueNumber,
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
    </ThemeProvider>
  );
}

export default CommentPage;
