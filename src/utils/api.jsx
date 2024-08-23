const api = {
  hostname: "http://localhost:3000",
  async getIssues() {
    const response = await fetch(`${this.hostname}/products`);
    const data = await response.json();
    return data;
  },
};

export default api;
