import "reflect-metadata"
import { DataSource } from "typeorm"
import { getEnvVariable } from "../utils/env"
import { User } from "@base/api/models/User";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: getEnvVariable('TYPEORM_HOST'),
    port: Number(getEnvVariable('TYPEORM_PORT')),
    username: getEnvVariable('TYPEORM_USERNAME'),
    password: getEnvVariable('TYPEORM_PASSWORD'),
    database: getEnvVariable('TYPEORM_DATABASE'),
    entities: [User],
    migrations: [getEnvVariable('TYPEORM_MIGRATIONS')],
    synchronize: true,
    logging: false,
});

