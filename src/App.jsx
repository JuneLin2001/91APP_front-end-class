import { Routes, Route } from "react-router-dom";
import IssuePage from "./Pages/IssuePage/IssuePage.jsx";
import GitHubLogin from "./utils/GitHubLogin";
import CommentPage from "./CommentPage.jsx";
import ErrorComponent from "./Pages/ErrorPage.jsx";
import { AuthContextProvider } from "./context/authContext";
import { CommentContextProvider } from "./context/commentContext.jsx";
import { ThemeProvider, BaseStyles } from "@primer/react";
import PrivateRoute from "./utils/PrivateRoute.jsx";
function App() {
  return (
    <ThemeProvider>
      <BaseStyles>
        <AuthContextProvider>
          <Routes>
            <Route path="/login" element={<GitHubLogin />} />
            <Route
              path="/:owner/:repoName/issue"
              element={
                <PrivateRoute>
                  <IssuePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/:owner/:repoName/issue/comment/:issueNumber"
              element={
                <CommentContextProvider>
                  <PrivateRoute>
                    <CommentPage />
                  </PrivateRoute>
                </CommentContextProvider>
              }
            />
            <Route path="/error" element={<ErrorComponent />} />
          </Routes>
        </AuthContextProvider>
      </BaseStyles>
    </ThemeProvider>
  );
}

export default App;
