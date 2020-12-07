import { groupSelector, SelectorObject, SelectorType } from "../../utils/groupSelectors";

describe(`${groupSelector.name} AST Object Test`, () => {
  it("Should output an array of `SelectorObject`", () => {
    const testSelectors:string[] = [".table th", "a:hover", "abbr table", ".btn .btn-primary", "*", ":root ", "*::after", "::webkit-scroll-bar ::webkit-scroll-bar-button"];
    const selectorASTArr = groupSelector(testSelectors);
    const resultArr: SelectorObject[] = [
      { type: SelectorType.class, selector: [".table"] },
      { type: SelectorType.tag, selector: ["th"] },
      { type: SelectorType.tag, selector: ["a"] },
      { type: SelectorType.tag, selector: ["abbr", "table"] },
      { type: SelectorType.class, selector: [".btn", ".btn-primary"] },
      { type: SelectorType.pseudo, selector: ["*"] },
      { type: SelectorType.pseudo, selector: [":root"] },
      { type: SelectorType.pseudo, selector: ["*::after"] },
      { type: SelectorType.pseudo, selector: ["::webkit-scroll-bar", "::webkit-scroll-bar-button"] },
    ];
    expect(selectorASTArr).toEqual<SelectorObject[]>(resultArr);
  });
});