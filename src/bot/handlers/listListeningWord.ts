import {Context, Markup} from "telegraf";
import {findUserByTelegramId} from "@/database";
import {wrapErrorMessage} from "@/bot/messages/wrapMessages";
import {unauthorizedAccessMessage} from "@/bot/messages/errorMessage";
import {createListListeningWords} from "@/bot/utils/createListListeningWords";
import {helpAddListeningWordMessage} from "@/bot/messages/helpMessage";
import {getDeleteListWordsKeyboard} from "@/bot/keyboards/getDeleteListWordsKeyboard";

export const listListeningWordHandler = async (ctx: Context) => {
    const userId = ctx.from.id
    const user = await findUserByTelegramId(userId)
    if (!user) {
        return wrapErrorMessage(unauthorizedAccessMessage)
    }
    const listeningWords = user.listeningWords
    if (!listeningWords.length) {
        const message = "🫤 У вас еще нет отслеживаемых слов.\n\n"
        return ctx.reply(`${message}${helpAddListeningWordMessage}`, {parse_mode: "Markdown"})
    }
    const message = `Список отслеживаемых слов (${listeningWords.length}):\n${createListListeningWords(listeningWords)}`
    return ctx.reply(message, {...Markup.inlineKeyboard(getDeleteListWordsKeyboard())})
}
