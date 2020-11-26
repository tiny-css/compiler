import css, { Media, Rule, Stylesheet } from "css";
import * as fs from "fs";
import isUrl from "is-url";
import fetch from "node-fetch";
import os from "os";
import { join } from "path";
import chalk from "chalk";
import { ASTTypes } from "./utils/ASTTypes";
/**
 * returns only those selectors which are class selectors
 * not HTML tag attribute or sudo selectors
 */

function mapSelectors(selector: string): string[] | undefined {
    // removing any >/+ signs from the declarations
    selector.replace(/>|\+/g, ",");
    const onlyClassesRegexp = /\.(\w|-?|_|\d)+/g;
    const matched = selector.match(onlyClassesRegexp);
    if (matched) {
        return matched;
    }
}
/**
 * mapRules for checking rules & returning
 * the perfect selectors for the map function
 */

function mapRules(rule: Rule | Media): string[][] | void {
    const _rule = rule as Rule;
    if (_rule.type === ASTTypes.rule && _rule.selectors) {
        const selectorReal = _rule.selectors
            ?.map(mapSelectors)
            .filter(Boolean) as string[][];
        return selectorReal;
    }
    const mediaRule = rule as Media;
    if (mediaRule.type === ASTTypes.media && mediaRule.rules) {
        // CAUTION: Uses Recursion
        const mediaSelectors = mediaRule.rules
            .map(mapRules)
            .filter(Boolean)
            .flat(1) as string[][];
        return mediaSelectors;
    }
}

async function createCache(cacheFile: string, content: string): Promise<{ destination: string, size: number } | void> {
    try {
        await fs.promises.mkdir(join(os.homedir(), ".tiny-css", "stylesheets"), {recursive:true});
        await fs.promises.writeFile(cacheFile, content, "utf-8")
        return {
            destination: cacheFile,
            size: content.length
        }
    } catch (error) {
        console.log(createCache.name+": ", error);
    }
}

interface BuildCSSClassOptions {
    /**
     * [!important] cache version is determined from this
     */
    version: string,
    disabledCache: boolean
}

interface BuildCSSClassObject{
    classnames: string[];
    stylesheetObj: Stylesheet;
}

/**
 * @description Takes a css filepath and returns an array of selector classes
 * @author KR Tirtho
 * @param {string} cssPath - This can be a absolute/relative `fs-path` or a `cdn` link
 * @param {BuildCSSClassOptions} { version, disabledCache }
 * @return {*}  {Promise<string[]>}
 */
export async function buildCSSClass(
    cssPath: string,
    { version, disabledCache }: BuildCSSClassOptions
): Promise<BuildCSSClassObject> {
    let content: string = "";
    if (isUrl(cssPath)) {
        const urlDescription = cssPath.split("/");
        const cachedFileLocation = join(
            os.homedir(),
            ".tiny-css",
            "stylesheets",
            version + urlDescription[urlDescription.length - 1]
        );
        try {
            /* Checking in the cache folder if the file was previously cached */
            const cachedFile = await fs.promises.readFile(
                cachedFileLocation,
                "utf-8"
            );
            console.log(chalk.yellowBright`⚠ Using previously cached ${cachedFileLocation}`)
            content = cachedFile;
        } catch (error) {
            /* After founding no cached file the files are fetched from the link */
            try {
                console.warn(
                    chalk.yellowBright(
                        "⚠ No previously cached file found so downloading. You can disable caching by using `--disable-cache` option"
                    )
                );
                const response = await fetch(cssPath);
                console.log(
                    chalk.hex("##9b30ff")`Now downloading file from ${cssPath}`
                );
                const resStr = (await response.buffer()).toString();
                if (!disabledCache) {
                    await createCache(cachedFileLocation, resStr)
                };
                content = resStr
                console.log(chalk.greenBright`✔ Finished caching the file`);
            } catch (e) {
                console.log(e)
            }
        }
    } else {
        content = fs.readFileSync(cssPath, { encoding: "utf-8" });
    }
    const stylesheetObj = css.parse(content);
    const selectors = stylesheetObj.stylesheet?.rules
        .map(mapRules)
        .filter(Boolean)
        .flat(2) as string[];
    const uniqueSelectors = Array.from(new Set(selectors));
    return {
        classnames: uniqueSelectors,
        stylesheetObj
    };
}