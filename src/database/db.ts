import "reflect-metadata"
import { DataSource } from "typeorm"
import {ListeningWord} from "@/database/ListeningWord";
import {User} from "@/database/User";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "src/database.sqlite",
    entities: [User, ListeningWord],
    synchronize: true,
    migrationsRun: true,
})

export const initDatabase = () => {
    AppDataSource.initialize()
        .then(() => {

        })
        .catch((error) => console.log(error))
}
