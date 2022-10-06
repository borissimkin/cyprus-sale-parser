import {errorOperationEmoji, successOperationEmoji} from "@/bot/messages/emojis";

const addEmojiToText = (text: string, emoji: string): string => {
    return text ? `${emoji} ${text}` : text
}

export const wrapSuccessMessage = (text: string): string => {
    return addEmojiToText(text, successOperationEmoji)
}

export const wrapErrorMessage = (text: string): string => {
    return addEmojiToText(text, errorOperationEmoji)
}
