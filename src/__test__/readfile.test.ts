import { getClassnames } from "../getClassnames";

test("Read File With wrong pattern", async () => {
    expect(await getClassnames("src/**/*.css")).toBeFalsy();
});

test("Read File from a test html file", async () => {
    const classFields = [
        "container",
        "container-div",
        "ul",
        "li",
        "form",
        "custom-input",
        "btn",
        "btn-success"
    ]
    expect(await getClassnames("src/__test__/index.test.html")).toEqual<string[]>(classFields)
})
