import {Markup} from "telegraf";
import {ListeningWord} from "@/database";

export const getRestoreWordKeyboard = (listeningWord: ListeningWord) => {
    return [[Markup.button.callback(`♻️ Снова отслеживать ${listeningWord.word}`, `restore-${listeningWord.word}`)]]
}
