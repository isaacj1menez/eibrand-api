import { getCurrentDate } from "@base/utils/dates-manager";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column("varchar", { length: 100 })
    fullname: string = '';

    @Column("varchar", { length: 50 })
    username: string = '';

    @Column("varchar", { length: 255 })
    password: string = '';

    @Column("varchar", { length: 50 })
    role: string = '';

    @Column("varchar", { length: 50 })
    email: string = '';

    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP"})
    createdate: Date = new Date();

    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP"})
    lastupdatedate: Date = new Date();
}