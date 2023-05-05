import {getUrlParsedChats} from "@/telegramClient/utils";
import { getFeedbackAccountName } from '@/bot/utils/getAdminId'

export const helpAddListeningWordMessage = "Чтобы отслеживать определенные слова в сообщениях, просто введите слово или слова через запятую.\n\n" +
    "<b>Например:</b> iphone, scooter, бесплатно, самокат, ноутбук, макбук, macbook, лимассол, бронь\n"

export const listOfAllowedCommands = "<b>Доступные команды:\n</b>/list - Показать список ваших отслеживаемых слов.\n" +
    "/help - Информация об использовании бота.\n" +
    "/cat - Показать киприкота."

export const someAdditionalInfo = "<b>При вводе отслеживаемых слов регистр не учитывается.</b>"

export const feedbackMessage = `💬 Для обратной связи или сотрудничества пишите <b>${getFeedbackAccountName()}</b>`

export const dontBeatMeMessage = "🥺 Бот может ошибиться и прислать не что нужно, однако, так вы точно не пропустите нужный вам предмет "

export const chatsForParseMessage = () => {
    const urlParsedChats = getUrlParsedChats()
    if (!urlParsedChats) {
        return ""
    }
    const listToShow = urlParsedChats.map((chat) => `- ${chat}`).join("\n")
    return `🔗 <b>Чаты, которые отслеживаются:</b>\n${listToShow}`
}
