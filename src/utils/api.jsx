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

  // async postIssue(owner, repo, title, body, selectedLabels, token) {
  //   try {
  //     const response = await fetch(
  //       `${this.hostname}/repos/${owner}/${repo}/issues`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           title: title,
  //           body: body,
  //           labels: selectedLabels,
  //         }),
  //       }
  //     );

  async getInitialData(username, repo, token) {
    const queryBase = `repo:${username}/${repo} is:issue`;

    try {
      const [issuesResponse, labelsResponse] = await Promise.all([
        fetch(
          `${this.hostname}/search/issues?q=${encodeURIComponent(
            queryBase
          )}&per_page=100`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        fetch(`${this.hostname}/repos/${username}/${repo}/labels`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!issuesResponse.ok) {
        throw new Error("Failed to fetch issues");
      }
      if (!labelsResponse.ok) {
        throw new Error("Failed to fetch labels");
      }

      const issuesData = await issuesResponse.json();
      const issues = issuesData.items;
      const labels = await labelsResponse.json();

      const openCount = issues.filter((issue) => issue.state === "open").length;
      const closedCount = issues.filter(
        (issue) => issue.state === "closed"
      ).length;

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

  async getFilteredIssues(
    token,
    owner,
    repoName,
    authorFilter,
    labelFilter,
    stateOpenOrClosed,
    searchResult,
    page = 1
  ) {
    const queryBase = `repo:${owner}/${repoName}`;

    let searchQuery;

    searchQuery = [
      `${queryBase} is:issue is:${stateOpenOrClosed}`,
      labelFilter
        ? labelFilter
            .match(/label:"[^"]+"|label:[^\s+]+(?:\s[^\s+]+)*/g)
            ?.map((label) => label.trim())
            .join(" ")
        : "",
      authorFilter !== "all" ? `author:${authorFilter}` : "",
      searchResult || "",
    ]
      .filter(Boolean)
      .join(" ");

    if (searchQuery) {
      const encodedQuery = encodeURIComponent(searchQuery);

      try {
        const response = await fetch(
          `${this.hostname}/search/issues?q=${encodedQuery}&per_page=10&page=${page}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to search issues");
        }

        const data = await response.json();
        const issues = data.items;
        const totalCount = data.total_count;

        return { issues, totalCount };
      } catch (error) {
        console.error("Failed to fetch filtered issues:", error);
        throw error;
      }
    }
  },

  async postIssue(owner, repo, title, body, selectedLabels, token) {
    try {
      const response = await fetch(
        `${this.hostname}/repos/${owner}/${repo}/issues`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title,
            body: body,
            labels: selectedLabels,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create issue");
      }
      const newIssue = await response.json();
      return newIssue;
    } catch (error) {
      console.error("Error:", error);
    }
  },

  async putLabels(owner, repo, issueNumber, labels, token) {
    try {
      const response = await fetch(
        `${this.hostname}/repos/${owner}/${repo}/issues/${issueNumber}/labels`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            labels: labels, // 傳入新標籤的數組
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update labels on issue");
      }
      const updatedLabels = await response.json();
      return updatedLabels;
    } catch (error) {
      console.error("Error:", error);
    }
  },

  async getIssueBody(owner, repo, issueNumber, timestamp, token) {
    const response = await fetch(
      `${this.hostname}/repos/${owner}/${repo}/issues/${issueNumber}?t=${timestamp}`,
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

  async updateIssueState(
    owner,
    repo,
    issueNumber,
    title,
    state,
    stateReason,
    token
  ) {
    try {
      const response = await fetch(
        `${this.hostname}/repos/${owner}/${repo}/issues/${issueNumber}`,
        {
          method: "PATCH",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title,
            state: state,
            state_reason: stateReason,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update issue state");
      }
    } catch (e) {
      console.error("Error:", e);
    }
  },
};

export default api;
