import {Context} from "telegraf";
import {
    chatsForParseMessage, dontBeatMeMessage,
    feedbackMessage,
    helpAddListeningWordMessage,
    listOfAllowedCommands,
    someAdditionalInfo,
} from '@/bot/messages/helpMessage'


export const helpHandler = (ctx: Context) => {
    return ctx.replyWithHTML(getHelpMessage(), {disable_web_page_preview: true })
}

export const getHelpMessage = () => {
    return `${helpAddListeningWordMessage}\n${someAdditionalInfo}\n\n${listOfAllowedCommands}\n\n${feedbackMessage}\n\n${dontBeatMeMessage}\n\n${chatsForParseMessage()}`
}
