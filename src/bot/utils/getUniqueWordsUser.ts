import {User} from "@/database";
import {keyBy} from "lodash";

export const getUniqueWords = (user: User, words: string[]) => {
    const userListeningWords = user.listeningWords ?? []
    const userWords = userListeningWords.map((x) => x.word)
    const keyedWords = getKeyedWords(userWords)
    return words.filter((word) => !keyedWords[word])
}


const getKeyedWords = (words: string[]) => {
    return keyBy(words)
}
