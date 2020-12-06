import { groupSelector, SelectorObject } from "../utils/groupSelectors";

describe(`${groupSelector.name} AST Object Test`, () => {
  it("Should output an array of `SelectorObject`", () => {
    const testSelectors:string[] = [".oss th", "a:hover", "abbr table"];
    const selectorASTArr = groupSelector(testSelectors);
    console.log("selectorASTArr:", selectorASTArr);
    const resultArr:SelectorObject[] = [];
    expect(selectorASTArr).toEqual<SelectorObject[]>(resultArr);
  });
});