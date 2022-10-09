import {Context} from "telegraf";
import {getAdminId} from "@/bot/utils/getAdminId";
import {loggerHandleError} from "@/logger";

// если не удалось отправить то и ничего страшного =)
export const newUserRegistrationHandler = (ctx: Context) => {
    try {
        const telegramUser = ctx.from
        const name = getUserName(telegramUser)
        const adminId = getAdminId()
        return ctx.telegram.sendMessage(adminId, getTextNewUser(name))
    } catch {
        loggerHandleError("Не удалось отправить сообщение о новом зарегистрированном пользователе")
    }
}

export const unblockUserHandler = (ctx: Context) => {
    try {
        const telegramUser = ctx.from
        const name = getUserName(telegramUser)
        const adminId = getAdminId()
        return ctx.telegram.sendMessage(adminId, getTextUnblockedUser(name))
    } catch {
        loggerHandleError("Не удалось отправить сообщение о разблокированном пользователе")
    }
}

const getTextNewUser = (name: string | number) => {
    return `👤 Зарегистировался новый пользователь🥺 - ${name}`
}

const getTextUnblockedUser = (name: string | number) => {
    return `😁 Пользователь ${name} вернулся в родную гавань.`
}

const getUserName = (user: Context['from']) => {
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ")
    if (name) {
        return name
    }
    if (user.username) {
        return user.username
    }
    return user.id
}
