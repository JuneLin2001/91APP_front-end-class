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

  async getAllIssue(username, repo) {
    const response = await fetch(
      `${this.hostname}/repos/${username}/${repo}/issues/`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  },

  async getAllLabelFromIssue(username, repo) {
    const response = await fetch(
      `${this.hostname}/repos/${username}/${repo}/labels`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  },
};

export default api;
