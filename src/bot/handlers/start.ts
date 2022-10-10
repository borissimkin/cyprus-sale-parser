import {Context} from "telegraf";
import {createUserIfNotExist, findUserByTelegramId, toUnblockedUser} from "@/database";
import {newUserRegistrationHandler, unblockUserHandler} from "@/bot/handlers/newUserRegistrationHandler";
import {getChatLinkForParse} from "@/bot/utils/getChatLinkForParse";
import {helpAddListeningWordMessage, listOfAllowedCommands} from "@/bot/messages/helpMessage";

const startMessage = `🦾 Бот помогает оперативно отслеживать нужные товары и услуги из чата [CypRus Барахолка](${getChatLinkForParse()}).\n
${helpAddListeningWordMessage}
${listOfAllowedCommands}`

export const startHandler = async (ctx: Context) => {
    const telegramId = ctx.from.id
    const user = await findUserByTelegramId(telegramId)
    if (!user) {
        newUserRegistrationHandler(ctx)
        await createUserIfNotExist(telegramId)
    } else {
        if (user.isBlocked) {
            await toUnblockedUser(user)
            unblockUserHandler(ctx)
        }
    }
    return ctx.reply(startMessage, {parse_mode: "Markdown"})
}

