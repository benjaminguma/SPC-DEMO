import { Entity, Column, PrimaryColumn, Index, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum TwoFactorAuthenticationMethodNames {
    PASSKEY = 'PASSKEY',
    TOTP = 'TOTP'
}

@Entity('two-factor-authentication-methods')
export class TwoFactorAuthenticationMethods {
    @PrimaryColumn()
    id: string;

    @Column({
        type: 'enum',
        enum: TwoFactorAuthenticationMethodNames,
    })
    methodName: TwoFactorAuthenticationMethodNames;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user' })
    user: User;
}
