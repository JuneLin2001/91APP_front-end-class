import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import api from "./api";

const GitHubLogin = () => {
  const { user, githubLogin, githubLogout } = useContext(AuthContext);
  const [repoList, setRepoList] = useState([]);

  useEffect(() => {
    const getRepoList = async () => {
      const username = user.reloadUserInfo?.screenName;

      try {
        const repoData = await api.getRepo(username);
        setRepoList(repoData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    if (user.reloadUserInfo?.screenName) {
      getRepoList();
    }
  }, [user.reloadUserInfo?.screenName, user.accessToken]);
  return (
    <>
      {user ? (
        <>
          <div>
            <h2>Welcome, {user.displayName}</h2>
            <img style={{ width: "100px" }} src={user.photoURL} alt={user.displayName} />
            <br />
            <button onClick={githubLogout}>Logout</button>
          </div>
          {repoList.map((repo) => {
            return (
              <ul key={repo.id}>
                <li>{repo.name}</li>
              </ul>
            );
          })}
        </>
      ) : (
        <button onClick={githubLogin}>Login with GitHub</button>
      )}
    </>
  );
};

export default GitHubLogin;
