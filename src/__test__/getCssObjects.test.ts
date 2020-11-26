import css, {
  Media, Rule, StyleRules, Stylesheet,
} from "css";
import * as fs from "fs";
import { join } from "path";
import { cwd } from "process";
import { ASTTypes } from "../utils/ASTTypes";
import { getCssObjects } from "../getCssObjects";

describe("CSS Object Test", () => {
  let stylesheetObj: Stylesheet;
  let cssObj: StyleRules["rules"] | false;
  beforeAll(() => {
    stylesheetObj = css.parse(fs.readFileSync(
      join(process.cwd(), "__test_assets__", "getCSSObject.test.css"),
      { encoding: "utf-8" },
    ));
  });
  beforeEach(() => {
    const bootstrapClasses = JSON.parse(fs.readFileSync(join(cwd(), "__dev_test_assets__", "bootstrap_classes.json"), "utf-8"));
    cssObj = getCssObjects(stylesheetObj, Object.values(bootstrapClasses));
  });
  it("Shouldn't output false instead of outputting css-AST[]", () => {
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
    let onlySelectors: string[] = [];
    if (cssObj) {
      onlySelectors = cssObj
        .map((cssDec: Rule) => cssDec.selectors)
        .flat(1).filter(Boolean) as string[];
    }
    expect(onlySelectors).toEqual<string[]>(selectors);
  });
  it("Should output Array of css AST objects with @media queries", () => {
    const selectors = [
      ".col",
      ".col-xs-11",
    ];
    let mediaSelectors:string[] = [];
    if (cssObj) {
      mediaSelectors = cssObj
        .map((cssDec: Media) => cssDec.type === ASTTypes.media
                && cssDec.rules?.map((dec: Rule) => dec.type === ASTTypes.rule && dec.selectors)
                  .flat(1).filter(Boolean)).flat(1).filter(Boolean) as string[];
    }

    expect(mediaSelectors).toEqual<string[]>(selectors);
  });
});
