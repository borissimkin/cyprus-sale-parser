import {Context} from "telegraf";
import {createUserIfNotExist, findUserByTelegramId, toUnblockedUser} from "@/database";
import {newUserRegistrationHandler, unblockUserHandler} from "@/bot/handlers/newUserRegistrationHandler";
import {getHelpMessage} from "@/bot/handlers/help";

const startMessage = `🦾 <b>Бот помогает оперативно отслеживать нужные товары и услуги из чатов барахолок Кипра.</b>\n`

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
    return ctx.replyWithHTML(`${startMessage}\n${getHelpMessage()}`, {disable_web_page_preview: true })
}

