import { Routes, Route } from "react-router-dom";
import IssuePage from "./Pages/IssuePage/IssuePage.jsx";
import GitHubLogin from "./utils/GitHubLogin";
import CommentPage from "./CommentPage.jsx";
import PageLayoutComponent from "./PageLayout.jsx";
import { AuthContextProvider } from "./context/authContext";
import { CommentContextProvider } from "./context/commentContext.jsx";
import { ThemeProvider, BaseStyles } from "@primer/react";

function App() {
  return (
    <ThemeProvider>
      <BaseStyles>
        <AuthContextProvider>
          <Routes>
            <Route path="/login" element={<GitHubLogin />} />
            <Route path="/:owner/:repoName/issue" element={<IssuePage />} />
            <Route
              path="/:owner/:repoName/issue/comment/:issueNumber"
              element={
                <CommentContextProvider>
                  <CommentPage />
                </CommentContextProvider>
              }
            />
            <Route path="/page" element={<PageLayoutComponent />} />
          </Routes>
        </AuthContextProvider>
      </BaseStyles>
    </ThemeProvider>
  );
}

export default App;
