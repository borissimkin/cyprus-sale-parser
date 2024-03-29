import { Markup, Scenes, session, Telegraf } from 'telegraf'
import {startHandler} from "@/bot/handlers/start";
import {helpHandler} from "@/bot/handlers/help";
import {addListeningWordsHandler} from "@/bot/handlers/addListeningWords";
import {listListeningWordHandler} from "@/bot/handlers/listListeningWord";
import {deleteListeningWordHandler} from "@/bot/handlers/deleteListeningWord";
import {getAdminId} from "@/bot/utils/getAdminId";
import {errorMessageCallbackQuery} from "@/bot/messages/errorMessage";
import {
    addUniqueListeningWords, findUserAndUpdateTelegramInfo,
    findUserByTelegramId,
    getListeningWordById,
    removeListeningListWords,
    removeListeningWord, updateActivityUser,
} from '@/database'
import {wrapErrorMessage, wrapSuccessMessage} from "@/bot/messages/wrapMessages";
import {getUniqueWords} from "@/bot/utils/getUniqueWordsUser";
import {filterWordsByLimitAllows} from "@/bot/utils/limitListenningWords";
import {listeningWordsLimitExceededMessage} from "@/bot/messages/listeningWordsLimitExceededMessage";
import {LIMIT_LISTENING_WORDS_USER} from "@/bot/constants";
import {getRestoreWordKeyboard} from "@/bot/keyboards/getRestoreWordKeyboard";
import {loggerHandleError} from "@/logger";
import {getDeleteWordKeyboard} from "@/bot/keyboards/getDeleteWordKeyboard";
import {
    createListListeningWords,
    createListListeningWordWithoutDeleteCommand
} from "@/bot/utils/createListListeningWords";
import {
    getConfirmDeleteListWordsKeyboard,
    getDeleteListWordsKeyboard
} from "@/bot/keyboards/getDeleteListWordsKeyboard";
import {isAdmin, sendDatabaseFileHandler} from "@/bot/handlers/sendDatabaseFile";
import {
    deletePhotoInCatDirectory, getFullPathToCatImage,
    getRandomCatPhotoFileName,
    getRandomCatPhotoHandler,
    saveCatPhotoHandler
} from "@/bot/handlers/catsHandlers";
import path from "path";
import {getShowMoreCatPhotoKeyboard} from "@/bot/keyboards/getShowMoreCatPhotoKeyboard";
import {sendMessageAdminSomeCatGod} from "@/bot/utils/sendMessageAdminSomeCatGod";
import { advertiseScene, advertiseSceneId } from '@/bot/advertisement/handlers'

const token = process.env.BOT_TOKEN
const adminId = getAdminId()

if (!adminId) {
    throw new Error('ADMIN_ID must be provided!')
}

if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

export const bot = new Telegraf(process.env.BOT_TOKEN)

// @ts-ignore
const stage = new Scenes.Stage([advertiseScene]);

bot.use(session());
bot.use(stage.middleware());
// @ts-ignore
stage.register(advertiseScene);

bot.use(async (ctx, next) => {
    findUserAndUpdateTelegramInfo(ctx.from.id, ctx.from)
    updateActivityUser(ctx.from.id)
    return next() // runs next middleware
})

bot.start(startHandler);
bot.help(helpHandler);
bot.command("advert", (ctx) => {
    if (!isAdmin(ctx.from.id)) {
        return loggerHandleError(`/advert restricted userId=${ctx.from.id}`)
    }
    // @ts-ignore
    ctx.scene.enter(advertiseSceneId)
})
bot.command('list', listListeningWordHandler);
bot.command("database", sendDatabaseFileHandler);
bot.command("cat", getRandomCatPhotoHandler)
bot.hears(new RegExp('/delete_\\d+'), (ctx) => deleteListeningWordHandler(ctx, ctx.message.text))
bot.on('text', (ctx) => addListeningWordsHandler(ctx, ctx.message.text))

bot.on("photo", (ctx) => {
    saveCatPhotoHandler(ctx, ctx.message.photo)
})

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

bot.action(/^delete-(\d+)$/, async (ctx) => {
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

bot.action(/^del-cyprocat-(.*?)$/, async (ctx) => {
    if (!isAdmin(ctx.from.id)) {
        return
    }
    const id = ctx.match[1]
    try {
        await deletePhotoInCatDirectory(id)
        ctx.editMessageReplyMarkup(undefined)
        return ctx.answerCbQuery(wrapSuccessMessage(`Изображение удалено`))
    } catch (e) {
        return ctx.answerCbQuery(wrapErrorMessage(`Не удалось удалить изображение`))
    }
})

bot.action(/^show-more-cats-(\d+)$/, async (ctx) => {
    const count = ctx.match[1]
    const fileName = await getRandomCatPhotoFileName()
    if (!fileName) {
        ctx.editMessageReplyMarkup(undefined)
        return ctx.answerCbQuery("Больше нет фотографий киприкотов 🥺")
    }
    const nextCount = Number(count) + 1
    try {
        await ctx.editMessageMedia({ type: "photo", media: {source: path.resolve(getFullPathToCatImage(fileName))} },
            {...Markup.inlineKeyboard(getShowMoreCatPhotoKeyboard(nextCount)) })
    } catch (e) {
        await ctx.reply("Произошла какая-то ошибка, киприкота не будет 😭")
        ctx.editMessageReplyMarkup(undefined)
    }
    try {
        return sendMessageAdminSomeCatGod(nextCount, ctx)
    } catch (e) {
        loggerHandleError("Не удалось отправить сообщение котофила")
    }
})

bot.action(/^list-delete-confirm-yes$/, async (ctx) => {
    const telegramId = ctx.from.id
    const user = await findUserByTelegramId(telegramId)
    if (!user) {
        return
    }
    const words = user.listeningWords
    if (!words.length) {
        return ctx.editMessageText("У вас нет отслеживаемых слов 🤨")
    }
    try {
        const removedWords = await removeListeningListWords(words)
        const listText = createListListeningWordWithoutDeleteCommand(removedWords)
        ctx.editMessageText(`Вы удалили слова (${removedWords.length}):\n${listText}`)
        return ctx.answerCbQuery(wrapSuccessMessage(`Вы очистили весь список слов`))
    } catch (e) {
        return ctx.answerCbQuery(errorMessageCallbackQuery)
    }
})

bot.action(/^list-delete-confirm-no$/, async (ctx) => {
    const telegramId = ctx.from.id
    const user = await findUserByTelegramId(telegramId)
    if (!user) {
        return
    }
    const words = user.listeningWords
    if (!words.length) {
        return ctx.editMessageText("У вас нет отслеживаемых слов 🤨")
    }
    const message = `Список отслеживаемых слов (${words.length}):\n${createListListeningWords(words)}`
    await ctx.editMessageText(message)
    await  ctx.editMessageReplyMarkup({inline_keyboard: [getDeleteListWordsKeyboard()]})
})

bot.action(/^list-delete$/, async (ctx) => {
    const telegramId = ctx.from.id
    const user = await findUserByTelegramId(telegramId)
    if (!user) {
        return
    }
    const words = user.listeningWords
    if (!words.length) {
        return ctx.editMessageText("У вас нет отслеживаемых слов 🤨")
    }
    const listText = createListListeningWordWithoutDeleteCommand(words)
    await ctx.editMessageText(`Вы уверены, что хотите очистить весь список слов (${words.length})?:\n${listText}`)
    await ctx.editMessageReplyMarkup({inline_keyboard: [getConfirmDeleteListWordsKeyboard()]})
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
