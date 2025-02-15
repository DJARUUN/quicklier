import { Err, Grid, Ok, Result } from "~/shared/types";
import { createAsciiQrCode } from "~/shared/utils";

const dataFormats = {
  binary: [0, 1, 0, 0],
};

function toBinaryArray(text: string): Result<string[]> {
  const binaryArray = [];

  for (const char of text.split("")) {
    const asciiCode = char.charCodeAt(0);
    if (asciiCode > 255) return new Err("fortnite?");

    const binary = asciiCode.toString(2).padStart(8, "0");
    binaryArray.push(binary);

    console.log("ASCII CODE:", asciiCode);
  }

  return new Ok(binaryArray);
}

function initGrid(
  dataFormat: keyof typeof dataFormats,
  contentLen: number,
): Grid {
  const [d1, d2, d3, d4] = dataFormats[dataFormat];

  const [l1, l2, l3, l4, l5, l6, l7, l8] = contentLen
    .toString(2)
    .padStart(8, "0")
    .split("") as unknown as number[];

  // prettier-ignore
  return [
    [1, 1, 1, 1, 1, 1, 1, 0, -2, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, -2, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, -2, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, -2, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, -2, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, -2, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, -2, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0],
    [-2, -2, -2, -2, -2, -2, 1, -2, -2, -1, -1, -1, -1, -1, -1, -1, -1, -2, -2, -2, -2, -2, -2, -2, -2],
    [-1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, -1, -1, -1, -1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, -1, -1, -1, -1, -1, -1, -1, 1, 0, 0, 0, 1, -1, -1, -1, -1],
    [1, 1, 1, 1, 1, 1, 1, 0, -2, -1, -1, -1, -1, -1, -1, -1, 1, 0, 1, 0, 1, -1, -1, -1, -1],
    [1, 0, 0, 0, 0, 0, 1, 0, -2, -1, -1, -1, -1, -1, -1, -1, 1, 0, 0, 0, 1, -1, -1, l8, l7],
    [1, 0, 1, 1, 1, 0, 1, 0, -2, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, -1, -1, l6, l5],
    [1, 0, 1, 1, 1, 0, 1, 0, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, l4, l3],
    [1, 0, 1, 1, 1, 0, 1, 0, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, l2, l1],
    [1, 0, 0, 0, 0, 0, 1, 0, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, d4, d3],
    [1, 1, 1, 1, 1, 1, 1, 0, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, d2, d1],
  ]
}

export default defineEventHandler(async (e) => {
  const content: string = decodeURIComponent(
    getRouterParam(e, "content") || "",
  );

  const binaryArr = toBinaryArray(content);
  if (binaryArr.isErr())
    return {
      errors: { content: "Content can only contain valid ASCII characters." },
    };

  const grid = initGrid("binary", binaryArr.unwrap().length);

  let startX = 1;
  let startY = 9;

  for (const binary of [
    binaryArr.unwrap().map((bin) => bin.split("").toReversed().join(""))[0],
  ]) {
    console.log("BINARY:", binary);
    let bitI = 0;

    for (let i = 1; i <= 4; i++) {
      const y = grid.length - startY - 1 + i;

      for (let j = 1; j <= 2; j++) {
        const x = grid.length - startX - 1 + j;

        const bit = binary[bitI];
        grid[y - 1][x - 1] = bit === "1" ? 8 : 9;

        bitI++;
      }
    }
  }

  console.log(createAsciiQrCode(grid));

  return { generatedCode: grid };
});
