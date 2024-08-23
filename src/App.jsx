import { Routes, Route } from 'react-router-dom';
import IssuePage from './IssuePage.jsx';
import GitHubLogin from './utils/GitHubLogin';
import CommentPage from './CommentPage.jsx';
import { AuthContextProvider } from './context/authContext';

function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route
            path="/91APP_front-end-class/login"
            element={<GitHubLogin />}
          />
          <Route path="/91APP_front-end-class/issue" element={<IssuePage />} />
          <Route
            path="/91APP_front-end-class/comment"
            element={<CommentPage />}
          />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
