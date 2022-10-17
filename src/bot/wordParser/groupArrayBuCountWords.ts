import lodash from "lodash";

export const groupArrayByCountWords = (countWord: number, arrayWords: string[], separator = " "): string[] => {
    const chunkedArray = lodash.chunk(arrayWords, countWord)
    return chunkedArray.map((arr) => arr.join(separator))
}
