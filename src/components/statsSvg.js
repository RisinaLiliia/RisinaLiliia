const palette = [
  "#F1C40F",
  "#3498DB",
  "#9B59B6",
  "#E74C3C",
  "#1ABC9C",
  "#E67E22",
];

export const generateStatsSVG = (username, stats) => {
  const padTop = 32;

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
      const x = 30 + (i % 3) * 180;
      const y = padTop + 90 + Math.floor(i / 3) * 120;
      const color = palette[i % palette.length];
      return `
        <rect x="${x}" y="${y}" width="160" height="80" rx="16" fill="${color}33"/>
        <text x="${x + 80}" y="${
        y + 35
      }" font-size="26" font-family="Inter, Segoe UI, sans-serif" fill="#111" text-anchor="middle" font-weight="600">
          ${d.value}
        </text>
        <text x="${x + 80}" y="${
        y + 60
      }" font-size="18" font-family="Inter, Segoe UI, sans-serif" fill="#333" text-anchor="middle">
          ${d.label}
        </text>
      `;
    })
    .join("");

  return `
<svg width="${width}" height="${
    height + padTop
  }" xmlns="http://www.w3.org/2000/svg">
  <style>
    .card { fill: #ffffff; stroke: #e5e7eb; stroke-width: 1.5; rx: 16; }
    .title { font: 700 28px 'Inter', 'Segoe UI', sans-serif; fill: #2c3e50; }
  </style>

  <rect class="card" x="0" y="0" width="${width}" height="${height + padTop}" />

  <text x="${width / 2}" y="${padTop + 50}" text-anchor="middle" class="title">
    GitHub Statistiken
  </text>

  ${blocks}
</svg>
`;
};
