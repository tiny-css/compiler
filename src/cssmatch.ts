import fs from "fs";
import {onlyTinyClasses} from "./match";
//! For production 
import { outputFilePath } from "./file.io";
const path = __dirname+"/test.css" //!For Development

const classesToWrite = [];

const isAvailable = fs.existsSync(path);
/* Checking if the file exists */
if (isAvailable) {
  /* if Exists then readFile */
  const content = fs.readFileSync(path, {
    encoding: "utf-8",
  });
  /* If there is content then we have to check for the available css classes */
  /**
   * TODO: Ignore all the comment
   * TODO: Filter all the white space "\s"
   * TODO: have to remove everything inside "{..}"
   * TODO: Have to unify the classes, keep unique css classes only
   */
  /* This Removes all the contents except class*/
  if (content) {
    const onlyClassesRegex = /\{.+?\}/gi;

    const ignoreCssComment = /\/\*.*?\*\//gi;
    const noCommentsCssFile = content.split(ignoreCssComment).join("");

    /* filtering all the whitespace, newline, tab etc. */
    const filteredWhiteSpace = noCommentsCssFile.split(/\s/).join("");
    /* Removing other css property & keeping only the classes */
    const onlyCssClass = filteredWhiteSpace
      .split(onlyClassesRegex)
      .join(" ")
      .split(".")
      .join("")
      .split(" ");
    /* Only Unique Classes */
    const uniqueCssClasses: string[] = [];

    new Set<string>(onlyCssClass).forEach((classes) => {
      uniqueCssClasses.push(classes);
    });

    /* Now have to create a CSS prop string for writing. Will be done using function */
    for (const htmlClass of onlyTinyClasses) {
      for (const cssClass of uniqueCssClasses) {
        /* If already has that class in the file, then do nothing else write that to file
                     But have to write the htmlClass not the css class
                     */
        if (htmlClass !== cssClass) {
          /* Pushing the unique classes in classesToWrite */
          classesToWrite.push(htmlClass);
          break;
        }
      }
    }
  }
}

export {classesToWrite}
