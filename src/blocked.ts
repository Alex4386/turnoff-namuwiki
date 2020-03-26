const blocked_queries = parseUrl(location.href);
let blocked_url = "#";

console.log(blocked_queries);

for (const query of blocked_queries) {
  if (query.name === "blocked_url") {
    blocked_url = (typeof query.value !== "undefined") ? query.value : "#";
  }
}

(document.getElementById('access') as HTMLAnchorElement).href = blocked_url;
console.log("boo");
