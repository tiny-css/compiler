import {
  Rule, Media, StyleRules, Stylesheet,
} from "css";
import { ASTTypes } from "./utils/ASTTypes";
import {
  groupSelector, GroupSelectorObject, SelectorType, sudoAttrSelectorRegex,
} from "./utils/groupSelectors";

const getSelectorRecursively = (selectorAST: GroupSelectorObject):string[] => {
  if (selectorAST.type === SelectorType.class) {
    if (!selectorAST.nested) {
      return [selectorAST.selector];
    }
    if (selectorAST.nested && selectorAST.child?.type === SelectorType.class) {
      const classes = [selectorAST.selector].concat(getSelectorRecursively(selectorAST.child));
      return classes;
    }
  }
  return [];
};

function getASTRules(rule: Rule, classes: string[]): Rule | void {
  if (!rule.selectors) {
    return undefined;
  }
  const selectorASTArr = rule.selectors.map(groupSelector);
  const matchedSelector = selectorASTArr.filter((selectorAST) => {
    if (selectorAST.type === SelectorType.tag || selectorAST.type === SelectorType.pseudo) {
      return true;
    }
    // const isValidClass = getSelectorRecursively(selectorAST).filter((selector) => {
    //   const selectorPseudo = selector.match(sudoAttrSelectorRegex)?.join("");
    //   const classesWithSelectorPseudo = classes.map((_class) => `.${_class}${selectorPseudo}`);
    //   return classesWithSelectorPseudo.includes(selector);
    // });
    const isValidClass = classes.map((_class) => `.${_class}`).some((_class) => {
      const selectorClasses = getSelectorRecursively(selectorAST).map((selector) => selector.replace(sudoAttrSelectorRegex, ""));
      return selectorClasses.includes(_class);
    });
    return isValidClass;
  });
  if (matchedSelector?.length !== 0) {
    return rule;
  }
}

/**
 * returns `cssObject`. Doesn't check for availability in output css file.
 * `writeCssFile` function finishes the final check. This function only
 * returns
 *              objects that lazily includes the css .{class} for that.
 * @author KR Tirtho
 * @param {string} stylesheetObj the file that includes all the css style declarations as string.
 * @param {string[]} classes all the classes that needs to be matched with css selectors
 * @returns {css.Rule} Rule
 */
export function getCssObjects(
  stylesheetObj: Stylesheet,
  classes: string[],
): StyleRules["rules"] | false {
  const cssObjects: StyleRules["rules"] = [];

  stylesheetObj.stylesheet?.rules.forEach((rule) => {
    /**
         * Checks if the rule.type is `rule` and filters CSSObject based on that
         */
    if (rule.type === ASTTypes.rule) {
      const availableRules = getASTRules(rule, classes);
      if (availableRules) {
        cssObjects.push(availableRules);
      }
    } else if (rule.type === ASTTypes.media) {
      /**
             * rule.type of media is same but nested so checking it and the above is same just
             * execute the same logic same above to get the best output
             */
      const { rules: mediaRules } = rule as Media;
      const mediaRuleStore: Media[] = [];

      mediaRules?.forEach((mediaRule) => {
        const availableMediaRules = getASTRules(mediaRule, classes);
        if (availableMediaRules) {
          mediaRuleStore.push(availableMediaRules);
        }
      });
      if (mediaRuleStore.length !== 0) {
        cssObjects.push({ ...rule, rules: mediaRuleStore });
      }
    }
    /**
         * TODO: @Keyframes recognition & return them relatively
         * TODO: @CustomMedia recognition
         */
  });
  return cssObjects ?? false;
}
