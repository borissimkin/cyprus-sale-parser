import {Context} from "telegraf";
import {getUserName} from "@/bot/handlers/newUserRegistrationHandler";
import {getAdminId} from "@/bot/utils/getAdminId";

const getMessage = (count: number, from: Context['from']) => {
    return `🤯 ${getUserName(from)} нажимает показать больше киприкотов уже ${count} раз!`
}

export const sendMessageAdminSomeCatGod = (count: number, ctx: Context) => {
    const from = ctx.from
    const messages = {
        3: getMessage(count, from),
        5: getMessage(count, from),
        10: getMessage(count, from),
        15: getMessage(count, from)
    }
    const message = messages[count]
    if (!message) {
        return
    }
    return ctx.telegram.sendMessage(getAdminId(), message)
}
