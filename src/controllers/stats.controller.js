import { getUser, getRepos } from "../services/github.service.js";
import { setCache, getCache } from "../utils/cache.js";
import { generateStatsSVG } from "../components/statsSvg.js";

export const getStats = async (req, res) => {
  const username = req.query.username || "RisinaLiliia";
  const cacheKey = `stats_${username}`;

  const cached = getCache(cacheKey);
  if (cached) {
    return sendSvg(res, cached);
  }

  const user = await getUser(username);
  const repos = await getRepos(username);

  const stats = {
    repoCount: user.public_repos,
    followers: user.followers,
    following: user.following,
    stars: repos.reduce((s, r) => s + r.stargazers_count, 0),
    forks: repos.reduce((s, r) => s + r.forks_count, 0),
  };

  const svg = generateStatsSVG(username, stats);

  console.log(svg);

  setCache(cacheKey, svg);

  sendSvg(res, svg);
};

const sendSvg = (res, svg) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(svg);
};
