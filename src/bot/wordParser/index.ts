import {ListeningWord, toBlockedUser, User, UserRepository} from "@/database";
import {bot} from "@/bot";
import {NewMessageEvent} from "telegram/events";
import {getUrlParsedChat} from "@/telegramClient/utils";
import {Markup} from "telegraf";
import {getDeleteWordKeyboard} from "@/bot/keyboards/getDeleteWordKeyboard";
import {IsNull} from "typeorm";
import levenshtein from 'js-levenshtein';
import {loggerHandleError} from "@/logger";

// todo: оптимизировать алгоритм
// todo: не делать запросы при каждом хендле сообщения

type Message = {
    id: number,
    text?: string
}

const isHelloMessage = (message: string) => {
    return message.includes("Для удобного пользования группой ознакомьтесь")
}

export const handleMessageFromParsedChat = async (message: NewMessageEvent) => {
    const text = message.message.text
    if (!text || isHelloMessage(text)) {
        return
    }
    const userRepository = UserRepository()
    const users = await userRepository.find({where: {isBlocked: IsNull()}, relations: ['listeningWords']})
    const messageAsArray = text.split(" ")
    users.forEach((user) => {
        const listeningWords = user?.listeningWords ?? []
        for (const word of listeningWords) {
            const isMatchedMessage = isMatchedMessageAndReturnProcessedMessage(word.word, text, messageAsArray)
            if (isMatchedMessage) {
                sendMessageMatched(user, {id: message.message.id, text: isMatchedMessage}, word, text)
                return
            }
        }
    })
}

const sendMessageMatched = async (user: User, message: Message, word: ListeningWord, rawText: string) => {
    try {
        await bot.telegram.sendMessage(user.telegramId, createMatchedMessageText(word.word, message),
            {...Markup.inlineKeyboard(getDeleteWordKeyboard(word)), parse_mode: "HTML"})
    } catch (e) {
        if (e?.response?.error_code === 403) {
            await toBlockedUser(user)
        } else if (e?.response?.error_code === 400) {
            await bot.telegram.sendMessage(user.telegramId, createMatchedMessageText(word.word, {id: message.id, text: rawText}),
                {...Markup.inlineKeyboard(getDeleteWordKeyboard(word))})
        }
        else {
            loggerHandleError(e?.message || "Не удалось отправить sendMessageMatched")
        }
    }

}


const createMatchedMessageText = (word: string, message: Message) => {
    const baseText = `👀 ${word}\n\n🔗 ${getUrlToMessage(message.id)}\n`

    if (message.text) {
        return `${baseText}\n🗒 Описание:\n${message.text}`
    }
    return baseText
}

export const getUrlToMessage = (messageId: number) => {
    return `${getUrlParsedChat()}/${messageId}`
}

const percentOfLevenstein = 30

const getMaxLevenstein = (word: string) => {
    return Math.round(word.length / 100 * percentOfLevenstein)
}


export const isMatchedMessageAndReturnProcessedMessage = (word: string, message: string, messageAsArray: string[]) => {
    // const index = getIncludesIndex(word, messageAsArray)
    // const lengthLevenstein = getMaxLevenstein(word)
    // if (index !== -1) {
    //     return processMessageWithFindedWord(index, messageAsArray)
    // }
    const maxLevenstein = getMaxLevenstein(word)
    const temp = {
        isSmallestLevenstein: null,
        index: null
    }
    for (const [i, value] of messageAsArray.entries()) {
        const curLeven = levenshtein(word, value)
        if (curLeven === 0) {
            temp.index = i
            temp.isSmallestLevenstein = curLeven
            break
        }
        if (typeof temp.isSmallestLevenstein !== "number") {
            temp.index = i
            temp.isSmallestLevenstein = curLeven
        } else if (temp.isSmallestLevenstein > curLeven) {
            temp.index = i
            temp.isSmallestLevenstein = curLeven
        }
    }
    if (typeof temp.isSmallestLevenstein !== "number") {
        return false
    }
    if (temp.isSmallestLevenstein > maxLevenstein) {
        return false
    }
    return processMessageWithFindedWord(temp.index, messageAsArray)
    // return fuzzy.test(word, message) // , {caseSensitive: false, pre: '*', post: '*'}
}

const processMessageWithFindedWord = (indexFindedWord: number, messageAsArray: string[]) => {
    const array = [...messageAsArray]
    array[indexFindedWord] = `<b>${array[indexFindedWord]}</b>`
    return array.join(" ")
}

// const getIncludesIndex = (word: string, arrayWords: string[]) => {
//     return arrayWords.findIndex((item) => {
//         return item.indexOf(word) !== -1
//     })
// }
//

/**
 *
 * with includes
 * [Node] { a: -1 }
 * [Node] { a: 13 }
 * [Node] { a: 15 }
 * [Node] { a: 5 }
 * */

//
// export const TEST_THIS_SHIT = () => {
//     const TEST_MESSAGE = "в лимасол все спокойно, ходят айфоны туда сюда, а также прыгают чуваки на скутерах и самокатах"
//     const WORDS = ['лимассол', 'скутер', 'самокат', 'айфон']
//
//     WORDS.forEach((value) => {
//         const result = isMatchedMessageAndReturnProcessedMessage(value, TEST_MESSAGE, TEST_MESSAGE.split(" "))
//         console.log(result);
//     })
// }

