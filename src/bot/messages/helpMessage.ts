import {getUrlParsedChats} from "@/telegramClient/utils";

export const helpAddListeningWordMessage = "Чтобы отслеживать определенные категории сообщений, просто введите слово или слова через запятую.\n\n" +
    "<b>Например:</b> iphone, scooter, бесплатно, самокат, ноутбук, макбук, macbook, лимассол, бронь\n"

export const listOfAllowedCommands = "<b>Доступные команды:\n</b>/list - Показать список ваших отслеживаемых слов.\n" +
    "/help - Информация об использовании бота."

export const someAdditionalInfo = "<b>При вводе отслеживаемых слов регистр не учитывается.</b>"

export const feedbackMessage = "💬 Для обратной связи или сотрудничества пишите на почту <b>cyprus.sale.bot@gmail.com</b>"

export const chatsForParseMessage = () => {
    const urlParsedChats = getUrlParsedChats()
    if (!urlParsedChats) {
        return ""
    }
    const listToShow = urlParsedChats.map((chat) => `- ${chat}`).join("\n")
    return `🔗 <b>Чаты, которые отслеживаются:</b>\n${listToShow}`
}
