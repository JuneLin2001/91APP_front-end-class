import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import api from "./api";
import { Avatar, Label, RelativeTime } from "@primer/react";
import { DataTable } from "@primer/react/experimental";

const GitHubLogin = () => {
  const { user, githubLogin, githubLogout } = useContext(AuthContext);
  const [repoList, setRepoList] = useState([]);

  useEffect(() => {
    const getRepoList = async () => {
      if (user && user.reloadUserInfo && user.reloadUserInfo.screenName) {
        const username = user.reloadUserInfo.screenName;

        try {
          const repoData = await api.getRepo(username);
          setRepoList(repoData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };
    if (user && user.reloadUserInfo && user.reloadUserInfo.screenName) {
      getRepoList();
    }
  }, [user]);

  console.log("repoList:", repoList);
  const columns = [
    {
      header: "Repository Name",
      field: "name",
      rowHeader: true,
    },
    {
      header: "Topics",
      field: "topics",
      renderCell: (row) => {
        return row.topics.map((topic, index) => {
          return <Label key={index}>{topic}</Label>;
        });
      },
    },
    {
      header: "Private",
      field: "private",
      renderCell: (row) => {
        return row.private ? <Label>Private</Label> : <Label>Public</Label>;
      },
    },
    {
      header: "Updated At",
      field: "updated_at",
      renderCell: (row) => {
        return <RelativeTime date={new Date(row.updated_at)} />;
      },
    },
  ];

  return (
    <>
      {user && user.reloadUserInfo && user.reloadUserInfo.screenName ? (
        <>
          <div>
            <h2>Welcome, {user.displayName}</h2>
            <Avatar size={40} src={user.photoURL} alt={user.displayName} />
            <br />
            <br />
            <button onClick={githubLogout}>Logout</button>
          </div>
          <br />
          <DataTable
            aria-labelledby="repositories"
            aria-describedby="repositories-subtitle"
            data={repoList}
            columns={columns}
          />
        </>
      ) : (
        <button onClick={githubLogin}>Login with GitHub</button>
      )}
    </>
  );
};

export default GitHubLogin;
