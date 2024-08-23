import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import IssuePage from "./IssuePage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/91APP_front-end-class/login" element={<LoginPage />} />
        <Route path="/91APP_front-end-class/issue" element={<IssuePage />} />
      </Routes>
    </>
  );
}

export default App;
