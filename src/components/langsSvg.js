const palette = [
  "#F1C40F",
  "#3498DB",
  "#9B59B6",
  "#E74C3C",
  "#1ABC9C",
  "#E67E22",
];

export const generateLangsSVG = (langs) => {
  const total = langs.reduce((sum, [, count]) => sum + count, 0);
  const height = 180 + langs.length * 26;

  const barSegments = langs
    .map(([lang, count], i) => {
      const percent = (count / total) * 100;
      const width = (percent * 260) / 100;

      return `
        <rect 
          x="${
            20 +
            langs.slice(0, i).reduce((sum, [, c]) => sum + (c / total) * 260, 0)
          }"
          y="55"
          width="${width}"
          height="10"
          rx="5"
          fill="${palette[i % palette.length]}"
        />
      `;
    })
    .join("");

  const rows = langs
    .map(([lang, count], i) => {
      const percent = ((count / total) * 100).toFixed(2);
      return `
        <circle cx="35" cy="${105 + i * 26}" r="6" fill="${
        palette[i % palette.length]
      }" />
        <text x="50" y="${110 + i * 26}" 
              font-size="13" 
              font-family="Inter, Segoe UI, sans-serif"
              fill="#2c3e50">
          ${lang} — ${percent}%
        </text>
      `;
    })
    .join("");

  return `
<svg width="420" height="${height}" xmlns="http://www.w3.org/2000/svg">

  <style>
    .card {
      fill: #ffffff;
      stroke: #e5e7eb;
      stroke-width: 1.2;
      rx: 14;
    }
    .title {
      font: 700 20px 'Inter', 'Segoe UI', sans-serif;
      fill: #2563eb;
    }
  </style>

  <rect class="card" x="0" y="0" width="420" height="${height}" />

  <!-- Заголовок -->
  <text x="210" y="32" text-anchor="middle" class="title">
    Most Used Languages
  </text>

  <!-- График -->
  <rect x="20" y="55" width="260" height="10" rx="5" fill="#e5e7eb" />
  ${barSegments}

  <!-- Список языков -->
  ${rows}

</svg>
`;
};
