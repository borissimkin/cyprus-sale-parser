import {User, UserRepository} from "@/database";
import {loggerHandleError} from "@/logger";

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

export const updateActivityUser = async (telegramId: number) => {
    try {
        const user = await findUserByTelegramId(telegramId)
        await updateUpdatedAt(user)
    } catch (e) {
        loggerHandleError("Не удалось обновить updatedAt пользователя")
    }
}

export const updateUpdatedAt = async (user: User) => {
    const repository = UserRepository()
    user.updatedAt = new Date()
    return repository.save(user)
}
