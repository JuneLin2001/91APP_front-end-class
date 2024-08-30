import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import api from "../utils/api";
import { Avatar, Box, Label, RelativeTime, Button } from "@primer/react";
import { DataTable } from "@primer/react/experimental";
import { Link, PageLayout } from "@primer/react";

const GitHubLogin = () => {
  const { user, githubLogin, githubLogout } = useContext(AuthContext);
  const [repoList, setRepoList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getRepoList = async () => {
      if (user && user.reloadUserInfo && user.reloadUserInfo.screenName) {
        const username = user.reloadUserInfo.screenName;
        try {
          const repoData = await api.getRepo(username);
          setRepoList(repoData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          const errorMessage = error.message || "Something went wrong";
          navigate("/error", { state: { errorMessage } });
        }
      }
    };
    if (user && user.reloadUserInfo && user.reloadUserInfo.screenName) {
      getRepoList();
    }
  }, [user, navigate]);

  console.log("repoList:", repoList);
  const columns = [
    {
      header: "Repository Name",
      field: "name",
      rowHeader: true,
      renderCell: (row) => {
        return (
          <Link href={`${row.owner.login}/${row.name}/issue`} key={row.name}>
            {row.name}
          </Link>
        );
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
      <PageLayout containerWidth="full">
        {user && user.reloadUserInfo && user.reloadUserInfo.screenName ? (
          <PageLayout.Content width="full">
            <div>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Avatar size={36} src={user.photoURL} alt={user.displayName} />
                <h2>Welcome, {user.displayName}</h2>
              </Box>
              <br />
              <Button onClick={githubLogout}>Logout</Button>
            </div>
            <br />
            <DataTable
              aria-labelledby="repositories"
              aria-describedby="repositories-subtitle"
              data={repoList}
              columns={columns}
            />
          </PageLayout.Content>
        ) : (
          <button onClick={githubLogin}>Login with GitHub</button>
        )}
      </PageLayout>
    </>
  );
};

export default GitHubLogin;
