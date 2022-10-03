import {Context} from "telegraf";
import {createUserIfNotExist, findUserByTelegramId} from "@/database";
import {newUserRegistrationHandler} from "@/bot/handlers/newUserRegistrationHandler";

const message = "Тут инструкция че делать и все команды"
//todo: написать инструкцию
export const startHandler = async (ctx: Context) => {
    const telegramId = ctx.from.id
    if (await findUserByTelegramId(telegramId)) {
        newUserRegistrationHandler(ctx)
    }
    await createUserIfNotExist(telegramId)
    return ctx.reply(message)
}

