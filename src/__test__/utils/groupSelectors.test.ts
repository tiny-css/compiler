import { groupSelector, GroupSelectorObject } from "../../utils/groupSelectors";

describe(`${groupSelector.name} AST Object Test`, () => {
  it("Should output an array of `SelectorObject`", () => {
    const testSelectors:string[] = [".table th", "a:hover", "abbr table", ".btn .btn-primary .btn-hovered", ".what .why", "*", ":root ", "*::after", "::webkit-scroll-bar ::webkit-scroll-bar-button", "#dumb > .classes + marakha form"];
    const selectorASTArr = testSelectors.map(groupSelector);
    const resultArr: GroupSelectorObject[] = [
      {
        nested: true,
        type: "class",
        selector: ".table",
        child: {
          nested: false,
          type: "tag",
          selector: "th",
        },
      },
      {
        nested: false,
        type: "tag",
        selector: "a:hover",
      },
      {
        nested: true,
        type: "tag",
        selector: "abbr",
        child: {
          nested: false,
          type: "tag",
          selector: "table",
        },
      },
      {
        nested: true,
        type: "class",
        selector: ".btn",
        child: {
          nested: true,
          type: "class",
          selector: ".btn-primary",
          child: {
            nested: false,
            type: "class",
            selector: ".btn-hovered",
          },
        },
      },
      {
        nested: true,
        type: "class",
        selector: ".what",
        child: {
          nested: false,
          type: "class",
          selector: ".why",
        },
      },
      {
        nested: false,
        type: "pseudo",
        selector: "*",
      },
      {
        nested: false,
        type: "pseudo",
        selector: ":root",
      },
      {
        nested: false,
        type: "pseudo",
        selector: "*::after",
      },
      {
        nested: true,
        type: "pseudo",
        selector: "::webkit-scroll-bar",
        child: {
          nested: false,
          type: "pseudo",
          selector: "::webkit-scroll-bar-button",
        },
      },
      {
        nested: true,
        type: "id",
        selector: "#dumb",
        child: {
          nested: true,
          type: "class",
          selector: ".classes",
          child: {
            nested: true,
            type: "invalid",
            selector: "marakha",
            child: {
              nested: false,
              type: "tag",
              selector: "form",
            },
          },
        },
      },
    ];
    expect(selectorASTArr).toEqual<GroupSelectorObject[]>(resultArr);
  });
});