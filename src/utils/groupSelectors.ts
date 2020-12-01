import { HTMLTagsRegexp } from "./htmltagsRegexp";

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

export function groupSelector(src:string[]): SelectorObject[] {
  const classSelectors = /\.(\w|\d|-|_)+/g;
  const idSelectors = /#(\w|\d|-|_)+/g;
  const selectorStore:SelectorObject[] = [];
  src.forEach((str) => {
    const classType: SelectorObject = {
      type: SelectorType.class,
      /* only returns any classes */
      selector: str.match(classSelectors)?.filter(Boolean) as string[],
    };
    const idType:SelectorObject = {
      type: SelectorType.id,
      selector: str.match(idSelectors)?.filter(Boolean) as string[],
    };
    const tagType: SelectorObject = {
      type: SelectorType.tag,
      selector: str.replace(classSelectors, "").replace(idSelectors, "").match(HTMLTagsRegexp),
    };
    selectorStore.push(classType, idType);
  });

  return [{
    selector: [""],
    type: SelectorType.class,
  }];
}