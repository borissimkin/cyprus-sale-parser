import {groupArrayByCountWords} from "./groupArrayBuCountWords";

describe("wordParser", () => {
    it("count words is more than length array", () => {
        expect(groupArrayByCountWords(3, ['test2', 'test1'])).toStrictEqual(["test2 test1"])
    })

    it("count words is less than length array", () => {
        expect(groupArrayByCountWords(2, ['test2', 'test1', 'test3'])).toStrictEqual(["test2 test1", "test3"])
    })
})
