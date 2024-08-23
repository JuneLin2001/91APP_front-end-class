import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const GitHubLogin = () => {
  const { user, githubLogin, githubLogout } = useContext(AuthContext);

  return (
    <>
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}</h2>
          <button onClick={githubLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={githubLogin}>Login with GitHub</button>
      )}
    </>
  );
};

export default GitHubLogin;
