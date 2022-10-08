import {ListeningWord} from "@/database";
import {Markup} from "telegraf";

/**
 * массив слов который был застрингифаен
 * */
export const getRestoreWordsKeyboard = (stringedArrayWords: string) => {
    return [[Markup.button.callback(`♻️ Вернуть список слов`, `list-restore-${stringedArrayWords}`)]]
}
