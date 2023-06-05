import {Context, Markup} from "telegraf";
import {isAdmin} from "@/bot/handlers/sendDatabaseFile";
import axios from "axios";
import fs, {unlink} from "fs";
import {PhotoSize} from "typegram/message";
import {getDeleteCatPhotoKeyboard} from "@/bot/keyboards/getDeleteCatPhotoKeyboard";
import {uuid} from "uuidv4";
import {getShowMoreCatPhotoKeyboard} from "@/bot/keyboards/getShowMoreCatPhotoKeyboard";
import path from "path";

const catsDirectory = "src/cat_assets"

export const saveCatPhotoHandler = async (ctx: Context, photos: PhotoSize[]) => {
    if (!isAdmin(ctx.from.id)) {
        return
    }
    if (!fs.existsSync(catsDirectory)){
        fs.mkdirSync(catsDirectory);
    }
    const maxSize = Math.max(...photos.map((photo) => photo.file_size))
    const maxSizedPhoto = photos.find((photo) => photo.file_size >= maxSize)
    const link = await ctx.telegram.getFileLink(maxSizedPhoto.file_id)
    try {
        const response = await axios({url: link.href, responseType: "stream"});
        const fileName = `${uuid()}.jpg`
        response.data.pipe(
            fs.createWriteStream(getFullPathToCatImage(fileName)),
        ).on('finish', async () => {
            try {
                await ctx.replyWithPhoto({source: getFullPathToCatImage(fileName)}, {...Markup.inlineKeyboard(getDeleteCatPhotoKeyboard(fileName)) })
                await ctx.reply("Фото киприкота загружено", {disable_notification: true})
            } catch (e) {
                console.log(e)
                await ctx.reply("Что то пошло не так на этапе отправки сообщения с фоткой", {disable_notification: true})
            }
        }).on('error', () => {
            return ctx.reply("Не удалось сохранить изображение")
        })
    } catch (e) {
        return ctx.reply("Общая ощибка")
    }
}

const getFilesInCatsDirectory = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(catsDirectory, (error, files) => {
            error ? reject(error) : resolve(files);
        });
    });
}

export const getRandomCatPhotoFileName = async (): Promise<string | null> => {
    const files = await getFilesInCatsDirectory() as Array<string>

    if (!files.length) {
        return null
    }
    return files[Math.floor(Math.random() * files.length)];
}

export const getFullPathToCatImage = (fileName: string): string => {
    return `${catsDirectory}/${fileName}`
}

export const getRandomCatPhotoHandler = async (ctx: Context) => {
    const fileName = await getRandomCatPhotoFileName()
    if (!fileName) {
        return ctx.reply("Еще нет фотографий киприкотов 🥺")
    }
    try {
        await ctx.replyWithPhoto({source: getFullPathToCatImage(fileName)}, {...Markup.inlineKeyboard(getShowMoreCatPhotoKeyboard(0)) })
    } catch (e) {
        await ctx.reply("Произошла какая-то ошибка, киприкота не будет 😭")
    }
}

export const deletePhotoInCatDirectory = (fileName: string) => {
    return new Promise((resolve, reject) => {
        unlink(`${catsDirectory}/${fileName}`, (err,) => {
            if (err) {
                return reject(err)
            }
            resolve(true)
        });
    });
}
