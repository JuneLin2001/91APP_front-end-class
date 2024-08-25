import { useState, useEffect } from 'react';
import api from './utils/api';

function CommentPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [text, setText] = useState('');

  const owner = 'rebeccaS47';
  const repo = 'Wordle';
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

  const handleCreateComment = async () => {
    const newComment = await api.createComment(owner, repo, issue_number, text);
    setData((prevData) => [...prevData, newComment]);
    setText('');
  };

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
