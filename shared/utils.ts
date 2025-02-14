import type { Grid } from "./types";

export function createAsciiQrCode(grid: Grid) {
  const blocks = {
    "0": "__",
    "1": "[]",
    "-1": "..",
    "-2": ",,",
    "8": "{}",
    "9": "--",
  };

  const code = [];

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];

    let rowString = "";

    for (const cell of row) {
      rowString += blocks[cell as unknown as keyof typeof blocks];
    }

    code.push(rowString);
  }

  return code.join("\n");
}
