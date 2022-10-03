import {UserRepository} from "@/database";

export const findUserByTelegramId = (telegramId: number) => {
    return UserRepository().findOne({where: {telegramId}, relations: ['listeningWords']})
}


export const createUserIfNotExist = async (telegramId: number) => {
    const repository = UserRepository()
    const user = await findUserByTelegramId(telegramId)
    if (user) {
        return user
    }
    const newUser = repository.create({telegramId: telegramId})
    await repository.save(newUser)
    return newUser
}
