import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class TimeBasedOTP {
    @PrimaryColumn()
    id: string;

    @Column()
    secret: string;

    @Column()
    last_used: Date;
}