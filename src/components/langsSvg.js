const palette = [
  "#F1C40F",
  "#3498DB",
  "#9B59B6",
  "#E74C3C",
  "#1ABC9C",
  "#E67E22",
];

export const generateLangsSVG = (langs) => {
  const padTop = 32;

  const total = langs.reduce((sum, [, count]) => sum + count, 0);
  const width = 600;
  const height = 220 + langs.length * 40;

  const barSegments = langs
    .map(([lang, count], i) => {
      const percent = (count / total) * 100;
      const barWidth = (percent * 400) / 100;
      const offset = langs
        .slice(0, i)
        .reduce((sum, [, c]) => sum + (c / total) * 400, 0);

      return `
        <rect 
          x="${30 + offset}"
          y="${padTop + 80}"
          width="${barWidth}"
          height="14"
          rx="7"
          fill="${palette[i % palette.length]}"
        />
      `;
    })
    .join("");

  const rows = langs
    .map(([lang, count], i) => {
      const percent = ((count / total) * 100).toFixed(2);

      return `
        <circle 
          cx="40" 
          cy="${padTop + 120 + i * 40}" 
          r="8" 
          fill="${palette[i % palette.length]}" 
        />
        <text 
          x="60" 
          y="${padTop + 125 + i * 40}" 
          font-size="16" 
          font-family="Inter, Segoe UI, sans-serif" 
          fill="#2c3e50"
        >
          ${lang} — ${percent}%
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
    Most Used Languages
  </text>

  <rect 
    x="30" 
    y="${padTop + 80}" 
    width="400" 
    height="14" 
    rx="7" 
    fill="#e5e7eb" 
  />

  ${barSegments}
  ${rows}
</svg>
`;
};
