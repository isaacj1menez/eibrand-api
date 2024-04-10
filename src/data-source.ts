import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./api/models/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "eibrand_dev",
    password: "I544c.1995",
    database: "eibrand_test",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
