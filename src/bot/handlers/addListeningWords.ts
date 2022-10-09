import {Context} from "telegraf";
import _ from "lodash"
import {addUniqueListeningWords, findUserByTelegramId, ListeningWord, User} from "@/database";
import {loggerHandleError} from "@/logger";
import {errorMessage} from "@/bot/messages/errorMessage";
import { wrapSuccessMessage } from "@/bot/messages/wrapMessages";
import {createListListeningWords} from "@/bot/utils/createListListeningWords";
import {getUniqueWords} from "@/bot/utils/getUniqueWordsUser";
import {filterWordsByLimitAllows} from "@/bot/utils/limitListenningWords";
import {listeningWordsLimitExceededMessage} from "@/bot/messages/listeningWordsLimitExceededMessage";
import {LIMIT_LISTENING_WORDS_USER} from "@/bot/constants";

const regex = RegExp(/^[a-z0-9а-яёЁА-ЯA-Z -]+$/i)
const maxLengthWord = 50

const getWordsFromMessage = (text: string, separator = ",") => {
    return _.uniq(text.toLowerCase().split(separator).map((word) => word.trim()))
}

const sanitizeWord = (word: string): boolean => {
    return regex.test(word)
}
/**
 *
 * */
const addListeningWordsToDatabase = async (ctx: Context, text: string, user: User):  Promise<ListeningWord[] | undefined> => {
    const words = getWordsFromMessage(text)
    const sanitizedWords = words.filter(sanitizeWord).filter((word) => word.length <= maxLengthWord).filter(Boolean)
    if (!sanitizedWords.length) {
        await ctx.reply(`Неправильный ввод. Разрешены только буквы и цифры и слова не больше ${maxLengthWord} символов 🤓`)
        return
    }
    const uniqueWords = getUniqueWords(user, words)
    if (!uniqueWords.length) {
        await ctx.reply("🤨 Вы ввели слова, которые вы уже отслеживаете.")
        return
    }
    const allowedByLimitWords = filterWordsByLimitAllows(user, uniqueWords)
    if (!allowedByLimitWords.length) {
        await ctx.reply(listeningWordsLimitExceededMessage(LIMIT_LISTENING_WORDS_USER), {parse_mode: "Markdown"})
        return
    }
    return addUniqueListeningWords(allowedByLimitWords, user)
}

export const addListeningWordsHandler = async (ctx: Context, text: string) => {
    const telegramId = ctx.from.id
    const user = await findUserByTelegramId(telegramId)
    if (!user) {
        loggerHandleError(`Не найден пользователь ${telegramId}`)
        return
    }
    try {
        const addedWords = await addListeningWordsToDatabase(ctx, text, user)
        if (!addedWords?.length) {
            return
        }
        const message = successMessage(addedWords)
        return ctx.reply(message)
    } catch {
        return ctx.reply(errorMessage)
    }
}

const successMessage = (words: ListeningWord[]) => {
    const listWords = createListListeningWords(words)
    return wrapSuccessMessage(`Вы добавили новые слова (${words.length}):\n${listWords}`)
}
