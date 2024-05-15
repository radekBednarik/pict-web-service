import * as xlsx from "xlsx";
/* load 'fs' for readFile and writeFile support */
import * as fs from "fs";
/* load the codepage support library for extended support with older formats  */
import * as cpexcel from "xlsx/dist/cpexcel.full.mjs";

import { writeFile } from "node:fs/promises";
import { resolve } from "path";

xlsx.set_fs(fs);
xlsx.set_cptable(cpexcel);

/**
 * Simplifies PICT output JSON structure so that `xlsx` utils method
 * can process it and saves to .xlsx file
 *
 * @param inputData string
 * @param outputPath string
 * @throws
 * @returns void
 **/
export function saveJsonAsXlsx(inputData: string, outputPath: string): void {
  try {
    const input = JSON.parse(inputData);
    const simplifiedInput = _simplifyJson(input);
    const worksheet = xlsx.utils.aoa_to_sheet(simplifiedInput);
    const workbook = xlsx.utils.book_new(worksheet);

    xlsx.writeFile(workbook, outputPath);
  } catch (err) {
    throw new Error(`func jsonToXlsx failed: ${err}`);
  }
}

/**
 * Converts .txt PICT output (which is in reality .tsv type of file)
 * to .csv by replacing all `\t` for `,`.
 * Saves data to provided location.
 * That is all :)
 *
 * @param inputData string
 * @param filepath string
 * @throws
 * @returns Promise<void>
 **/
export async function saveTsvAsCsv(inputData: string, filepath: string): Promise<void> {
  try {
    const data = inputData.trim().replaceAll("\t", ",");
    await writeFile(filepath, data, { encoding: "utf-8" });
  } catch (error) {
    throw new Error(`func tsvToCsv failed: ${error}`);
  }
}

interface PictPair {
  key: string;
  value: string | number;
}
type PictCombination = PictPair[];
type PictJsonOutput = PictCombination[];
type SimplifiedRow = Array<string | number>;
type SimplifiedOutput = SimplifiedRow[];

function _simplifyJson(pictOutput: PictJsonOutput): SimplifiedOutput {
  const header = pictOutput[0].map((obj) => {
    return obj.key;
  });

  const rows: SimplifiedOutput = [];

  pictOutput.forEach((row) => {
    const temp: SimplifiedRow = [];
    row.forEach((obj) => {
      temp.push(obj.value);
    });
    rows.push(temp);
  });

  rows.unshift(header);

  return rows;
}
