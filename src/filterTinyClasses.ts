import {tinyCssClasses} from "@tiny-css/classes"

export function filterTinyClassnames(classnames: string[], classObj: object=tinyCssClasses):string[] {
    return classnames.filter(classname => Object.values(tinyCssClasses).includes(classname));
}