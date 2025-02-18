import { Err, Grid, Ok, Result } from "~/shared/types";
import { createAsciiQrCode, flipGrid } from "~/shared/utils";

export const BIT_ALIGNMENT_WHITE = 2;
export const BIT_ALIGNMENT_BLACK = 3;
export const BIT_ERROR_CORRECTION = 4;
export const BIT_MISC_RESERVED = 5;
export const BIT_FILLED_WHITE = 6;
export const BIT_FILLED_BLACK = 7;

const dataFormats = {
  binary: "0100",
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
  const [d1, d2, d3, d4] = dataFormats[dataFormat].replaceAll("0", "2").replaceAll("1", "3").split("") as unknown as number[];

  const [l1, l2, l3, l4, l5, l6, l7, l8] = contentLen
    .toString(2)
    .padStart(8, "0")
    .replaceAll("0", "2")
    .replaceAll("1", "3")
    .split("") as unknown as number[];

  return [
    [3., 3., 3., 3., 3., 3., 3., 5., 4., -1, -1, -1, -1, -1, -1, -1, -1, 5., 3., 3., 3., 3., 3., 3., 3.],
    [3., 2., 2., 2., 2., 2., 3., 5., 4., -1, -1, -1, -1, -1, -1, -1, -1, 5., 3., 2., 2., 2., 2., 2., 3.],
    [3., 2., 3., 3., 3., 2., 3., 5., 4., -1, -1, -1, -1, -1, -1, -1, -1, 5., 3., 2., 3., 3., 3., 2., 3.],
    [3., 2., 3., 3., 3., 2., 3., 5., 4., -1, -1, -1, -1, -1, -1, -1, -1, 5., 3., 2., 3., 3., 3., 2., 3.],
    [3., 2., 3., 3., 3., 2., 3., 5., 4., -1, -1, -1, -1, -1, -1, -1, -1, 5., 3., 2., 3., 3., 3., 2., 3.],
    [3., 2., 2., 2., 2., 2., 3., 5., 4., -1, -1, -1, -1, -1, -1, -1, -1, 5., 3., 2., 2., 2., 2., 2., 3.],
    [3., 3., 3., 3., 3., 3., 3., 5., 3., -1, 3., -1, 3., -1, 3., -1, 3., 5., 3., 3., 3., 3., 3., 3., 3.],
    [5., 5., 5., 5., 5., 5., 5., 5., 4., -1, -1, -1, -1, -1, -1, -1, -1, 5., 5., 5., 5., 5., 5., 5., 5.],
    [4., 4., 4., 4., 4., 4., 3., 4., 4., -1, -1, -1, -1, -1, -1, -1, -1, 4., 4., 4., 4., 4., 4., 4., 4.],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 3., -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 3., -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 3., -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 3., -1, -1, -1, -1, -1, -1, -1, -1, -1, 3., 3., 3., 3., 3., -1, -1, -1, -1],
    [5., 5., 5., 5., 5., 5., 5., 5., 3., -1, -1, -1, -1, -1, -1, -1, 3., 2., 2., 2., 3., -1, -1, -1, -1],
    [3., 3., 3., 3., 3., 3., 3., 5., 4., -1, -1, -1, -1, -1, -1, -1, 3., 2., 3., 2., 3., -1, -1, -1, -1],
    [3., 2., 2., 2., 2., 2., 3., 5., 4., -1, -1, -1, -1, -1, -1, -1, 3., 2., 2., 2., 3., -1, -1, l8, l7],
    [3., 2., 3., 3., 3., 2., 3., 5., 4., -1, -1, -1, -1, -1, -1, -1, 3., 3., 3., 3., 3., -1, -1, l6, l5],
    [3., 2., 3., 3., 3., 2., 3., 5., 4., -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, l4, l3],
    [3., 2., 3., 3., 3., 2., 3., 5., 4., -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, l2, l1],
    [3., 2., 2., 2., 2., 2., 3., 5., 4., -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, d4, d3],
    [3., 3., 3., 3., 3., 3., 3., 5., 4., -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, d2, d1],
  ];
}

function walkGrid(grid: Grid, bitArr: string[]) {
  const gridFlipped = flipGrid(grid);

  let isGoingUp = true;

  console.log("BIT ARRAY:", bitArr);

  let i = 0;
  let currentX = 0;
  let currentY = 6;

  while (true) {
    const currentGridBit = currentY >= 0 && currentY <= 24 ? gridFlipped.at(currentY)!.at(currentX) : 1;

    console.log("BEFORE POS:", currentX, currentY);

    const shouldTurn =
      currentGridBit === 0
      || currentGridBit === 1
      || currentGridBit === BIT_ERROR_CORRECTION
      || currentGridBit === BIT_MISC_RESERVED
      ;

    if (shouldTurn) {
      if (isGoingUp) currentY--;
      else currentY++;

      currentX += 2;
    }

    const shouldSkip =
      currentGridBit === BIT_ALIGNMENT_WHITE
      || currentGridBit === BIT_ALIGNMENT_BLACK
      ;

    if (shouldSkip) {
      console.log("SKIPPING POSITION");
    } else {
      const bit = bitArr.shift();
      if (bit === undefined) {
        console.log("EMPTY INPUT !!!");
        break;
      };
      gridFlipped[currentY][currentX] = bit === "0" ? BIT_FILLED_WHITE : BIT_FILLED_BLACK;
      console.log("BIT:", bit, i);
    }

    if (shouldTurn) {
      isGoingUp = !isGoingUp;
    }

    if (isGoingUp) {
      if (currentX % 2 === 0) {
        currentX++;
      } else {
        currentY++;
        currentX--;
      }
    } else {
      if (currentX % 2 === 0) {
        currentX++;
      } else {
        currentY--;
        currentX--;
      }
    }

    console.log("CURRENT BITS:", bitArr.length, ":", bitArr.join(""));
    console.log("AFTER POS:", currentX, currentY);
    console.log(createAsciiQrCode(flipGrid(gridFlipped)));
    console.log("CGB:", currentGridBit);
    console.log("SHOULD TURN:", shouldTurn);

    console.log("\n\n");

    i++;
  }

  console.log("\n\n");

  return flipGrid(gridFlipped);
}

export default defineEventHandler(async (e) => {
  const content: string = decodeURIComponent((await readBody(e)).content);
  console.log("CONTENT:", content);

  const byteArr = toBinaryArray(content);
  if (byteArr.isErr())
    return {
      errors: { content: "Content can only contain valid ASCII characters." },
    };
  const bytes = byteArr.unwrap();

  const grid = initGrid("binary", bytes.length);

  const bitArr = bytes.flatMap((byte) => byte.split(""));
  const result = walkGrid(grid, bitArr);
  const qrCode = result.map(row => row.map((cell) =>
    parseInt(cell.toString()
      .replace(BIT_ALIGNMENT_WHITE.toString(), "0")
      .replace(BIT_ALIGNMENT_BLACK.toString(), "1")
      .replace(BIT_ERROR_CORRECTION.toString(), "0")
      .replace(BIT_MISC_RESERVED.toString(), "0")
      .replace(BIT_FILLED_WHITE.toString(), "0")
      .replace(BIT_FILLED_BLACK.toString(), "1")
      .replace("-1", "0")))
  );

  console.log(createAsciiQrCode(grid));

  return { generatedCode: qrCode };
});
