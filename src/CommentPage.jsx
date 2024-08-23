import { useState, useEffect } from 'react';

function CommentPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [text, setText] = useState('');
  const owner = 'JuneLin2001';
  const repo = '91APP_front-end-class';
  const issue_number = 1;

  const handleCreateComment = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`,
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer YOUR_GITHUB_TOKEN',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: { text } }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      const data = await response.json();
      console.log('Comment created:', data);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('fetch到的資料', result);
        setData(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;
  if (!data) return <div>無數據</div>;

  //   const { Octokit } = require("@octokit/rest");
  //   const octokit = new Octokit({
  //     auth: "YOUR_PERSONAL_ACCESS_TOKEN",
  //   });

  //   await octokit.request('GET /repos/{owner}/{repo}/issues/comments', {
  //   owner: 'JuneLin2001',
  //   repo: '91APP_front-end-class',
  //   headers: {
  //     'X-GitHub-Api-Version': '2022-11-28'
  //   }
  // })

  return (
    <>
      <div>
        {data.map((comment) => (
          <div key={comment.id}>
            <p>{comment.body}</p>
          </div>
        ))}
      </div>

      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add your comment here..."
          rows="4"
          cols="50"
        />
        <br />
        <button onClick={handleCreateComment}>Comment</button>
      </div>
    </>
  );
}

export default CommentPage;
