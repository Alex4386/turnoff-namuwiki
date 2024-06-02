function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

function parseUrl(url) {
  const searchQueries = url.split('?',2)[1];
  const result = [];

  if (typeof searchQueries !== "undefined") {
    const splitedQueries = searchQueries.split('&');

    for (const query of splitedQueries) {
      const parsed = query.split('=');
      const name = parsed[0];
      const value = parsed[1];

      result.push({
        name, value
      });
    }
  }

  return result;
}
