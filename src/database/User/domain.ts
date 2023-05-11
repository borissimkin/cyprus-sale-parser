import {User, UserRepository} from "@/database";
import {loggerHandleError} from "@/logger";
import { TelegramUserInfo } from '@/types/TelegramUserInfo'

export const USER_BASE_LIMIT = 100

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

export const findUserAndUpdateTelegramInfo = async (telegramId: number, telegramUserInfo: TelegramUserInfo) => {
    try {
        const user = await findUserByTelegramId(telegramId)
        if (!user) {
            return
        }
        await updateUserTelegramInfo(user, telegramUserInfo)
    } catch (e) {
        loggerHandleError(e)
    }
}

export const updateUserTelegramInfo = async (user: User, telegramUser: TelegramUserInfo) => {
    try {
        const rep = UserRepository()

        user.isTelegramPremium = telegramUser.is_premium
        user.username = telegramUser.username
        user.firstName = telegramUser.first_name
        user.lastName = telegramUser.last_name
        user.languageCode = telegramUser.language_code

        await rep.save(user)
    } catch (e) {
        loggerHandleError("Не удалось обновить TelegramInfo пользователя")
    }
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
