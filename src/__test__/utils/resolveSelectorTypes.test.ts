import { SelectorType } from "../../utils/groupSelectors";
import { resolveSelectorTypes, SelectorObject } from "../../utils/resolveSelectorTypes";

describe(`${resolveSelectorTypes.name.toLocaleUpperCase()} efficiency Test`, () => {
  it("Should return only the types of selectors uniquely", () => {
    const testSelectors:string[] = [".table th", "a:hover", "abbr table", ".btn .btn-primary", "*", ":root ", "*::after", "::webkit-scroll-bar ::webkit-scroll-bar-button", ".btn .btn-primary"];
    const selectorASTArr = resolveSelectorTypes(testSelectors);
    console.log("selectorASTArr:", selectorASTArr);
    const resultArr: SelectorObject[] = [
      { type: SelectorType.class, selector: [".table"] },
      { type: SelectorType.class, selector: [".btn"] },
      { type: SelectorType.class, selector: [".btn-primary"] },
      { type: SelectorType.tag, selector: ["th"] },
      { type: SelectorType.tag, selector: ["a"] },
      { type: SelectorType.tag, selector: ["abbr"] },
      { type: SelectorType.tag, selector: ["table"] },
      { type: SelectorType.pseudo, selector: ["*"] },
      { type: SelectorType.pseudo, selector: [":root"] },
      { type: SelectorType.pseudo, selector: ["*::after"] },
      { type: SelectorType.pseudo, selector: ["::webkit-scroll-bar"] },
      { type: SelectorType.pseudo, selector: ["::webkit-scroll-bar-button"] },
    ];
    expect(selectorASTArr).toEqual<SelectorObject[]>(resultArr);
  });
});