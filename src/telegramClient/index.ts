import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../../.env` })

import { TelegramClient } from "telegram";
import { StoreSession } from "telegram/sessions";
import input from "input";
import {NewMessage, NewMessageEvent} from "telegram/events";
import {handleMessageFromParsedChat} from "@/bot/wordParser";
import {getUrlParsedChats} from "@/telegramClient/utils";

const apiId = process.env.API_ID;
const apiHash = process.env.API_HASH;
const chatId = getUrlParsedChats()

const someBullshitSenderId: number[] = [1782503645]


if ([apiHash, apiId, chatId].some((x) =>!x)) {
    throw new Error("CHECK THE ENV!")
}

const stringSession = new StoreSession("test_session"); // fill this later with the value from session.save()

export const startTelegramClientParser = async () => {
    const client = new TelegramClient(stringSession, Number(apiId), apiHash, {
        connectionRetries: 5,
    });
    await client.start({
        phoneNumber: async () => await input.text("number ?"),
        password: async () => await input.text("password?"),
        phoneCode: async () => await input.text("Code ?"),
        onError: (err) => console.log(err),
    });
    client.session.save() // Save this string to avoid logging in again
    console.log("Telegram Client is running");

    async function handler(event: NewMessageEvent, urlChatId: string) {
        const senderId = event.message?.sender?.id
        if (senderId && someBullshitSenderId.includes(Number(senderId))) {
            return
        }
        return handleMessageFromParsedChat(event, urlChatId)
    }
    console.log(chatId)
    chatId.forEach((id) => {
        client.addEventHandler((event) => handler(event, id), new NewMessage({incoming: true, outgoing: true, chats: [id]}));
    })
}
