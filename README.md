# Tiny CSS Compiler

The compiler for tiny-css. It optimizes & injects styles relative to classnames defined in the provided HTML files & only inserts them and not a byte more than them.

# Features

-   Lowers the weight of css bundle
-   Really good for SSR(Server Side Render) as it would output only css style declaration that are relative to classnames defined in the static HTML files
-   Removes unimportant style declarations from the output.css file. Very efficient for heavy css frameworks like [bootstrap](https://getbootstrap.com/) or [materialize](https://materializecss.com/) as it only keeps the necessary style declarations
- It not only works with [Tiny-CSS](https://github.com/tiny-css/tiny-css) but also with all kinds of css frameworks if the stylesheet defined classes are passed as an JSON files to `--classes` option and stylesheet with `--input` option

## Installation

**With npm**

```bash
npm install @tiny-css/compiler --save-dev
```

**With yarn**

```bash
yarn add @tiny-css/compiler --dev
```

## CLI-Options

| Options | alias | What it does                                                               | Default                                      |
| ------- | ----- | -------------------------------------------------------------------------- | -------------------------------------------- |
| input   | i     | The css file which will be used to retrieve css objects                    | [required]                                   |
| output  | o     | The file where css declarations will be outputted                          | ${cwd}/tiny.output.css                       |
| classes | c     | The path to the <json> file where all the default classnames are described | @tiny-css/classes -> tinyCssClasses [Object] |
| debug   | d     | Outputs verbose information about the currently running process            | false                                        |
| cwd     | N/A   | Custom current working directory                                           | process.cwd()                                |
| ignore  | N/A   | An array glob pattern to ignore the path for file searching                | \*\*/node_modules/\*\*/\*                    |

## Example

```bash
$ tiny-css ./**/*.html --input ./tiny.css
```
More examples can be found [here](example)

## Using with custom classnames & css file

Always a pass a path string of that `whatever-classnames.json` file to the cli `-c` OR `--classes` options

**Example:**

```bash
$ tiny-css ./**/*.html --input ./tiny.css --classes ./path/to/whatever-classnames.json
```

Structure of the custom `whatever-classnames.json` file should match like below:

```jsonc
// bootstrap v4.5
{
    "btnOutlinePrimary": "btn-outline-primary",
    "btnOutlineSecondary": "btn-outline-secondary",
    "textPrimary": "text-primary",
    "textSecondary": "text-secondary",
    "h3": "h3",
    "h1": "h1",
    "h2": "h2"
}
```

## Ignoring patters
An `--ignore` argument option can be passed to the cli to ignore any file/pattern

**Example**
```bash
$ tiny-css ./**/*.html --input ./tiny.css --ignore ./test/**,./node_modules/**
```

# Contributing

Follow the [Contribution guidelines](CONTRIBUTING.md)

# Tests

```bash
npm install
npm test
```

# LICENSE

[MIT](LICENSE)

## Social handlers:

-   [Facebook](https://facebook.com/krtirtho)
-   [Twitter](https://twitter.com/krtirtho)

Join the Discussion in [Discord](https://discord.com/channels/777928823605952564/779762462211178516)