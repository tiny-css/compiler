import htmlParser from "node-html-parser";
import { promises as fsp } from "fs";
import glob, { IOptions } from "glob";
import chalk from "chalk";
import path from "path";

function globPromised(pattern: string, options?: IOptions): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, options ?? {}, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
}
/**
 * @description reads html files and returns an array of classes
 * @author KR Tirtho
 * @param {string} pattern glob pattern for path
 * @return {*}  {(Promise<string[]|false>)}
 */
export async function getClassnames(pattern:string, opts?: IOptions): Promise<string[]|false> {
  const cwd = opts?.cwd || process.cwd();
  try {
    const filesArr = await globPromised(pattern, opts); //returns an array glob files
    const classArr = await Promise.all(filesArr.map(async (file) => {
      const fileAbs = path.join(cwd, file);
      try {
        const files = await fsp.readFile(file, { encoding: "utf-8" });
        const document = htmlParser(files, { comment: false });
        /* dirty html class selector including falsy values */
        const allClasses = Array.from(
          new Set(document.querySelectorAll("*").map((el) => el.classNames)),
        );
        const flatClasses = Array.from(new Set(allClasses.flat(1)));
        if (flatClasses.length === 0) {
          console.warn(chalk.yellowBright(`⚠ No HTML classes in ${fileAbs} was found, so skipping!`));
          return false;
        }
        return flatClasses;
      } catch (e) {
        console.error(chalk.redBright`❌ File ${fileAbs} failed while formatting`);
        console.error(e);
        return false;
      }
    }));
    /* flattens the array & removes any falsy value */
    const finalClasses = classArr.flat(1).filter(Boolean) as string[];
    if (finalClasses.length === 0) {
      console.warn(chalk.yellowBright(`No classes found in any file from ${pattern}`));
      return false;
    }
    return finalClasses;
  } catch (e) {
    console.log("ERROR: ", e);
    return false;
  }
}