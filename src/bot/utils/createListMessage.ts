export const createListMessage = (list: string[]) => {
    return list.map((str) => {
        return createMessageListItem(str)
    })
}

export const createMessageListItem = (str: string): string => {
     return `- ${str}\n`
}
