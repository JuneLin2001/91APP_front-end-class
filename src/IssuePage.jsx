import { useState, useEffect } from "react";

const IssuePage = () => {
  const [apiResult, setApiResult] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.github.com/repos/JuneLin2001/91APP_front-end-class/issues"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setApiResult(responseJson);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>Issue Page</h1>
      <ul>
        {apiResult.map(
          (issue) =>
            !issue.pull_request && (
              <li key={issue.id}>
                <a href={issue.html_url}>{issue.title}</a>
                <p>創建時間: {new Date(issue.created_at).toLocaleString()}</p>
                <p>發布者: {issue.user.login}</p>
                <ul>
                  {issue.labels.map((label) => (
                    <li key={label.id}>{label.name}</li>
                  ))}
                </ul>
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default IssuePage;
