import {
    addUniqueListeningWords,
    createUserIfNotExist,
    ListeningWord,
    ListeningWordRepository,
    User,
    UserRepository
} from "@/database";


export const generateTestDb = async () => {
    let telegramId = 1

    const countUsers = 15000

    const users: User[] = []
    const listeningWords: ListeningWord[][] = []

    const words = ['лимассол', 'чайный гриб', 'iphone', 'macbook', 'макбук', 'одеяло', 'бесплатно', 'отдам даром', 'скутер', 'самокат']
    const userRepos = UserRepository()
    const wordsRepos = ListeningWordRepository()
    for (let i = 0; i <= countUsers; i++) {
        const user = userRepos.create({telegramId: telegramId})
        const listeningWords1 = wordsRepos.create(words.map((word) => {
            return {
                word,
                user
            }
        }))
        users.push(user)
        listeningWords.push(listeningWords1)
        // const user = await createUserIfNotExist(telegramId)
        // await addUniqueListeningWords(words, user)
        telegramId++
        console.log(i)
    }
    await userRepos.save(users)
    return listeningWords.map((words1) => wordsRepos.save(words1))

}
