import {User, UserRepository} from "@/database";
import fuzzy from "fuzzy"
import {bot} from "@/bot";
import {NewMessageEvent} from "telegram/events";
import {getUrlParsedChat} from "@/telegramClient/utils";

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
    // todo: isBlocked: false
    const users = await userRepository.find({relations: ['listeningWords']})
    users.forEach((user) => {
        const listeningWords = user?.listeningWords ?? []
        for (const word of listeningWords) {
            const isMatched = isMatchedMessage(word.word, text)
            if (isMatched) {
                sendMessageMatched(user, {id: message.message.id, text}, word.word)
                break
            }
        }
    })
}

const sendMessageMatched = (user: User, message: Message,  word: string) => {
    // todo: кнопка отписаться
    return bot.telegram.sendMessage(user.telegramId, createMatchedMessageText(word, message))
}


const createMatchedMessageText = (word: string, message: Message) => {
    const baseText = `👀${word}\n\n🔗${getUrlToMessage(message.id)}\n`

    if (message.text) {
        return `${baseText}\n🗒Описание:\n${message.text}`
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

