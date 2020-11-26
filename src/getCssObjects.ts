import {
  Rule, Media, StyleRules, Stylesheet,
} from "css";
import { ASTTypes } from "./utils/ASTTypes";
import { HTMLTagsRegexp } from "./utils/htmltagsRegexp";

function getASTRules(rule: Rule, classes: string[]): Rule | void {
  /**
     * clears css sudo/attribute (e.g. ::before/[type="text"]) selectors regexp
     */
  const repX = /(:[:]?|\[).*\]?/g;
  const ignoreRootRegexp = /:root|\*+:+.*/g;
  const selectors = rule.selectors
    ?.map((selector) => {
      /**
             * replaces css sudo/attribute (e.g. ::before/[type="text"])
             * selectors with ""
             */
      /* ignores the :root global var space & also *:before or *::(sudo-selector) */
      if (ignoreRootRegexp.test(selector)) {
        return selector;
      }
      return selector.replace(repX, "");
    })
    .join(",")
    .replace(/\s+\+\s+|\s+>\s+/g, ",") //replaces "+" & ">" with ","
    .split(" ")
    .join(",");
  const matchedSelector = selectors?.split(",").filter((selector) => {
    /* ignoring global :root and *:(sudo-selectors) */
    const unwantedCssSelectorsRegex = /:(?=([^"'\\]*(\\.|["']([^"'\\]*\\.)*[^"'\\]*['"]))*[^"']*$)/g; //removes any attribute/sudo selector
    const wordyClass = selector
      .split(unwantedCssSelectorsRegex)
      .join("")
      .trim();
    if (!wordyClass.startsWith(".") || !wordyClass.includes(".")) {
      if (/:root|\*+:*.*/g.test(selector)) {
        return true;
      }
      return HTMLTagsRegexp.test(wordyClass);
    }
    return classes.map((_class) => `.${_class}`).includes(wordyClass);
  });
  if (matchedSelector?.length !== 0) {
    return rule;
  }
}

/**
 * @description returns `cssObject`. Doesn't check for availability in output css file.
 *              `writeCssFile` function finishes the final check. This function only returns
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
