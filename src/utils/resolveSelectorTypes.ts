import {
  classSelectors,
  idSelectors,
  SelectorType,
  sudoAttrSelectorRegex,
  nestOpRegex,
  globSelectorRegex,
  pseudoSelectorRegex,
} from "./groupSelectors";
import { HtmlTags } from "./htmltagsRegexp";

export interface SelectorObject {
  type: SelectorType,
  selector: string[]
}

const isTruthyArray = (array: unknown[]): boolean => !!(array && array.length);

export function arrayedSet<T>(arr:T[]):T[] {
  return Array.from(new Set(arr));
}

const uniqueIfy = (arr:SelectorObject[], type: SelectorObject["type"]): SelectorObject[] => arrayedSet(arr
  .filter(
    (selectorObj) => selectorObj.type === SelectorType[type],
  )
  .map((selectorObj) => selectorObj.selector)
  .flat(1))
  .map((selector) => ({ type: SelectorType[type], selector: [selector] }));

/**
 * it's the lighter version of `groupSelector` which doesn't
 * resolve selector relation resolution.
 * Also it takes multiple selector string & it can return selector types with unique selectors
 * @author KR Tirtho
 * @param {string[]} src array of selector strings
 * @param {{ unique: boolean }} [opts={ unique: true }] default {unique: true}
 * @return {*}  {SelectorObject[]}
 */
export function resolveSelectorTypes(src: string[],
  opts: { unique: boolean } = { unique: true }): SelectorObject[] {
  const selectorStore: SelectorObject[] = [];
  src.forEach((str) => {
    const classType: SelectorObject = {
      type: SelectorType.class,
      /* only returns any classes */
      selector: arrayedSet(str.match(classSelectors)?.filter(Boolean) as string[]),
    };
    const idType: SelectorObject = {
      type: SelectorType.id,
      //returns all id selectors
      selector: arrayedSet(str.match(idSelectors)?.filter(Boolean) as string[]),
    };

    const onlyTags = str.replace(classSelectors, "class").replace(idSelectors, "id").replace(sudoAttrSelectorRegex, "").replace(nestOpRegex, " ")
      .split(" ");

    const tagType: SelectorObject = {
      type: SelectorType.tag,
      selector: arrayedSet(onlyTags
        .filter((tag) => HtmlTags.split("|").includes(tag))),
    };
    const pseudoType: SelectorObject = {
      type: SelectorType.pseudo,
      selector: arrayedSet(str.replace(nestOpRegex, " ").split(" ").filter((selector) => {
        const isMatch = pseudoSelectorRegex.test(selector);
        const isGlobMatch = globSelectorRegex.test(selector);
        return isMatch || isGlobMatch;
      })),
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
  if (!opts.unique) {
    return selectorStore;
  }
  const uniqueClasses = uniqueIfy(selectorStore, SelectorType.class);
  const uniqueIds = uniqueIfy(selectorStore, SelectorType.id);
  const uniqueTags = uniqueIfy(selectorStore, SelectorType.tag);
  const uniquePseudos = uniqueIfy(selectorStore, SelectorType.pseudo);

  return [...uniqueClasses, ...uniqueIds, ...uniqueTags, ...uniquePseudos];
}