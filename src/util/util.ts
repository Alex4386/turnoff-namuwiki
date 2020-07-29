export function escapeHtml(unsafe: string) {
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

export function parseUrl(url: string) {
  const searchQueries = url.split('?',2)[1];
  const result: {name: string, value?: string}[] = [];

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