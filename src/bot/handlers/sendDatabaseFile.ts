import {Context} from "telegraf";
import {getAdminId} from "@/bot/utils/getAdminId";
import {loggerHandleError} from "@/logger";


export const sendDatabaseFileHandler = async (ctx: Context) => {
    const telegramId = ctx.from.id
    if (!isAdmin(telegramId)) {
        return loggerHandleError(`/database restricted userId=${telegramId}`)
    }
    try {
        await ctx.replyWithDocument({source: "src/database.sqlite"})
    } catch (e) {
        ctx.reply("Произошла ошибка")
    }
}

export const isAdmin = (telegramId: number) => {
    const adminId = getAdminId()
    return Number(adminId) === Number(telegramId)
}
