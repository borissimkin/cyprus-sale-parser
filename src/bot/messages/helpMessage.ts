import {getUrlParsedChats} from "@/telegramClient/utils";

export const helpAddListeningWordMessage = "Чтобы отслеживать определенные категории сообщений, просто введите слово или слова через запятую.\n\n" +
    "*Например:* iphone, scooter, бесплатно, самокат, ноутбук, макбук, macbook, лимассол, бронь\n"

export const listOfAllowedCommands = "*Доступные команды:\n*/list - Показать список ваших отслеживаемых слов.\n" +
    "/help - Информация об использовании бота."

export const someAdditionalInfo = "*При вводе отслеживаемых слов регистр не учитывается.*"

export const feedbackMessage = "💬 Для обратной связи или сотрудничества пишите на почту *cyprus.sale.bot@gmail.com*"

export const chatsForParseMessage = () => {
    const urlParsedChats = getUrlParsedChats()
    if (!urlParsedChats) {
        return ""
    }
    const listToShow = urlParsedChats.map((chat) => `- ${chat}`).join("\n")
    return `🔗 *Чаты, которые отслеживаются:*\n${listToShow}`
}
