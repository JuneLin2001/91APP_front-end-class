const api = {
  hostname: "https://api.github.com",
  async getIssues() {
    const response = await fetch(`${this.hostname}/products`);
    const data = await response.json();
    return data;
  },

  async getRepo(username) {
    const response = await fetch(`${this.hostname}/users/${username}/repos`, {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  },

  async createComment(owner, repo, issue_number, text) {
    try {
      const response = await fetch(
        `${this.hostname}/repos/${owner}/${repo}/issues/${issue_number}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
          },
          body: JSON.stringify({
            body: text,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }
      const newComment = await response.json();
      return newComment;
    } catch (e) {
      console.error('Error:', e);
    }
  },
};

export default api;
