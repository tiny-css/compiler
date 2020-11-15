#!/usr/bin/env node

/* readfile reads all the 'class="...."'  */
import {htmlClasses} from "../src/readfile"
/* matches the classes provided from readfile with classes available in tiny-css */
import {onlyTinyClasses} from "../src/match"
/* classes which needs to be matched with readfile classes */
import {staticUtility} from "../src/classes"
/* cssmatch matches all the available classes in the dest *.css file & keeps only those which aren't already there */
import {classesToWrite} from "../src/cssmatch"