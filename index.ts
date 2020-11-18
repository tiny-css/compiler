import { filterTinyClassnames } from "./src/filterTinyClasses";
import { getClassnames } from "./src/getClassnames";
import { promises as fs } from "fs";
import { join } from "path";
import bootstrap_classes from "./src/bootstrap_classes/bootstrap_classes";
import "./src/getCssObjects";
import { getCssObjects } from "./src/getCssObjects";

// export {staticUtility, classesToWrite, inputFilePath, outputFilePath, onlyTinyClasses, htmlClasses}

// getClassnames("src/**/*.html")
//     .then((classnames) => {
//         console.log("classnames:", classnames);
//         if (!classnames) throw new Error("No classnames!");
//         const tinyClassnames = filterTinyClassnames(classnames, bootstrap_classes);
//         console.log("bootstrap:", tinyClassnames);
//     })
//     .catch((e) => e);
fs.readFile("./src/stylesheets/bootstrap.css", { encoding: "utf-8" })
    .then((contents) => {
        const x = getCssObjects(contents, Object.values(bootstrap_classes));
        // console.log('x:', JSON.stringify(x, null, 3))
    })
    .catch((e) => e);
