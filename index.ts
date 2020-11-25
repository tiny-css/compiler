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
import { buildCSSClass } from "./src/buildCSSClass";

const tinyCssCredits = `/*!
 * CSS Generated using @tiny-css/compiler@0.0.1 
 * @author KR.Tirtho
 * Copyright 2020 KR.Tirtho
 * Licensed under MIT (https://github.com/tiny-css/compiler/blob/master/LICENSE)
 */\n
`

type TArgv = Argv["argv"];

interface Arguments extends TArgv {
    input: string;
    i: string;
    output: string;
    o: string;
    "cdn-version": string;
    c: string;
    "disable-cache": boolean;
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
                "CSS Input file which will be used to retrieve style objects. This can be a fs path or a cdm link",
            demandOption: true,
        },
        "cdn-version": {
            alias: "c",
            description: "The version of the css input file. Important if `--disable-cache` option is disabled & files are cached. This is used to determine the cache file location. Not required if using fs path",
            default: "0.0.1",
            defaultDescription: "0.0.1"
        },
        output: {
            alias: "o",
            description: "CSS Output file",
            default: join(process.cwd(), "tiny.output.css"),
            defaultDescription: "${cwd}/tiny.output.css",
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
        "disable-cache": {
            boolean: true,
            description: "Disable caching stylesheets",
            default: false,
            defaultDescription: "false"
        }
    })
    .help()
    .alias("help", "h").argv as Arguments;

const cwd = argv.cwd || process.cwd();

const config: IOptions = {
    cwd: argv.cwd,
    ignore: argv.ignore.map(ign => join(cwd, ign)),
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
            const providedClassnames = await buildCSSClass(argv.input, { disabledCache: argv["disable-cache"], version: argv["cdn-version"] })

            const filteredClassnames = filterWithClassnames(classnames, providedClassnames.classnames);
            const cssObj = getCssObjects(providedClassnames.content, filteredClassnames);

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

            await fs.promises.writeFile(argv.output, `${tinyCssCredits}${cssStr}`, {
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
