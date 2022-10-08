import {Markup} from "telegraf";

export const getDeleteListWordsKeyboard = () => {
    return [
        Markup.button.callback(`🗑 Очистить весь список слов`, `list-delete`),
    ]
}

export const getConfirmDeleteListWordsKeyboard = () => {
    return [
        Markup.button.callback('Да', 'list-delete-confirm-yes'),
        Markup.button.callback('Нет', 'list-delete-confirm-no')
    ]
}
