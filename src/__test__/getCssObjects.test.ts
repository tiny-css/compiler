import { Media, Rule, StyleRules } from "css";
import * as fs from "fs";
import { join } from "path";
import bootstrap_classes from "../bootstrap_classes/bootstrap_classes";
import { getCssObjects } from "../getCssObjects";

describe("CSS Object Test", () => {
    let cssFile:string;
    let cssObj: StyleRules["rules"] | false;
    beforeAll((done) => {
         cssFile = fs.readFileSync(
            join(process.cwd(), "src", "__test__", "__test_assets__", "getCSSObject.test.css"),
            { encoding: "utf-8" }
        );
        done();
    });
    beforeEach((done) => {
        cssObj =  getCssObjects(cssFile, Object.values(bootstrap_classes));
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
                return cssDec.rules?.map((dec: Rule) => dec.selectors).flat(1)
            }).flat(1).filter(Boolean);

            expect(mediaSelectors).toEqual<string[]>(selectors);
        }
    })
});
