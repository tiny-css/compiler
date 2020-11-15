import process from "process";
import path from "path";
import { NODE_ENV } from "../config";

const inputFileName = process.argv[2]
const currentDirectory  = process.cwd();
const inputFilePath = currentDirectory+"\\"+inputFileName
let outputFilePath;
if(path.extname(inputFilePath)===".html" && NODE_ENV==="production"){
    const inputFileSplit = inputFileName.split(".")
    inputFileSplit.pop()
    outputFilePath = currentDirectory+inputFileSplit.join("-")+".css"
}
else if(NODE_ENV==="production"){
    console.error(new TypeError("Wrong file type provided, only *.html"))
    process.exit(1);
}
// This is for development. Don't touch
else {
    module.exports = {inputFilePath}
}
export {inputFilePath}
export {outputFilePath}
