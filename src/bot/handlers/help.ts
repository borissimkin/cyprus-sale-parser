import {Context} from "telegraf";
import {
    chatsForParseMessage,
    feedbackMessage,
    helpAddListeningWordMessage,
    listOfAllowedCommands,
    someAdditionalInfo
} from "@/bot/messages/helpMessage";


export const helpHandler = (ctx: Context) => {
    return ctx.replyWithHTML(`${helpAddListeningWordMessage}\n${someAdditionalInfo}\n\n${listOfAllowedCommands}\n\n${feedbackMessage}\n\n${chatsForParseMessage()}`, {disable_web_page_preview: true })
}
