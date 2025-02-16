import { User } from "src/auth/model/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('challenge')
export class Challenge {
    @PrimaryColumn()
    id: string;

    @Index()
    @Column({
        unique: true
    })
    challenge: string;

}