import { useState, createContext, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  handleIssueState: () => {},
  fetchIssueBody: () => {},
  fetchTimelineComments: () => {},
  handleTitleEdit: () => {},
});

export const CommentContextProvider = ({ children }) => {
  const [issueData, setIssueData] = useState(null);
  const [commentData, setCommentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [currentTextareaValue, setCurrentTextareaValue] = useState("");
  const { owner, repoName, issueNumber } = useParams();
  const { user, CRUDtoken } = useContext(AuthContext);
  const navigate = useNavigate();

  const repo = repoName ? repoName : "";

  const processComments = (originalData) => {
    const result = [];
    let tempGroup = null;

    for (let i = 0; i < originalData.length; i++) {
      const comment = originalData[i];
      const { actor, event, label } = comment;

      if (
        (event === "labeled" || event === "unlabeled") &&
        tempGroup &&
        tempGroup.actor.login === actor.login &&
        tempGroup.event === "labeling"
      ) {
        if (event === "labeled") {
          if (!tempGroup.labeledLabels.some((l) => l.name === label.name)) {
            tempGroup.labeledLabels.push(label);
          }
        } else {
          if (!tempGroup.unlabeledLabels.some((l) => l.name === label.name)) {
            tempGroup.unlabeledLabels.push(label);
          }
        }
      } else {
        if (tempGroup) {
          result.push(tempGroup);
        }
        if (event === "labeled" || event === "unlabeled") {
          tempGroup = {
            actor,
            event: "labeling",
            labeledLabels: event === "labeled" ? [label] : [],
            unlabeledLabels: event === "unlabeled" ? [label] : [],
            created_at: comment.created_at,
            id: comment.id,
          };
        } else {
          result.push(comment);
          tempGroup = null;
        }
      }
    }

    if (tempGroup) {
      result.push(tempGroup);
    }

    return result;
  };

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
          timestamp,
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

        const processedComments = processComments(timelineCommentsData);
        setCommentData(processedComments);
      } catch (e) {
        setError(e.message);
        const errorMessage = e.message || "Something went wrong";
        navigate("/error", { state: { errorMessage } });
      } finally {
        setLoading(false);
      }
    };

    fetchInitData();
  }, [issueNumber, CRUDtoken, user, repo, owner, navigate]);

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

  const fetchIssueBody = async () => {
    try {
      const timestamp = new Date().getTime();
      const issueBodyData = await api.getIssueBody(
        owner,
        repo,
        issueNumber,
        timestamp,
        CRUDtoken
      );
      setIssueData(issueBodyData);
    } catch (e) {
      setError(e.message);
    }
  };

  const fetchTimelineComments = async () => {
    try {
      const timestamp = new Date().getTime();
      const timelineCommentsData = await api.getTimelineComments(
        owner,
        repo,
        issueNumber,
        timestamp,
        CRUDtoken
      );
      setCommentData(timelineCommentsData);
      console.log("11111拆開的fetch到timeline的資料", timelineCommentsData);
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

  const handleIssueState = async (title, state, stateReason) => {
    await api.updateIssueState(
      owner,
      repo,
      issueNumber,
      title,
      state,
      stateReason,
      CRUDtoken
    );
    fetchIssueBody();
  };

  const handleTitleEdit = async (title) => {
    await api.updateIssueState(
      owner,
      repo,
      issueNumber,
      title,
      issueData.state,
      issueData.state_reason,
      CRUDtoken
    );
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
        handleIssueState,
        fetchIssueBody,
        fetchTimelineComments,
        handleTitleEdit,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
