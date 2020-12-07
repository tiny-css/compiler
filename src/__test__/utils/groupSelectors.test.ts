import { groupSelector, SelectorObject, SelectorType } from "../../utils/groupSelectors";

describe(`${groupSelector.name} AST Object Test`, () => {
  it("Should output an array of `SelectorObject`", () => {
    const testSelectors:string[] = [".oss th", "a:hover", "abbr table"];
    const selectorASTArr = groupSelector(testSelectors);
    console.log("selectorASTArr:", selectorASTArr);
    const resultArr: SelectorObject[] = [
      { type: SelectorType.class, selector: [".oss"] },
      { type: SelectorType.tag, selector: ["th"] },
      { type: SelectorType.tag, selector: ["a"] },
      { type: SelectorType.tag, selector: ["abbr", "table"] },
    ];
    expect(selectorASTArr).toEqual<SelectorObject[]>(resultArr);
  });
});