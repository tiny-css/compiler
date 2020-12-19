import { HtmlTags } from "./htmltagsRegexp";

export const sudoAttrSelectorRegex = /(:[:]?|\[).*\]?/g;

export enum SelectorType{
  class = "class",
  id = "id",
  tag = "tag",
  pseudo = "pseudo",
  invalid = "invalid",
}

export interface GroupSelectorObject{
  nested: boolean,
  type: "class"|"id"|"pseudo"|"tag"|"invalid",
  selector: string,
  child?: GroupSelectorObject
}

export const nestOpRegex = />|\+|~/g;
export const classSelectors = /\.(\w|\d|-|_)+/g;
export const idSelectors = /#(\w|\d|-|_)+/g;
export const pseudoSelectorRegex = /^:{1,2}(\w|\d|-|\(|\))+$/;
export const globSelectorRegex = /\*(:{1,2}(\w|\d|\(|\)|-))?/g;

/**
 * returns the correct type of a selector for given string
 * @author KR Tirtho
 * @param {string} str single selector string
 * @return {*}  {SelectorType}
 * @example
 * decide(".btn"); // would return "class"
 */
function decideType(str: string):SelectorType {
  const strWithOutPseudo = str.replace(sudoAttrSelectorRegex, "");
  const type = {
    type: SelectorType.invalid,
  };
  if (idSelectors.test(strWithOutPseudo)) {
    type.type = SelectorType.id;
    /**
       * for Jvascript's weird closure RegExp.test doesn't
       * work in function currying so used new RegExp(regex.source, flags)
       */
  } else if (new RegExp(classSelectors.source, "g").test(strWithOutPseudo)) {
    type.type = SelectorType.class;
  } else if (globSelectorRegex.test(str) || pseudoSelectorRegex.test(str)) {
    type.type = SelectorType.pseudo;
  } else if (HtmlTags.split("|").includes(strWithOutPseudo)) {
    type.type = SelectorType.tag;
  }
  return type.type;
}

/**
 * recursively creates CSS selector relations Object
 * @author KR Tirtho
 * @param {string} src css selector string
 * @return {*}  {GroupSelectorObject}
 * @example
 * groupSelector(.class + div > button); //would return
 {
   nested: true,
    type: "class"
    selector: ".class",
    child: {
      nested: true,
      type: "tag",
      selector: "div",
      child: {
        nested: false,
        type: "tag", selector: "button"
      },
    },
  },
 */
export function groupSelector(src: string): GroupSelectorObject {
  const srcArr = src.replace(nestOpRegex, " ").split(" ").filter(Boolean);
  const returns: GroupSelectorObject = {
    nested: false,
    type: SelectorType.invalid,
    selector: "",
  };
  for (const selector of srcArr) {
    if (srcArr.length === 1) {
      returns.type = decideType(selector);
      returns.nested = false;
      returns.selector = selector;
    } else if (srcArr.length > 1 && srcArr.indexOf(selector) === 0) {
      returns.type = decideType(selector);
      returns.nested = true;
      returns.selector = selector;
      // CAUTION: Uses recursion
      returns.child = groupSelector(srcArr.slice(1).join(">"));
    }
  }
  return returns;
}