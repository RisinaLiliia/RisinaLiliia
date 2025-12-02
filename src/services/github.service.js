import fetch from "node-fetch";

const GH_BASE = "https://api.github.com";

export async function getUser(username) {
  const res = await fetch(`${GH_BASE}/users/${username}`);
  return res.json();
}

export async function getRepos(username) {
  const res = await fetch(`${GH_BASE}/users/${username}/repos`);
  return res.json();
}
