
const infoMessages: string[] = [
    "Для удобного пользования группой ознакомьтесь",
    "ознакомьтесь с правилами во избежание ограничений",
    "Подобные ФОРУМЫ / чаты у нас по",
    "нужно указывать цену,город, краткое описание. Если отдаете, указывайте, что"
].map((info) => info.toLowerCase())

export const isSomeNotImportantMessage = (text: string) => {
    const textLowerCase = text.toLowerCase()
    return infoMessages.some((infoMessage) => {
        return textLowerCase.includes(infoMessage)
    })
}
