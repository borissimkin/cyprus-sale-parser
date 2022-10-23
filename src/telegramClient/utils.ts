import {uniq} from "lodash"

export const getUrlParsedChats = (): string[] | undefined => {
    const chats = process.env.CHAT_ID_FOR_PARSE
    if (!chats) {
        return
    }
    return uniq(chats.split(","))
}
