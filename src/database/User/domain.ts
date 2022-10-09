import {User, UserRepository} from "@/database";

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

export const toBlockedUser = async (user: User) => {
    const repository = UserRepository()
    user.isBlocked = true
    return repository.save(user)
}

export const toUnblockedUser = async (user: User) => {
    const repository = UserRepository()
    user.isBlocked = null
    return repository.save(user)
}
