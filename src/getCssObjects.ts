import css, { Rule, Media, StyleRules } from "css";

export enum ASTTypes {
    rule = "rule",
    comment = "comment",
    media = "media",
    charset = "charset",
    customMedia = "custom-media",
    document = "document",
    fontFace = "font-face",
    host = "host",
    import = "import",
    keyframes = "keyframes",
    keyframe = "keyframe",
    namespace = "namespace",
    supports = "supports",
    declaration = "declaration",
}

function getASTRules(rule: Rule, classes: string[]): Rule | void {
    /**
     * clears css sudo/attribute (e.g. ::before/[type="text"]) selectors regexp
     */
    const repX = /(:[:]?|\[).*\]?/g;
    const selectors = (rule as Rule).selectors
        ?.map((selector) => {
            /**
             * replaces css sudo/attribute (e.g. ::before/[type="text"])
             *  selectors with ""
             */
            return selector.replace(repX, "");
        })
        .join(",")
        .replace(/\s?\+\s?|\s?\>\s?/g, ",")
        .split(" ")
        .join(",");
    const matchedSelector = selectors?.split(",").filter((selector) => {
        /* Remove anything before .class (e.g. a.text-primary -> text-primary) */
        const wordyClass = selector.replace(/[^,].*\./, "").replace(".", "")
        return classes.includes(wordyClass);
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
 * @param {string} cssFile the file that includes all the css style declarations as string.
 * @param {string[]} classes all the classes that needs to be matched with css selectors
 * @returns {css.Rule} Rule
 */
export function getCssObjects(
    cssFile: string,
    classes: string[]
): StyleRules["rules"] | false {
    const stylesheetObj = css.parse(cssFile);
    const cssObjects: StyleRules["rules"] = [];

    stylesheetObj.stylesheet?.rules.forEach((rule) => {
        /**
         * Checks if the rule.type is `rule` and filters CSSObject based on that
         */
        if (rule.type === ASTTypes.rule) {
            const availableRules = getASTRules(rule, classes);
            availableRules && cssObjects.push(availableRules);
        } else if (rule.type === ASTTypes.media) {
            /**
             * rule.type of media is same but nested so checking it and the above is same just
             * execute the same logic same above to get the best output
             */
            const { rules: mediaRules } = rule as Media;
            const mediaRuleStore: Media[] = [];

            mediaRules?.forEach((mediaRule) => {
                const availableMediaRules = getASTRules(mediaRule, classes);
                availableMediaRules && mediaRuleStore.push(availableMediaRules);
            });
            mediaRuleStore.length !== 0 &&
                cssObjects.push({ ...rule, rules: mediaRuleStore });
        }
        /**
         * TODO: @Keyframes recognition & return them relatively
         * TODO: @CustomMedia recognition
         */
        
    });
    return cssObjects ?? false;
}
