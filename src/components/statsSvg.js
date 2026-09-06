import { palette, svgBaseStyle, svgPadding } from "../shared/svgTheme.js";

const safeNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return 0;
  }

  return Math.floor(number);
};

export const generateStatsSVG = (username, stats) => {
  const { top, left } = svgPadding;

  const data = [
    {
      label: "Repos",
      value: safeNumber(stats.repoCount),
    },
    {
      label: "Stars",
      value: safeNumber(stats.stars),
    },
    {
      label: "Forks",
      value: safeNumber(stats.forks),
    },
    {
      label: "Followers",
      value: safeNumber(stats.followers),
    },
    {
      label: "Following",
      value: safeNumber(stats.following),
    },
  ];

  const width = 600;
  const rows = 2;
  const cols = 3;

  const blockHeight = 80;
  const blockSpacingY = 40;
  const blockSpacingX = 180;

  const height =
    top +
    80 +
    rows * blockHeight +
    (rows - 1) * blockSpacingY +
    40;

  const blocks = data
    .map((item, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;

      const x =
        left +
        col * blockSpacingX;

      const y =
        top +
        80 +
        row * (blockHeight + blockSpacingY);

      const color =
        palette[i % palette.length];

      return `
        <rect
          x="${x}"
          y="${y}"
          width="160"
          height="${blockHeight}"
          rx="16"
          fill="${color}22"
        />

        <text
          x="${x + 80}"
          y="${y + 35}"
          class="value"
          text-anchor="middle"
        >
          ${item.value}
        </text>

        <text
          x="${x + 80}"
          y="${y + 60}"
          class="label"
          text-anchor="middle"
        >
          ${item.label}
        </text>
      `;
    })
    .join("");

  return `
<svg
  width="${width}"
  height="${height}"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="GitHub Statistiken"
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
    GitHub Statistiken
  </text>

  ${blocks}
</svg>
`;
};
