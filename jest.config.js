/**@type {import("@jest/types/build/Config").Argv} */
module.exports = {
    roots: [
        "<rootDir>/src"
    ],
    testMatch: [
        "**/__test__/?(*.)+(spec|test).+(ts|js)"
    ],
    transform: {
        "^.+\\.ts$": "ts-jest"
    }
}