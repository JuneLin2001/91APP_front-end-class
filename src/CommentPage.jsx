import { useState, useEffect } from 'react';

function CommentPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const owner = 'JuneLin2001';
  const repo = '91APP_front-end-class';
  const issue_number = 1;

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

  return (
    <>
      <div>
        {data.map((comment) => (
          <div key={comment.id}>
            <p>{comment.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default CommentPage;
