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

  async getAllLabels(username, repo) {
    const response = await fetch(
      `${this.hostname}/repos/${username}/${repo}/labels`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch labels");
    }

    const labels = await response.json();

    return labels;
  },

  async getSearchIssues(
    username,
    repo,
    q,
    authorFilter,
    labelFilter,
    stateFilter,
    searchResult
  ) {
    const query = q || `repo:${username}/${repo} is:issue is:${stateFilter}`;

    console.log("Using query:", query);

    const formattedLabelFilter = labelFilter
      ? labelFilter
          .match(/label:"[^"]+"|label:\S+/g)
          ?.map((label) => label.trim())
          .join(" ")
      : "";

    console.log("Raw labelFilter:", labelFilter);
    console.log("Formatted labelFilter:", formattedLabelFilter);

    const searchQuery = [
      query,
      formattedLabelFilter !== "" ? formattedLabelFilter : "",
      authorFilter !== "all" ? `author:${authorFilter}` : "",
      searchResult ? searchResult : "",
    ]
      .filter(Boolean)
      .join(" ");

    console.log("Search query components:", {
      query,
      formattedLabelFilter,
      authorFilter,
      searchQuery,
      searchResult,
    });

    if (searchQuery) {
      const encodedQuery = encodeURIComponent(searchQuery);
      console.log("Encoded search query:", encodedQuery);

      const response = await fetch(
        `${this.hostname}/search/issues?q=${encodedQuery}`
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        throw new Error("Failed to search issues");
      }

      const data = await response.json();
      console.log("Search results:", data.items);

      return data.items;
    }
  },
};

export default api;
