import {User, UserRepository} from "@/database";
import {loggerHandleError} from "@/logger";
import { TelegramUserInfo } from '@/types/TelegramUserInfo'

export const USER_BASE_LIMIT = 6 // 100

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

export const getUnblockedUsers = () => {
    const rep = UserRepository()

    return rep.find({where: {isBlocked: null}})
}

export const updateActivityUser = async (telegramId: number) => {
    try {
        const user = await findUserByTelegramId(telegramId)
        if (!user) {
            return
        }
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
