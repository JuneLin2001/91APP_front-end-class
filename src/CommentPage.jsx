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
import CommentBox from "./comment";
import CommentBox2 from "./comment2";

function CommentPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const owner = "rebeccaS47";
  const repo = "Wordle";
  const issue_number = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("fetch到的資料", result);
        setData(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
