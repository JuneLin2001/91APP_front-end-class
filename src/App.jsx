import "./App.css";
import GitHubLogin from "./utils/GitHubLogin";
import { AuthContextProvider } from "./context/authContext";

function App() {
  return (
    <>
      <AuthContextProvider>
        <h1>Github Issues</h1>
        <GitHubLogin />
      </AuthContextProvider>
    </>
  );
}

export default App;
