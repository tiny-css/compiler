import { join } from "path";
import { buildCSSClass } from "../buildCSSClass";

describe("Building CSS class Test", () => {
    const globalConfig = { disabledCache: true, version: "0.0.1" };
    const cwd = process.cwd()
    it("Should return an Array of classnames by using & caching bootstrap cdn", async () => {
        const cssProps = await buildCSSClass("https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css", globalConfig);
        expect(cssProps.classnames).toBeInstanceOf(Array);
    })

    it("Should deep equal an Array of classnames that are defined in input CSS file", async () => {
        const cssProps = await buildCSSClass(join(cwd, "__test_assets__", "getCSSObject.test.css"), globalConfig)
        const classList = [
            ".col",
            ".navbar",
            ".container",
            ".container-fluid",
            ".container-sm",
            ".container-md",
            ".container-lg",
            ".container-xl",
            ".col-xs-11"
        ]
        expect(cssProps.classnames).toEqual(classList)
    })
})