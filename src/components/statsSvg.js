import { palette, svgBaseStyle, svgPadding } from "../shared/svgTheme.js";

export const generateStatsSVG = (username, stats) => {
  const { top, left } = svgPadding;

  const data = [
    { label: "Repos", value: stats.repoCount },
    { label: "Stars", value: stats.stars },
    { label: "Forks", value: stats.forks },
    { label: "Followers", value: stats.followers },
    { label: "Following", value: stats.following },
  ];

  const width = 600;
  const height = 220 + Math.ceil(data.length / 3) * 120;

  const blocks = data
    .map((d, i) => {
      const x = left + (i % 3) * 180;
      const y = top + 80 + Math.floor(i / 3) * 120;
      const color = palette[i % palette.length];

      return `
        <rect x="${x}" y="${y}" width="160" height="80" rx="16" fill="${color}22"/>
        <text x="${x + 80}" y="${y + 35}" class="value" text-anchor="middle">${
        d.value
      }</text>
        <text x="${x + 80}" y="${y + 60}" class="label" text-anchor="middle">${
        d.label
      }</text>
      `;
    })
    .join("");

  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <style>${svgBaseStyle}</style>

  <rect class="card" x="0" y="0" width="${width}" height="${height}" />

  <text x="${width / 2}" y="${top + 30}" text-anchor="middle" class="title">
    GitHub Statistiken
  </text>

  ${blocks}
</svg>
`;
};
