
const infoMessages: string[] = [
    "Для удобного пользования группой ознакомьтесь",
    "ознакомьтесь с правилами во избежание ограничений",
    "Подобные ФОРУМЫ / чаты у нас по",
    "нужно указывать цену,город, краткое описание. Если отдаете, указывайте, что",
    "Прочитайте правила закреплённые сверху",
    "За не соблюдение правил бан",
    "you were banned",
    "cyprusnarco",
    "narcocyprus",
    "cyprusnarko",
    "narkocyprus"
].map((info) => info.toLowerCase())

export const isSomeNotImportantMessage = (text: string) => {
    const textLowerCase = text.toLowerCase()
    return infoMessages.some((infoMessage) => {
        return textLowerCase.includes(infoMessage)
    })
}
