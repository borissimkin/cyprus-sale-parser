import {AppDataSource} from "@/database";
import {ListeningWord} from "@/database/ListeningWord/model";

export const ListeningWordRepository = () => AppDataSource?.getRepository(ListeningWord)
