import {tinyCssClasses} from "@tiny-css/classes"

/**
 * @description Filters tiny-css classes by default. But can also filter any provided css 
 *              classObj.
 * @author KR Tirtho
 * @param {string[]} classnames
 * @param {object} [classObj=tinyCssClasses]
 * @return {*}  {string[]}
 */
export function filterWithClassnames(classnames: string[], classObj: object=tinyCssClasses):string[] {
    return classnames.filter(classname => Object.values(classObj).includes(classname));
}