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
  const rows = 2;
  const cols = 3;
  const blockHeight = 80;
  const blockSpacingY = 40;
  const blockSpacingX = 180;

  const height =
    top + 80 + rows * blockHeight + (rows - 1) * blockSpacingY + 40;

  const blocks = data
    .map((d, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = left + col * blockSpacingX;
      const y = top + 80 + row * (blockHeight + blockSpacingY);
      const color = palette[i % palette.length];

      return `
        <rect x="${x}" y="${y}" width="160" height="${blockHeight}" rx="16" fill="${color}22"/>
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
