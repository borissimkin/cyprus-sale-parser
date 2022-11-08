import {Markup} from "telegraf";

export const getDeleteCatPhotoKeyboard = (fileName: string) => {
    return [
        Markup.button.callback(`Удалить фотку`, `del-cyprocat-${fileName}`),
    ]
}
