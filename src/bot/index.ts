import {Telegraf} from "telegraf";
import {startHandler} from "@/bot/handlers/start";
import {helpHandler} from "@/bot/handlers/help";
import {addListeningWordsHandler} from "@/bot/handlers/addListeningWords";
import {listListeningWordHandler} from "@/bot/handlers/listListeningWord";
import {deleteListeningWordHandler} from "@/bot/handlers/deleteListeningWord";
import {getAdminId} from "@/bot/utils/getAdminId";

const token = process.env.BOT_TOKEN
const adminId = getAdminId()

if (!adminId) {
    throw new Error('ADMIN_ID must be provided!')
}

if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}
/**
 * команды:
 * - текст (добавить слова)
 * - /list список отслеживаемых слов
 * - /del_{id} - удалить слово
 *  /clear (этот функционал в кнопку /list) - Очистить весь список отслеживаемых слов (todo: добавить в колбек квери чтобы вернуть все отслеживаемые слова обратно)
 * **/

export const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(startHandler);
bot.help(helpHandler);
bot.command('list', listListeningWordHandler);
bot.hears(new RegExp('/delete_\\d+'), (ctx) => deleteListeningWordHandler(ctx, ctx.message.text))
bot.on('text', (ctx) => addListeningWordsHandler(ctx, ctx.message.text))

//todo: когда сообщение приходит с чата, там добавить кнопу инлайн чтобы перестать прослушивать (в шапке писать что за слово нашли)

/**
 * для обычного пользователя ограничения в 10 слов, и задержка?
 *
 * */
export const launchBot = () => {
    bot.launch().then(() => {
        console.info(`Bot ${bot.botInfo.username} is up and running`)
    })
}
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
