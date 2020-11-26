import { Media, Rule, StyleRules } from "css";
import * as fs from "fs";
import { join } from "path";
import { cwd } from "process";
import { ASTTypes, getCssObjects } from "../getCssObjects";

describe("CSS Object Test", () => {
    let cssFile: string;
    let cssObj: StyleRules["rules"] | false;
    beforeAll((done) => {
        cssFile = fs.readFileSync(
            join(process.cwd(), "__test_assets__", "getCSSObject.test.css"),
            { encoding: "utf-8" }
        );
        done();
    });
    beforeEach((done) => {
        const bootstrap_classes = JSON.parse(fs.readFileSync(join(cwd(), "__dev_test_assets__", "bootstrap_classes.json"), "utf-8"))
        cssObj = getCssObjects(cssFile, Object.values(bootstrap_classes));
        done();
    })
    it("Shouldn't output false instead of outputting css-AST[] ", () => {
        expect(cssObj).not.toBe(false);
    });

    it("Should output Array of css AST objects", () => {
        const selectors = [
            ".col",
            ".navbar .container",
            ".navbar .container-fluid",
            ".navbar .container-sm",
            ".navbar .container-md",
            ".navbar .container-lg",
            ".navbar .container-xl",
        ];
        if (cssObj) {
            const onlySelectors = cssObj
                .map((cssDec: Rule) => cssDec.selectors)
                .flat(1).filter(Boolean);
            expect(onlySelectors).toEqual<string[]>(selectors);
        }
    });
    it("Should output Array of css AST objects with @media queries", () => {
        const selectors = [
            ".col",
            ".col-xs-11"
        ];
        if (cssObj) {
            const mediaSelectors = cssObj.map((cssDec: Media) => {
                if (cssDec.type === ASTTypes.media) {
                    return cssDec.rules?.map((dec: Rule) => dec.type === ASTTypes.rule && dec.selectors).flat(1).filter(Boolean)
                };
            }).flat(1).filter(Boolean);

            expect(mediaSelectors).toEqual<string[]>(selectors);
        }
    })
});
