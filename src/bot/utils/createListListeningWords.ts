import {ListeningWord} from "@/database";

export const createListListeningWords = (listeningWords: ListeningWord[]) => {
    return listeningWords.map((listeningWord) => {
        return `- ${listeningWord.word} (${createDeleteListeningWordCommand(listeningWord)})\n`
    }).join("")
}

// todo: переделать, надо чтоб айди не светить
export const createDeleteListeningWordCommand = (listeningWord: ListeningWord) => {
    return `/delete_${listeningWord.id}`
}


export const createListListeningWordWithoutDeleteCommand = (listeningWords: ListeningWord[]) => {
    return listeningWords.map((listeningWord) => {
        return `- ${listeningWord.word}\n`
    }).join("")
}
