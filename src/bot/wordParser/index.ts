import {ListeningWord, toBlockedUser, User, UserRepository} from "@/database";
import fuzzy from "fuzzy"
import {bot} from "@/bot";
import {NewMessageEvent} from "telegram/events";
import {getUrlParsedChat} from "@/telegramClient/utils";
import {Markup} from "telegraf";
import {getDeleteWordKeyboard} from "@/bot/keyboards/getDeleteWordKeyboard";
import {IsNull} from "typeorm";

// todo: оптимизировать алгоритм
// todo: не делать запросы при каждом хендле сообщения

type Message = {
    id: number,
    text?: string
}

export const handleMessageFromParsedChat = async (message: NewMessageEvent) => {
    const text = message.message.text
    if (!text) {
        return
    }
    const userRepository = UserRepository()
    const users = await userRepository.find({where: {isBlocked: IsNull()}, relations: ['listeningWords']})
    users.forEach((user) => {
        const listeningWords = user?.listeningWords ?? []
        for (const word of listeningWords) {
            const isMatched = isMatchedMessage(word.word, text)
            if (isMatched) {
                sendMessageMatched(user, {id: message.message.id, text}, word)
                break
            }
        }
    })
}

const sendMessageMatched = async (user: User, message: Message, word: ListeningWord) => {
    try {
        await bot.telegram.sendMessage(user.telegramId, createMatchedMessageText(word.word, message),
            {...Markup.inlineKeyboard(getDeleteWordKeyboard(word))})
    } catch (e) {
        if (e?.response?.error_code === 403) {
            await toBlockedUser(user)
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


export const isMatchedMessage = (word: string, message: string) => {
    return fuzzy.test(word, message) // , {caseSensitive: false, pre: '*', post: '*'}
}

// export const TEST_THIS_SHIT = () => {
//     const TEST_MESSAGE = "в лимасол все спокойно, ходят айфоны туда сюда, а также прыгают чуваки на скутерах и самокатах"
//     const WORDS = ['лимассол', 'скутер', 'самокат', 'айфон']
//
//     WORDS.forEach((value) => {
//         isMatchedMessage(value, TEST_MESSAGE)
//     })
// }

