const api = {
  hostname: "https://api.github.com",

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

  async getAllIssues(username, repo) {
    const response = await fetch(
      `${this.hostname}/repos/${username}/${repo}/issues`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  },

  async getLabelsWithFilter(username, repo, filter) {
    const response = await fetch(
      `${this.hostname}/repos/${username}/${repo}/labels`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch labels");
    }

    const labels = await response.json();
    return labels.filter((label) => label.name.includes(filter));
  },

  async getSearchIssues(
    username,
    repo,
    q,
    authorFilter,
    labelFilter,
    stateFilter
  ) {
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get("q") || "";

    const searchQuery = [
      `repo:${username}/${repo}`,
      `is:issue`,
      `is:${stateFilter}`,
      authorFilter !== "all"
        ? `author:${encodeURIComponent(authorFilter)}`
        : "",
      labelFilter !== "all" ? `label:${labelFilter}` : "",
      query,
    ]
      .filter(Boolean)
      .join(" ");

    if (searchQuery) {
      const response = await fetch(
        `${this.hostname}/search/issues?q=${searchQuery}`
      );

      if (!response.ok) {
        throw new Error("Failed to search issues");
      }

      const data = await response.json();
      console.log(data);
      return data.items;
    }
  },
};

export default api;
