import {Markup} from "telegraf";
import {getShowMoreCatQuery} from "@/bot/constants/showMoreCatQuery";

const titles: string[] = [
    "Показать еще киприкота",
    "И еще киприкота",
    "Еще?",
    "Киприкотов много не бывает, еще?",
    "Следующего",
    "Показать еще киприкота",
    "Может хватит?",
    "Пора остановиться",
    "Началсь киприкота-зависимость 🤨",
    "Больше киприкотов!",
    "Еще больше киприкотов!",
    "Еще больше КИПРИКОТОВ!!",
]

const getLastElement = <T>(arr: Array<T>) => {
    return arr[arr.length - 1]
}

export const getShowMoreCatPhotoKeyboard = (count: number) => {
    const title = count >= titles.length ? getLastElement(titles) : titles[count]
    return [
        Markup.button.callback(title, getShowMoreCatQuery(count)),
    ]
}
