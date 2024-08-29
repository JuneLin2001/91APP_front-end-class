import { useState, createContext, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "./authContext";
import api from "../utils/api";

export const CommentContext = createContext({
  issueData: {},
  commentData: {},
  loading: false,
  error: null,
  editingCommentId: null,
  currentTextareaValue: "",
  fetchInitData: () => {},
  setComments: () => {},
  handleDelete: () => {},
  handleEdit: () => {},
  handleUpdate: () => {},
  handleTextareaChange: () => {},
  handleCreateComment: () => {},
  setEditingCommentId: () => {},
  getHeaderColor: () => {},
});

export const CommentContextProvider = ({ children }) => {
  const [issueData, setIssueData] = useState(null);
  const [commentData, setCommentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [currentTextareaValue, setCurrentTextareaValue] = useState("");
  const { issueNumber } = useParams();
  const { user, CRUDtoken } = useContext(AuthContext);

  const owner =
    user && user.reloadUserInfo ? user.reloadUserInfo.screenName : "";
  const repo = "Wordle";

  useEffect(() => {
    if (!owner) return;
    const fetchInitData = async () => {
      try {
        setLoading(true);
        const timestamp = new Date().getTime();
        const issueBodyData = await api.getIssueBody(
          owner,
          repo,
          issueNumber,
          CRUDtoken
        );
        const timelineCommentsData = await api.getTimelineComments(
          owner,
          repo,
          issueNumber,
          timestamp,
          CRUDtoken
        );
        console.log("fetch到timeline的資料", timelineCommentsData);
        console.log("fetch到的issueBodyData", { issueBodyData });
        setIssueData(issueBodyData);
        setCommentData(timelineCommentsData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitData();
  }, [issueNumber, CRUDtoken, user]);

  const fetchData = async () => {
    try {
      const timestamp = new Date().getTime();
      const timelineCommentsData = await api.getTimelineComments(
        owner,
        repo,
        issueNumber,
        timestamp,
        CRUDtoken
      );
      console.log("不是首次fetch到的資料", timelineCommentsData);
      setCommentData(timelineCommentsData);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const userConfirmed = confirm("Are you sure you want to delete this?");
      if (userConfirmed) {
        await api.deleteComment(owner, repo, commentId, CRUDtoken);
        fetchData();
      }
    } catch (e) {
      console.error("删除失敗", e.message);
    }
  };

  const handleUpdate = async (commentId, newContent) => {
    try {
      console.log("新的內容：", newContent);
      await api.updateComment(owner, repo, commentId, newContent, CRUDtoken);
      setEditingCommentId(null);
      fetchData();
    } catch (e) {
      console.error("修改失敗", e.message);
    }
  };

  const handleTextareaChange = (value) => {
    setCurrentTextareaValue(value);
  };

  const handleCreateComment = async (currentTextareaValue) => {
    console.log("現在的create textarea: ", currentTextareaValue);
    await api.createComment(
      owner,
      repo,
      issueNumber,
      currentTextareaValue,
      CRUDtoken
    );
    setCurrentTextareaValue("");
    fetchData();
  };

  const getHeaderColor = (userLogin) => {
    if (
      Object.keys(user).length !== 0 &&
      user.reloadUserInfo.screenName === userLogin
    ) {
      return "var(--bgColor-accent-muted)";
    }
    return "var(--control-bgColor-rest)";
  };

  return (
    <CommentContext.Provider
      value={{
        issueData,
        commentData,
        loading,
        error,
        editingCommentId,
        currentTextareaValue,
        handleDelete,
        handleUpdate,
        handleTextareaChange,
        handleCreateComment,
        setEditingCommentId,
        getHeaderColor,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
