import {User} from "@/database";
import {LIMIT_LISTENING_WORDS_USER} from "@/bot/constants";

export const isLimitWordsExceeded = (user: User, words: string[]) => {
    const currentListeningWords = user?.listeningWords ?? []
    return currentListeningWords.length + words.length > LIMIT_LISTENING_WORDS_USER
}

export const getLeftCountWordsBeforeLimitExceeded = (user: User, words: string[]) => {
    const currentListeningWords = user?.listeningWords ?? []
    return LIMIT_LISTENING_WORDS_USER - currentListeningWords.length
}

export const filterWordsByLimitAllows = (user: User, words: string[]) => {
    const leftAddWords = getLeftCountWordsBeforeLimitExceeded(user, words)
    return words.slice(0, leftAddWords)
}
