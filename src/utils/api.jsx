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

  // async getAllIssues(username, repo) {
  //   const response = await fetch(
  //     `${this.hostname}/repos/${username}/${repo}/issues`
  //   );

  //   if (!response.ok) {
  //     throw new Error("Failed to fetch data");
  //   }

  //   const data = await response.json();
  //   return data;
  // },

  async getAllIssuesAndSearchIssues(
    username,
    repo,
    q,
    authorFilter,
    labelFilter,
    stateFilter,
    searchResult
  ) {
    const queryBase = `repo:${username}/${repo} is:issue`;

    // 組合查詢字符串
    const searchQuery = [
      q || `${queryBase} is:${stateFilter}`,
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

    // 確保查詢字符串存在
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

        // 計算開啟和關閉的問題數量
        const openCount = issues.filter(
          (issue) => issue.state === "open"
        ).length;
        const closedCount = issues.filter(
          (issue) => issue.state === "closed"
        ).length;

        // 獲取標籤
        const labelsResponse = await fetch(
          `${this.hostname}/repos/${username}/${repo}/labels`
        );
        if (!labelsResponse.ok) {
          throw new Error("Failed to fetch labels");
        }
        const labels = await labelsResponse.json();

        return {
          openCount,
          closedCount,
          issues,
          labels,
        };
      } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
      }
    }
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
      `${this.hostname}/repos/${owner}/${repo}/issues/${issueNumber}/timeline?t=${timestamp}`,
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
