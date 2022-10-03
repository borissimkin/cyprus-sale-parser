import {Context} from "telegraf";

const message = "Тут хелп"

// todo: написать инструкцию
export const helpHandler = (ctx: Context) => {
    return ctx.reply(message)
}
