import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const GH_BASE = "https://api.github.com";

if (!process.env.GH_TOKEN) {
  console.error("Error: GitHub Token (GH_TOKEN) not found in .env");
  process.exit(1);
}

const headers = {
  Authorization: `token ${process.env.GH_TOKEN}`,
  "User-Agent": "Render-GitHub-Stats",
  Accept: "application/vnd.github.v3+json",
};

export async function getUser(username) {
  const res = await fetch(`${GH_BASE}/users/${username}`, { headers });

  if (!res.ok) {
    const text = await res.text();
    console.error("GitHub API Error (getUser):", text);
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

export async function getRepos(username) {
  const res = await fetch(`${GH_BASE}/users/${username}/repos?per_page=100`, {
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("GitHub API Error (getRepos):", text);
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}
