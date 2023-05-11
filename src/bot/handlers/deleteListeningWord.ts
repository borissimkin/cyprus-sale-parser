import {Context} from "telegraf";
import {Nullable} from "@/types";
import {wrapErrorMessage, wrapSuccessMessage} from "@/bot/messages/wrapMessages";
import {findUserByTelegramId, getListeningWord, removeListeningWord} from "@/database";
import {loggerHandleError} from "@/logger";
import {sendBaseErrorMessage} from "@/bot/messages/sendBaseErrorMessage";

export const deleteListeningWordHandler = async (ctx: Context, text: string) => {
    const id = getDeleteWordId(text)
    if (!id) {
        return sendErrorMessageInvalidId(ctx)
    }
    const user = await findUserByTelegramId(ctx.from.id)
    if (!user) {
        loggerHandleError(`Пытается удалить слово и не зарегался ${id}`)
        return
    }
    try {
        const listeningWord = await getListeningWord(user.id, id)
        if (!listeningWord) {
            return sendMessageListeningWordNotFound(ctx)
        }
        await removeListeningWord(listeningWord);
        await sendSuccessMessage(ctx, listeningWord.word)

    } catch (e) {
        loggerHandleError(`Не удалось удалить слово. id=${id} userId=${user.id}`)
        await sendBaseErrorMessage(ctx)
    }
}

const sendErrorMessageInvalidId = (ctx: Context) => {
    return ctx.reply(wrapErrorMessage("Невалидный id удаления слова"))
}

const sendMessageListeningWordNotFound = (ctx: Context) => {
    return ctx.reply(wrapErrorMessage("Слово с таким id не найдено"))
}

const getDeleteWordId = (command: string): Nullable<number> => {
    const [_, id] = command.split("_")
    try {
        return parseInt(id)
    } catch (e) {
        return null
    }
}

const sendSuccessMessage = (ctx: Context, word: string) => {
    return ctx.reply(wrapSuccessMessage(`Вы перестали отслеживать слово *${word}*`), {parse_mode: "Markdown"})
}
