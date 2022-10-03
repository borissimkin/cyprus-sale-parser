import 'module-alias/register'
import "reflect-metadata"
import {startTelegramClientParser} from "@/telegramClient";
import {launchBot} from "@/bot";
import {initDatabase} from "@/database";

// todo: реализовать логику с блокировкой пользователя и его разблокировкой
initDatabase()
launchBot()
startTelegramClientParser()
