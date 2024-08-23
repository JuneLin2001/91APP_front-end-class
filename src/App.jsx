import { Routes, Route } from 'react-router-dom';
import CommentPage from './CommentPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/91APP_front-end-class/comment" element={<CommentPage />} />
    </Routes>
  );
}

export default App;
