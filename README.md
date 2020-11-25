# Tiny CSS Compiler

The compiler for tiny-css. It optimizes & injects styles relative to classnames defined in the provided HTML files & only inserts them and not a byte more than them.

# Features

-   Lowers the weight of css bundle
-   Really good for SSR(Server Side Render) as it would output only css style declaration that are relative to classnames defined in the static HTML files
-   Removes unimportant style declarations from the output.css file. Very efficient for heavy css frameworks like [bootstrap](https://getbootstrap.com/) or [materialize](https://materializecss.com/) as it only keeps the necessary style declarations
-   It not only works with [Tiny-CSS](https://github.com/tiny-css/tiny-css) but also with all kinds of css frameworks if the stylesheet defined classes are passed as an JSON files to `--classes` option and stylesheet with `--input` option

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

| Options       | alias | What it does                                                                                                                                                                             | Default                   |
| ------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| input         | i     | CSS Input file which will be used to retrieve style objects. This can be a fs path or a cdm link                                                                                         | [required]                |
| cdn-version   | c     |The version of the cdn input file. Important if `--disable-cache` option is disabled & files are cached. This is used to determine the cache file location. Not required if using fs path | 0.0.1                     |
| output        | o     | The file where css declarations will be outputted                                                                                                                                        | ${cwd}/tiny.output.css    |
| debug         | d     | Outputs verbose information about the currently running process                                                                                                                          | false                     |
| cwd           | N/A   | Custom current working directory                                                                                                                                                         | process.cwd()             |
| ignore        | N/A   | An array glob pattern to ignore the path for file searching                                                                                                                              | \*\*/node_modules/\*\*/\* |
| disable-cache | N/A   | Disable caching stylesheets                                                                                                                                                              | false                     |

## Example

```bash
$ tiny-css ./**/*.html --input ./tiny.css
```
More examples can be found [here](example)

## Usage

If using a `CDN` link always a pass a version of that css file defined in the URL to the cli  `-c` OR `--cdn-version` option.

**Example:**

```bash
$ tiny-css ./**/*.html --input https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css --cdn-version 4.5.2
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