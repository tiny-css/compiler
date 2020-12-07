import { HtmlTags } from "./htmltagsRegexp";
import { sudoAttrSelectorRegex } from "../getCssObjects";

export enum SelectorType{
  class = "class",
  id = "id",
  tag = "tag",
  pseudo = "pseudo",
}

export interface SelectorObject{
  type: SelectorType,
  selector: string[]
}

const isTruthyArray = (array: unknown[]): boolean => array && array.length !== 0;

/**
 * @description checks selectors string array & returns an selector AST object with types
 * @author KR Tirtho
 * @param {string[]} src array of selectors
 * @return {*}  {SelectorObject[]}
 */
export function groupSelector(src:string[]): SelectorObject[] {
  const classSelectors = /\.(\w|\d|-|_)+/g;
  const idSelectors = /#(\w|\d|-|_)+/g;
  const pseudoSelectorRegex = /^:{1,2}(\w|\d|-|\(|\))+$/;
  const nestOpRegex = />|\+|~/g;
  const globSelectorRegex = /\*(:{1,2}(\w|\d|\(|\)|-))?/g;
  const selectorStore:SelectorObject[] = [];
  src.forEach((str) => {
    const classType: SelectorObject = {
      type: SelectorType.class,
      /* only returns any classes */
      selector: str.match(classSelectors)?.filter(Boolean) as string[],
    };
    const idType:SelectorObject = {
      type: SelectorType.id,
      selector: str.match(idSelectors)?.filter(Boolean) as string[], //returns all id selectors
    };
    const tagType: SelectorObject = {
      type: SelectorType.tag,
      selector: str.replace(classSelectors, "").replace(idSelectors, "").replace(sudoAttrSelectorRegex, "").replace(nestOpRegex, " ")
        .split(" ")
        .filter((tag) => HtmlTags.split("|").includes(tag)),
    };
    const pseudoType: SelectorObject = {
      type: SelectorType.pseudo,
      selector: str.replace(nestOpRegex, " ").split(" ").filter((selector) => {
        const isMatch = pseudoSelectorRegex.test(selector);
        const isGlobMatch = globSelectorRegex.test(selector);
        return isMatch || isGlobMatch;
      }),
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isTruthyArray(classType.selector) && selectorStore.push(classType);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isTruthyArray(idType.selector) && selectorStore.push(idType);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isTruthyArray(tagType.selector) && selectorStore.push(tagType);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isTruthyArray(pseudoType.selector) && selectorStore.push(pseudoType);
  });

  return selectorStore;
}