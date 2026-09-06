iimport fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const GH_BASE = "https://api.github.com";

if (!process.env.GH_TOKEN) {
  console.error("Error: GitHub Token (GH_TOKEN) not found in .env");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${process.env.GH_TOKEN}`,
  "User-Agent": "Render-GitHub-Stats",
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

const MAX_CONCURRENT_GITHUB_REQUESTS = 5;

let activeRequests = 0;
const waitingRequests = [];

export class GitHubRateLimitError extends Error {
  constructor(message = "GitHub API rate limit reached") {
    super(message);
    this.name = "GitHubRateLimitError";
  }
}

async function acquireSlot() {
  if (activeRequests < MAX_CONCURRENT_GITHUB_REQUESTS) {
    activeRequests++;
    return;
  }

  await new Promise((resolve) => {
    waitingRequests.push(resolve);
  });

  activeRequests++;
}

function releaseSlot() {
  activeRequests--;

  const next = waitingRequests.shift();

  if (next) {
    next();
  }
}

async function githubFetch(url) {
  await acquireSlot();

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 8000);

  try {
    const res = await fetch(url, {
      headers,
      signal: controller.signal,
    });

    const remaining = res.headers.get("x-ratelimit-remaining");

    if (
      res.status === 429 ||
      (res.status === 403 && remaining === "0")
    ) {
      throw new GitHubRateLimitError();
    }

    return res;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("GitHub API request timed out");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
    releaseSlot();
  }
}

export async function getUser(username) {
  const res = await githubFetch(
    `${GH_BASE}/users/${encodeURIComponent(username)}`
  );

  if (!res.ok) {
    const text = await res.text();

    console.error(
      `GitHub API Error (getUser): ${res.status}`,
      text
    );

    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

export async function getRepos(username) {
  const res = await githubFetch(
    `${GH_BASE}/users/${encodeURIComponent(
      username
    )}/repos?per_page=100&type=owner`
  );

  if (!res.ok) {
    const text = await res.text();

    console.error(
      `GitHub API Error (getRepos): ${res.status}`,
      text
    );

    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

export async function getRepoLanguages(username, repoName) {
  const res = await githubFetch(
    `${GH_BASE}/repos/${encodeURIComponent(
      username
    )}/${encodeURIComponent(repoName)}/languages`
  );

  if (!res.ok) {
    const text = await res.text();

    console.error(
      `GitHub API Error (getRepoLanguages: ${repoName}): ${res.status}`,
      text
    );

    return {};
  }

  return res.json();
}
