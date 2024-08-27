import { Routes, Route } from "react-router-dom";
import IssuePage from "./IssuePage.jsx";
import GitHubLogin from "./utils/GitHubLogin";
import CommentPage from "./CommentPage.jsx";
import { AuthContextProvider } from "./context/authContext";
import { IssueProvider } from "./context/issueContext";
import { ThemeProvider } from "@primer/react";

function App() {
  return (
    <>
      <ThemeProvider>
        <AuthContextProvider>
          <IssueProvider>
            <Routes>
              <Route path="/login" element={<GitHubLogin />} />
              <Route path="/:repoName/issue" element={<IssuePage />} />
              <Route path="/comment/:issue_number" element={<CommentPage />} />
            </Routes>
          </IssueProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
