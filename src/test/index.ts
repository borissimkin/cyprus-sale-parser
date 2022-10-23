import "reflect-metadata"
import { DataSource } from "typeorm"
import {ListeningWord} from "../database/ListeningWord";
import {User} from "../database/User";
import {generateTestDb} from "./generateTestDb";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "src/test_database.sqlite",
    entities: [User, ListeningWord],
    synchronize: true,
    migrationsRun: true,
})

export const initDatabase = () => {
    AppDataSource.initialize()
        .then(() => {
            return generateTestDb()
        })
        .catch((error) => console.log(error))
}


initDatabase()
