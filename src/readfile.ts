import fs from "fs";
import { inputFilePath } from "./file.io"; //! For production
import chalk from "chalk";

//! For Development
const filepath = "./dist/test.html"

/** What I have to do
 * First It needs to be out of whitespace...No whitespace will be outside <...>...</...>
 * Caution DO NOT REMOVE New lines. As if the classnames are written like "damn\n" (\n represents new line) then it will not recognize the classname inside the "class=\"....\""
 * Remove any forward slashes "/" for </...>
 * Remove the Angles "<>" Left and Right one from there
 * *map through the available contents & test it with matchClassRegex or any unique one
 * Take out the class names out of the 'class="...."'
 * Then match it with the matchClassRequiredClassNamesRegex
 * Then write the styles based on class found out there from InputFile to a CSS(Output) File
 */

/* For Now using Node.Js FileSystem Module. Later be used process.cwt() module for better path & input */
const inputFile = fs.readFileSync(filepath, {encoding: "utf8"})


/* Regex for matching classes */
const matchClassRegex = /class=(\"|\').+?(\"|\')/gi

// Ignoring Comments
const ignoreCommentRegex = /<!--.*?-->/gi

const noCommentFile = inputFile.split(ignoreCommentRegex).join('');

// removing white space.
const whiteSpaceSplitter = noCommentFile.split(/\s/g)

// Store for the only valid values
let store1 = [];
// A loop for removing empty strings from the found array of chars
for(const i of whiteSpaceSplitter){
    if(i!==''){
        store1.push(i);
    }
}

// Joining the array which doesn't contain any sort of \n\r\t etc only a space after on another
const minifiedString = store1.join(" ")

// remove closing tag
const noClosingTag = minifiedString.split(/<\/.+?>/gi).join('')

const getOnlyTags = noClosingTag?.match(/<.+?>/gi)?.join('');

/* Using the Regular Expression Defined above, getting out the classes from that fields */
const getMatchedClasses = getOnlyTags?.match(matchClassRegex)

/**
 * Now it selects all the classes inside <> (angles)
 * TODO: Have to take out all the class from them. it works even where we input anything
  */

// Joining the found Array getMatchedClasses for  next Regex Operation 
const noClassInsideDomJoin = getMatchedClasses?.join(" ")  

// Regex for Selecting all the classes from found element & this doesn't contains class inside the DOM
const takeOutClassRegex = /class=["||'].*?["||']/gi

// Matching and taking out the classes only from the angle brackets
const htmlClasses = noClassInsideDomJoin?.match(takeOutClassRegex)

console.log(chalk.bgWhite.hex("#000")(" Total HTML Classes ➡ ", chalk.bold.keyword("orangered")(htmlClasses?.length+" ")))

export {htmlClasses}