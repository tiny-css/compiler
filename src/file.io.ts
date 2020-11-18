import path from "path";

function getFileNameOnly(name:string):string {
    if (name.includes("/")) {
        const nameArr = name.split("/")
        return nameArr[nameArr.length - 1].split(".")[0];
    }
    return name.split(".")[0];
}

function getFileIO(): {inputFilePath: string, outputFilePath:string}{
    const [,,fileArg] = process.argv
    const cwd = process.cwd();
    const fileAbsPath = path.join(cwd, fileArg);

    if(path.extname(fileAbsPath)!==".html")new TypeError("Provided file is not an html file");
    const filename = getFileNameOnly(fileArg);
    const outputFilePath = path.join(cwd, `${filename}.css`)
    return {inputFilePath: fileAbsPath, outputFilePath}
}

export const {inputFilePath, outputFilePath} = getFileIO()