import css from "css";
import { join } from "path";

const tempDir = join(process.cwd(), "__dev_test_assets__", "bootstrap.css")

function buildCSSClassJSON(cssPath: string) {    
    const cssFile = css.parse(cssPath);
}