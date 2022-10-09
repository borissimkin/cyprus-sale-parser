import {Context} from "telegraf";
import {createUserIfNotExist, findUserByTelegramId} from "@/database";
import {newUserRegistrationHandler} from "@/bot/handlers/newUserRegistrationHandler";
import {getChatLinkForParse} from "@/bot/utils/getChatLinkForParse";
import {helpAddListeningWordMessage, listOfAllowedCommands} from "@/bot/messages/helpMessage";

const startMessage = `🦾 Бот помогает оперативно отслеживать нужные товары и услуги из чата [CypRus Барахолка](${getChatLinkForParse()}).\n
${helpAddListeningWordMessage}
${listOfAllowedCommands}`

//todo: написать инструкцию
export const startHandler = async (ctx: Context) => {
    const telegramId = ctx.from.id
    if (!await findUserByTelegramId(telegramId)) {
        newUserRegistrationHandler(ctx)
    }
    await createUserIfNotExist(telegramId)
    return ctx.reply(startMessage, {parse_mode: "Markdown"})
}

