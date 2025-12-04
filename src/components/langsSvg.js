import { palette, svgBaseStyle, svgPadding } from "../shared/svgTheme.js";

export const generateLangsSVG = (langs) => {
  const { top, left } = svgPadding;

  const total = langs.reduce((sum, [, count]) => sum + count, 0);

  const width = 600;
  const height = 200 + langs.length * 40;

  const barSegments = langs
    .map(([lang, count], i) => {
      const percent = count / total;
      const barWidth = percent * 400;
      const offset = langs
        .slice(0, i)
        .reduce((sum, [, c]) => sum + (c / total) * 400, 0);

      return `
        <rect 
          x="${left + offset}"
          y="${top + 80}"
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
        <circle cx="40" cy="${top + 130 + i * 40}" r="8" fill="${
        palette[i % palette.length]
      }" />
        <text x="60" y="${
          top + 135 + i * 40
        }" class="label">${lang} — ${percent}%</text>
      `;
    })
    .join("");

  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <style>${svgBaseStyle}</style>

  <rect class="card" x="0" y="0" width="${width}" height="${height}" />

  <text x="${width / 2}" y="${top + 30}" text-anchor="middle" class="title">
    Meistverwendete Sprachen
  </text>

  <rect 
    x="${left}" 
    y="${top + 80}" 
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
