const GH_BASE = "https://api.github.com";

export async function getUser(username) {
  const res = await fetch(`${GH_BASE}/users/${username}`, {
    headers: {
      Authorization: process.env.GH_TOKEN
        ? `token ${process.env.GH_TOKEN}`
        : undefined,
      "User-Agent": "Render-GitHub-Stats",
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("GitHub API Error (getUser):", text);
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

export async function getRepos(username) {
  const res = await fetch(`${GH_BASE}/users/${username}/repos?per_page=100`, {
    headers: {
      Authorization: process.env.GH_TOKEN
        ? `token ${process.env.GH_TOKEN}`
        : undefined,
      "User-Agent": "Render-GitHub-Stats",
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("GitHub API Error (getRepos):", text);
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}
