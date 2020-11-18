import { getCssObjects } from "src/getCssObjects"

describe("CSS Object Test", () => {
    it("should out an array of css AST objects", () => {
        const cssObj:any = [

        ]
        
        expect(getCssObjects()).toEqual(cssObj)
    })
})