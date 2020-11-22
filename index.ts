#!/usr/bin/env node
/**
 * @author KR Tirtho
 * Flow:
 *      input.html--------->defined classnames----------->filter tiny-css classnames--------->
 *                                                                                           |
 *     |---------------------------grab css objects from stylesheet.css relatively<----------|
 *     |
 *     |------>check output.css to not write same style twice------->write to output.css
 */

import { filterWithClassnames } from "./src/filterTinyClasses";
import { getClassnames } from "./src/getClassnames";
import * as fs from "fs";
import { join } from "path";
import { tinyCssClasses } from "@tiny-css/classes";
import "./src/getCssObjects";
import { ASTTypes, getCssObjects } from "./src/getCssObjects";
import css from "css";
import yargs, { Argv } from "yargs";
import chalk from "chalk";
import { IOptions } from "glob";

type TArgv = Argv["argv"];

interface Arguments extends TArgv {
    input: string;
    i: string;
    output: string;
    o: string;
    classes?: string;
    c?: string;
    ignore: string[];
    cwd: string;
    debug: boolean;
    d: boolean;
}

const argv = yargs
    .command("$0", "HTML File Glob Pattern", {
        input: {
            alias: "i",
            description:
                "CSS Input file which will be used to retrieve style objects",
            demandOption: true,
        },
        output: {
            alias: "o",
            description: "CSS Output file",
            default: join(process.cwd(), "tiny.output.css"),
            defaultDescription: "${cwd}/tiny.output.css",
        },
        classes: {
            alias: "c",
            description: `The path to the <json> file where all the default classnames are described. This JSON file must contain all the classes in a Single Object.
            e.g: {bgPrimary: "bg-primary", bold: "bold"}`,
            defaultDescription: "@tiny-css/classes -> tinyCssClasses [Object] ",
        },
        debug: {
            type: "boolean",
            alias: "d",
            description:
                "Outputs verbose information about the currently running process",
            default: false,
            defaultDescription: "false",
        },
        cwd: {
            description: "Custom current working directory",
            default: process.cwd(),
            defaultDescription: "process.cwd()",
        },
        ignore: {
            type: "array",
            description:
                "An array glob pattern to ignore the path for file searching",
            default: ["node_modules"],
            defaultDescription: "**/node_modules/**/*",
        },
    })
    .help()
    .alias("help", "h").argv as Arguments;

const cwd = argv.cwd || process.cwd();
    
const config: IOptions = {
    cwd: argv.cwd,
    ignore: argv.ignore.map(ign=>join(cwd, ign)),
    debug: argv.debug,
};

getClassnames(argv._[0], config)
    .then(async (classnames) => {
        try {
            if (!classnames) {
                console.warn(
                    chalk.yellowBright(
                        "⚠ No classnames defined in any HTML files"
                    )
                );
                process.exit(0);
            }
            const providedClassnames = argv.classes
                ? JSON.parse(
                      await fs.promises.readFile(argv.classes, {
                          encoding: "utf-8",
                      })
                  )
                : tinyCssClasses;

            const filteredClassnames = filterWithClassnames(
                classnames,
                Object.values(providedClassnames)
            );
            const cssFileStr = await fs.promises.readFile(argv.input, "utf-8");
            const cssObj = getCssObjects(cssFileStr, filteredClassnames);

            if (!cssObj) {
                console.error(
                    chalk.redBright(
                        `❌ No CSS Style Declaration found relative to ${argv._[0]} in provided ${argv.input}`
                    )
                );
                process.exit(0);
            }

            const cssStr = css.stringify({
                type: ASTTypes.stylesheet,
                stylesheet: {
                    rules: cssObj,
                    parsingErrors: [],
                },
            });
            await fs.promises.writeFile(argv.output, cssStr, {
                encoding: "utf-8",
            });
            console.log(
                chalk.greenBright(
                    `✔ Writing declaration to ${argv.output} completed`
                )
            );
        } catch (error) {
            console.error(chalk.redBright("⁉ Something went wrong"));
            console.error(error);
        }
    })
    .catch((error) => {
        console.error(chalk.redBright("⁉ Something went wrong"));
        console.error(error);
    });
