import {
  useState,
  createContext,
  useEffect,
  useContext,
  useCallback,
} from "react";
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
  handleDeleteComment: () => {},
  handleUpdateComment: () => {},
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

  const fetchIssueBody = useCallback(async () => {
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
      return issueBodyData;
    } catch (e) {
      setError(e.message);
    }
  }, [CRUDtoken, owner, repo, issueNumber]);

  const fetchTimelineComments = useCallback(async () => {
    try {
      const timestamp = new Date().getTime();
      const timelineCommentsData = await api.getTimelineComments(
        owner,
        repo,
        issueNumber,
        timestamp,
        CRUDtoken
      );
      const processedComments = processComments(timelineCommentsData);
      setCommentData(processedComments);
      console.log("整理過的timeline的資料", timelineCommentsData);
      return timelineCommentsData;
    } catch (e) {
      setError(e.message);
    }
  }, [CRUDtoken, owner, repo, issueNumber]);

  useEffect(() => {
    if (!owner) return;
    const fetchInitData = async () => {
      try {
        setLoading(true);
        await fetchIssueBody();
        await fetchTimelineComments();
      } catch (e) {
        setError(e.message);
        const errorMessage = e.message || "Something went wrong";
        navigate("/error", { state: { errorMessage } });
      } finally {
        setLoading(false);
      }
    };

    fetchInitData();
  }, [fetchIssueBody, fetchTimelineComments, owner, navigate]);

  const handleDeleteComment = async (commentId) => {
    try {
      const userConfirmed = confirm("Are you sure you want to delete this?");
      if (userConfirmed) {
        await api.deleteComment(owner, repo, commentId, CRUDtoken);
        fetchTimelineComments();
        fetchIssueBody();
      }
    } catch (e) {
      console.error("删除失敗", e.message);
    }
  };

  const handleUpdateComment = async (commentId, newContent) => {
    try {
      console.log("新的內容：", newContent);
      await api.updateComment(owner, repo, commentId, newContent, CRUDtoken);
      setEditingCommentId(null);
      fetchTimelineComments();
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
    fetchTimelineComments();
    fetchIssueBody();
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
    fetchTimelineComments();
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
    fetchIssueBody();
    fetchTimelineComments();
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
        handleDeleteComment,
        handleUpdateComment,
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
