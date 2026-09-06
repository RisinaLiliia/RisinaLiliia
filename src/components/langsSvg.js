import { palette, svgBaseStyle, svgPadding } from "../shared/svgTheme.js";

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const safeNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return 0;
  }

  return number;
};

export const generateLangsSVG = (langs) => {
  const { top, left } = svgPadding;

  const safeLangs = Array.isArray(langs)
    ? langs
        .slice(0, 6)
        .map(([lang, count]) => [
          escapeXml(lang),
          safeNumber(count),
        ])
    : [];

  const total = safeLangs.reduce(
    (sum, [, count]) => sum + count,
    0
  );

  const width = 600;
  const desiredHeight = 340;
  const dynamicHeight = 200 + safeLangs.length * 40;

  const height = Math.max(
    desiredHeight,
    dynamicHeight
  );

  const barSegments =
    total > 0
      ? safeLangs
          .map(([, count], i) => {
            const percent = count / total;
            const barWidth = percent * 400;

            const offset = safeLangs
              .slice(0, i)
              .reduce(
                (sum, [, previousCount]) =>
                  sum +
                  (previousCount / total) * 400,
                0
              );

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
          .join("")
      : "";

  const rows =
    total > 0
      ? safeLangs
          .map(([lang, count], i) => {
            const percent = (
              (count / total) *
              100
            ).toFixed(2);

            return `
              <circle
                cx="40"
                cy="${top + 130 + i * 40}"
                r="8"
                fill="${palette[i % palette.length]}"
              />

              <text
                x="60"
                y="${top + 135 + i * 40}"
                class="label"
              >${lang} — ${percent}%</text>
            `;
          })
          .join("")
      : `
          <text
            x="${width / 2}"
            y="${top + 150}"
            text-anchor="middle"
            class="label"
          >
            Keine Sprachdaten verfügbar
          </text>
        `;

  return `
<svg
  width="${width}"
  height="${height}"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Meistverwendete Sprachen"
>
  <style>${svgBaseStyle}</style>

  <rect
    class="card"
    x="0"
    y="0"
    width="${width}"
    height="${height}"
  />

  <text
    x="${width / 2}"
    y="${top + 30}"
    text-anchor="middle"
    class="title"
  >
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
