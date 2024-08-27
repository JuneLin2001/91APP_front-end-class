import { Routes, Route } from "react-router-dom";
import IssuePage from "./IssuePage.jsx";
import GitHubLogin from "./utils/GitHubLogin";
import CommentPage from "./CommentPage.jsx";
import { AuthContextProvider } from "./context/authContext";

function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path="/login" element={<GitHubLogin />} />
          <Route path="/issue" element={<IssuePage />} />
          <Route path="/comment/:issueNumber" element={<CommentPage />} />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
