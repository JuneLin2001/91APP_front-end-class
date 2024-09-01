const api = {
  hostname: "https://api.github.com",

  async getRepo(username) {
    const response = await fetch(
      `${this.hostname}/users/${username}/repos?type=all`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  },

  async fetchInitialData(username, repo) {
    const queryBase = `repo:${username}/${repo} is:issue`;

    try {
      const response = await fetch(
        `${this.hostname}/search/issues?q=${encodeURIComponent(queryBase)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch issues");
      }
      const data = await response.json();
      const issues = data.items;

      const openCount = issues.filter((issue) => issue.state === "open").length;
      const closedCount = issues.filter(
        (issue) => issue.state === "closed"
      ).length;

      const labelsResponse = await fetch(
        `${this.hostname}/repos/${username}/${repo}/labels`
      );
      if (!labelsResponse.ok) {
        throw new Error("Failed to fetch labels");
      }
      const labels = await labelsResponse.json();

      const uniqueAuthors = Array.from(
        new Set(issues.map((issue) => issue.user.login))
      );

      return {
        openCount,
        closedCount,
        issues,
        labels,
        uniqueAuthors,
      };
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  },

  async fetchFilteredIssues(
    q,
    owner,
    repoName,
    authorFilter,
    labelFilter,
    stateFilter,
    searchResult
  ) {
    const queryBase = `repo:${owner}/${repoName}`;

    let searchQuery;
    if (q && q.includes(`repo:${owner}`) && q.includes(`repo:${repoName}`)) {
      searchQuery = q;
      console.log("have q " + searchQuery);
    } else {
      searchQuery = [
        `${queryBase} is:issue is:${stateFilter}`,
        labelFilter
          ? labelFilter
              .match(/label:"[^"]+"|label:\S+/g)
              ?.map((label) => label.trim())
              .join(" ")
          : "",
        authorFilter !== "all" ? `author:${authorFilter}` : "",
        searchResult || "",
      ]
        .filter(Boolean)
        .join(" ");
      console.log("don't have q " + searchQuery);
    }

    if (searchQuery) {
      const encodedQuery = encodeURIComponent(searchQuery);

      try {
        const response = await fetch(
          `${this.hostname}/search/issues?q=${encodedQuery}`
        );

        if (!response.ok) {
          throw new Error("Failed to search issues");
        }

        const data = await response.json();
        const issues = data.items;

        return issues;
      } catch (error) {
        console.error("Failed to fetch filtered issues:", error);
        throw error;
      }
    }
  },

  async getIssueBody(owner, repo, issueNumber, token) {
    const response = await fetch(
      `${this.hostname}/repos/${owner}/${repo}/issues/${issueNumber}`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  },

  async getTimelineComments(owner, repo, issueNumber, timestamp, token) {
    const response = await fetch(
      `${this.hostname}/repos/${owner}/${repo}/issues/${issueNumber}/timeline?t=${timestamp}&per_page=100`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  },

  async deleteComment(owner, repo, commentId, token) {
    const response = await fetch(
      `${this.hostname}/repos/${owner}/${repo}/issues/comments/${commentId}`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  async updateComment(owner, repo, commentId, newContent, token) {
    const response = await fetch(
      `${this.hostname}/repos/${owner}/${repo}/issues/comments/${commentId}`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
        },
        method: "PATCH",
        body: JSON.stringify({ body: newContent }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  async createComment(owner, repo, issueNumber, text, token) {
    try {
      const response = await fetch(
        `${this.hostname}/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            body: text,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }
      const newComment = await response.json();
      return newComment;
    } catch (e) {
      console.error("Error:", e);
    }
  },
};

export default api;
