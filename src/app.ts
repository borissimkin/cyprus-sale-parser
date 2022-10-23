import 'module-alias/register'
import "reflect-metadata"
import {startTelegramClientParser} from "@/telegramClient";
import {launchBot} from "@/bot";
import {initDatabase} from "@/database";

initDatabase()
launchBot()
startTelegramClientParser()
