import {User} from "@/database/User/model";
import {AppDataSource} from "@/database";

export const UserRepository = () => AppDataSource?.getRepository(User)

