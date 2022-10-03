import {Context} from "telegraf";
import {wrapErrorMessage} from "@/bot/messages/wrapMessages";

export const sendBaseErrorMessage = (ctx: Context) => {
    return ctx.reply(wrapErrorMessage("Произошла ошибка."))
}
