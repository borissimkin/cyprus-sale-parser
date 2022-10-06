import {Telegraf} from "telegraf";
import {startHandler} from "@/bot/handlers/start";
import {helpHandler} from "@/bot/handlers/help";
import {addListeningWordsHandler} from "@/bot/handlers/addListeningWords";
import {listListeningWordHandler} from "@/bot/handlers/listListeningWord";
import {deleteListeningWordHandler} from "@/bot/handlers/deleteListeningWord";
import {getAdminId} from "@/bot/utils/getAdminId";
import {errorMessageCallbackQuery} from "@/bot/messages/errorMessage";
import {addUniqueListeningWords, findUserByTelegramId, getListeningWordById, removeListeningWord} from "@/database";
import {wrapErrorMessage, wrapSuccessMessage} from "@/bot/messages/wrapMessages";
import {getUniqueWords} from "@/bot/utils/getUniqueWordsUser";
import {filterWordsByLimitAllows} from "@/bot/utils/limitListenningWords";
import {listeningWordsLimitExceededMessage} from "@/bot/messages/listeningWordsLimitExceededMessage";
import {LIMIT_LISTENING_WORDS_USER} from "@/bot/constants";
import {getRestoreWordKeyboard} from "@/bot/keyboards/getRestoreWordKeyboard";
import {loggerHandleError} from "@/logger";
import {getDeleteWordKeyboard} from "@/bot/keyboards/getDeleteWordKeyboard";

const token = process.env.BOT_TOKEN
const adminId = getAdminId()

if (!adminId) {
    throw new Error('ADMIN_ID must be provided!')
}

if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}
//todo: убрать id из команды удаления
/**
 * команды:
 * - текст (добавить слова)
 * - /list список отслеживаемых слов
 * - /del_{id} - удалить слово
 *  /clear (этот функционал в кнопку /list) - Очистить весь список отслеживаемых слов (todo: добавить в колбек квери
 *  чтобы вернуть все отслеживаемые слова обратно)
 * **/

export const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(startHandler);
bot.help(helpHandler);
bot.command('list', listListeningWordHandler);
bot.hears(new RegExp('/delete_\\d+'), (ctx) => deleteListeningWordHandler(ctx, ctx.message.text))
bot.on('text', (ctx) => addListeningWordsHandler(ctx, ctx.message.text))


bot.action(/^restore-(.*?)$/, async (ctx) => {
    const matchedWord = ctx.match[1]
    if (!matchedWord) {
        return
    }
    const telegramId = ctx.from.id
    const user = await findUserByTelegramId(telegramId)
    if (!user) {
        return
    }
    const uniqueWords = getUniqueWords(user, [matchedWord])
    if (!uniqueWords.length) {
        return ctx.answerCbQuery(`🧐 Вы уже отслеживаете слово ${matchedWord}!`)
    }
    const allowedByLimitWords = filterWordsByLimitAllows(user, uniqueWords)
    if (!allowedByLimitWords.length) {
        return ctx.answerCbQuery(wrapErrorMessage(listeningWordsLimitExceededMessage(LIMIT_LISTENING_WORDS_USER)))
    }
    try {
        const word = await addUniqueListeningWords(allowedByLimitWords, user)
        ctx.answerCbQuery(`😎 Вы снова отслеживаете слово ${matchedWord}!`)
        return ctx.editMessageReplyMarkup({inline_keyboard: [getDeleteWordKeyboard(word[0])]})
    } catch {
        loggerHandleError(`Не удалось снова отслеживать слово ${matchedWord} у пользователя ${telegramId}`)
    }
})

bot.action(/^delete-(\d+)$/, async(ctx) => {
    const id = ctx.match[1]
    if (!id) {
        return ctx.answerCbQuery(errorMessageCallbackQuery)
    }
    const listeningWord = await getListeningWordById(Number(id))
    if (!listeningWord) {
        return ctx.answerCbQuery(errorMessageCallbackQuery)
    }
    try {
        await removeListeningWord(listeningWord)
        ctx.editMessageReplyMarkup({inline_keyboard: getRestoreWordKeyboard(listeningWord)});
        return ctx.answerCbQuery(wrapSuccessMessage(`Вы перестали отслеживать ${listeningWord.word}`))

    } catch (e) {
        return ctx.answerCbQuery(errorMessageCallbackQuery)
    }
})

/**
 * для обычного пользователя ограничения в 10 слов, и задержка?
 *
 * */
export const launchBot = () => {
    bot.launch().then(() => {
        console.info(`Bot ${bot.botInfo.username} is up and running`)
    })
}
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
