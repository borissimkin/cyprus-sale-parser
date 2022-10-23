import {Context} from "telegraf";
import {
    chatsForParseMessage,
    feedbackMessage,
    helpAddListeningWordMessage,
    listOfAllowedCommands,
    someAdditionalInfo
} from "@/bot/messages/helpMessage";


export const helpHandler = (ctx: Context) => {
    return ctx.reply(`${helpAddListeningWordMessage}\n${someAdditionalInfo}\n\n${listOfAllowedCommands}\n\n${feedbackMessage}\n\n${chatsForParseMessage()}`, {parse_mode: "Markdown"})
}
