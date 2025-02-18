import type { Grid } from "./types";

export function createAsciiQrCode(grid: Grid) {
  const blocks = {
    "-1": "..",
    "2": "__",
    "3": "[]",
    "4": "::",
    "5": ",,",
    "6": "--",
    "7": "()",
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

export const flipGrid = (grid: Grid) => grid.map((row) => row.toReversed()).toReversed();
