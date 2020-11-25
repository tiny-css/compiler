/**
 * @description Filters tiny-css classes by default. But can also filter any provided css 
 *              classObj.
 * @author KR Tirtho
 * @param {string[]} classnames
 * @param {object} [globalClassnames=tinyCssClasses]
 * @return {*}  {string[]}
 */
export function filterWithClassnames(classnames: string[], globalClassnames: object | string[]): string[] {
    return classnames.filter(classname => (globalClassnames instanceof Object ? Object.values(globalClassnames) : globalClassnames).includes("."+classname));
}