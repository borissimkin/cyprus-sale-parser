import {isMatchedMessage} from "@/wordParser";

const KEYWORDS_FROM_DB = ['scooter', 'ЛиМассол', 'самокат', 'айфон', "iphone"]

export const parseMessage = (message: string): void => {
    const isMatched = isMatchedMessage(message, KEYWORDS_FROM_DB)
}
