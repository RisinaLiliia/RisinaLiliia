const palette = [
  "#F1C40F",
  "#3498DB",
  "#9B59B6",
  "#E74C3C",
  "#1ABC9C",
  "#E67E22",
];

export const generateStatsSVG = (username, stats) => {
  const data = [
    { label: "Repos", value: stats.repoCount },
    { label: "Stars", value: stats.stars },
    { label: "Forks", value: stats.forks },
    { label: "Followers", value: stats.followers },
    { label: "Following", value: stats.following },
  ];

  const width = 420;
  const height = 150 + Math.ceil(data.length / 3) * 90;

  const blocks = data
    .map((d, i) => {
      const x = 20 + (i % 3) * 130;
      const y = 70 + Math.floor(i / 3) * 90;
      const color = palette[i % palette.length];
      return `
        <!-- Блок метрики -->
        <rect x="${x}" y="${y}" width="120" height="60" rx="12" fill="${color}33"/>
        <!-- Значение -->
        <text x="${x + 60}" y="${
        y + 25
      }" font-size="20" font-family="Inter, Segoe UI, sans-serif" fill="#111" text-anchor="middle" font-weight="600">
          ${d.value}
        </text>
        <!-- Подпись -->
        <text x="${x + 60}" y="${
        y + 45
      }" font-size="13" font-family="Inter, Segoe UI, sans-serif" fill="#333" text-anchor="middle">
          ${d.label}
        </text>
      `;
    })
    .join("");

  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">

  <style>
    .card { fill: #ffffff; stroke: #e5e7eb; stroke-width: 1.2; rx: 14; }
    .title { font: 700 20px 'Inter', 'Segoe UI', sans-serif; fill: #2563eb; }
  </style>

  <rect class="card" x="0" y="0" width="${width}" height="${height}" />

  <!-- Заголовок -->
  <text x="${width / 2}" y="32" text-anchor="middle" class="title">
    GitHub Stats — ${username}
  </text>

  <!-- Блоки с метриками -->
  ${blocks}

</svg>
`;
};
