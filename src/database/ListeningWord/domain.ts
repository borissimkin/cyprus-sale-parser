import {ListeningWord, ListeningWordRepository, User} from "@/database";

export const addUniqueListeningWords = async (words: string[], user: User) => {
    const newListeningWords: Partial<ListeningWord>[] = words.map((word) => {
        return {
            word,
            user
        }
    })
    const repo = ListeningWordRepository()
    const listeningWords = repo.create(newListeningWords)
    return repo.save(listeningWords)
}

export const getListeningWord = async (userId: number, listeningWordId: number) => {
    const repo = ListeningWordRepository()
    return repo.findOne({where: { id: listeningWordId, userId: userId }})
}

export const removeListeningWord = async (listeningWord: ListeningWord) => {
    const repo = ListeningWordRepository()
    return repo.remove(listeningWord)
}
