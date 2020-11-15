import tinyFy from "./tinyfyRegex";


/* Classes which doesn't contains any number like display-flex or justify-content-center or float-left */
//% CSS Properties for Utility
const display = tinyFy("display", ["flex", "grid", "block", "inline"]) 
const justifyContentAndSelf = tinyFy("justify", ["content", "self"], ["center", "flex-start", "flex-end", "around", "between", "evenly", "start", "end", "stretch", "baseline"]);
const alignItemsAndSelf = tinyFy("align", ["items", "self"], ["center", "flex-start", "flex-end", "stretch", "baseline"]);
const alignContents = tinyFy("align-content", ["center", "start", "end", "around", "between", "evenly"])
const flexDirection = tinyFy("flex-direction", "((column|row)(-reverse)?)")
const flexWrapShrinkGrow = tinyFy("flex", "((no-)?(wrap|shrink|grow))")
const float = tinyFy("float", ["left", "right", "none"])
const position = tinyFy("position", ["absolute", "relative", "fixed", "static", "sticky"])
const cursor = tinyFy("cursor", ['pointer', 'not-allowed', 'grab', 'progress'])
const listStyle =tinyFy("list-style", ["square","circle","disc","none"])
const textDecoration = tinyFy("text-decoration", ["dashed", "dotted", "double", "line-through", "none", "solid", "underline", "wavy"])

export const staticUtility = new RegExp(`${display}|${justifyContentAndSelf}|${alignItemsAndSelf}|${alignContents}|${float}|${flexDirection}|${flexWrapShrinkGrow}|${position}|${cursor}|${listStyle}|${textDecoration}`, "i")

/* Classes which are mostly components */
const staticComponent = new RegExp(`^sta`, "i");

/* Classes which contains number, like: margin, padding, width, height */
const dynamicNumber= null;

/* Classes which contains color codes or color names, like: color, background-color, border-color */
const dynamicColor = null;