// @ts-nocheck
import { Context, Markup, Scenes } from 'telegraf'
import lodash, { cloneDeep } from 'lodash'
import { getUnblockedUsers, toBlockedUser, USER_BASE_LIMIT, UserRepository } from '@/database'
import { loggerHandleError } from '@/logger'
import { splitToChunks } from '@/helpers'
import { In, IsNull } from 'typeorm'

export const advertiseSceneId = "ADVERTISE_SCENE_ID"

export const advertiseSceneMessages = {
  cancel: "Отмена",
  confirm: "ДА ОТПРАВЛЯЙ",
}

const isCancel = (text: string) => {
  return text === advertiseSceneMessages.cancel
}

const handleCancel = async (ctx: Context) => {
  await ctx.scene.leave()

  return ctx.reply("Отменяю!")
}

/**
 * команда /advert
 * Заходит в диалог, и ожидает сообщение - в диалоге кнопка "Отмена"  для выхода
 * После отправки сообщения, идет уточнение нужно ли добавлять кнопки (Кнопки диалога: Да, нет, отмена)
 * Если нет, то пересылаем это же сообщение и текст Подтвердите отправку данного рекламного сообщения (ПОДТВЕРДИТЬ, Отмена)
 * Если да, то Текст (напишите текст кнопки в формате: [[{text: "awdawd", link: "https:/awdawd/"}]]
 * Если кнопки правильного формата, то переходим в состоние подтверждения отправки
 * Если неправильного то остаемся там же.
 *
 * Когда идет процесс отправки сообщения, отправляем сообщение "Рекламное сообщение отправляется: 1 из n пользователей" (изменять его через каждые N (100) пользователей),
 * По окончанию изменить его на "Рекламное сообщение отправлено успешно"
 * **/

const cancelButton = Markup.button.text(advertiseSceneMessages.cancel)

const baseButtons = [cancelButton]

const createProgressMessage = (countAllUsers: number, currentProgress: number, currentDate: string) => {
  return `Отправлено ${currentProgress} из ${countAllUsers}!\nПоследнее обновление: ${currentDate}`
}

const getUsers = (skip: number = 0) => {
  return UserRepository().findAndCount({
    where: {
      isBlocked: IsNull()
    },
    skip,
    take: USER_BASE_LIMIT,
    select: ["telegramId", "id"]
  })
}
// todo: СДЕЛАТЬ ЧАНКИ СРАЗУ ПО БАЗЕ А ТАКЖЕ НЕ ЗАБИТЬ ЭТО СДЕЛАТЬ В САМОМ МОДУЛЕ ПАРСИНГА
// todo: сделать шаг, выбор реклама или просто объявление в бота
// todo: добавить команды для админа в хелп
export const advertiseScene = new Scenes.WizardScene(
  advertiseSceneId,
  async (ctx) => {
    ctx.wizard.state.advertiseCtx = null

    await ctx.reply('Отправьте рекламное сообщение', Markup.keyboard(baseButtons));


    return ctx.wizard.next();
  },
  async (ctx) => {
    if (isCancel(ctx.message.text)) {
      return handleCancel(ctx)
    }

    await ctx.reply("Получаю список доступных пользователей...")
    try {
      const [_, countUsers] = await getUsers()

      await ctx.reply(`Пользователи получены. Всего ${countUsers}`)
      if (!countUsers) {
        await ctx.reply("Пользователей 0, выходим!")
        return ctx.scene.leave()
      }
      await ctx.reply("Начинаю рассылку...")

      let currentProgressNumber = 0

      const progressMessage = await ctx.reply(createProgressMessage(countUsers, currentProgressNumber, new Date()))

      for (let i = 0; i <= countUsers; i += USER_BASE_LIMIT) {
        const [users] = await getUsers(i)
        await Promise.all(users.map(async (user) => {
          try {
            await ctx.copyMessage(user.telegramId)
          } catch (e) {
            if (e?.response?.error_code === 403) {
              console.log("Блок пользователя на рекламе")
              await toBlockedUser(user)
            } else if (e?.response?.error_code === 400) {
              console.log(e?.response?.description ?? "Чат не найден")
            } else {
              loggerHandleError(e)
            }
          }
        }))
        currentProgressNumber += users.length
        try {
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            progressMessage.message_id,
            undefined,
            createProgressMessage(countUsers, currentProgressNumber, new Date())
          )
        } catch (e) {
          loggerHandleError(e)
        }

        await UserRepository()
          .update({ id: In(users.map(({id}) => id)) },
            { receivedAdvertiseAt: new Date() })
      }

      await ctx.reply("Рассылка прошла успешно!")
      await ctx.scene.leave()
    } catch (e) {
      loggerHandleError(e)
      await ctx.reply("Произошла ошибка")
      await ctx.scene.leave()
      return
    }
  },
);

advertiseScene.leave((ctx) => {
  ctx.reply('Вы вышли из диалога!', Markup.removeKeyboard());
});
