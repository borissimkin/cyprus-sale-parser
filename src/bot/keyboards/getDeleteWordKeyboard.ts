import {Markup} from "telegraf";
import {ListeningWord} from "@/database";

export const getDeleteWordKeyboard = (word: ListeningWord) => {
    return [
        Markup.button.callback(`🗑Перестать отслеживать ${word.word}`, `delete-${word.id}`),
    ]
}
