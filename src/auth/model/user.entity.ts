import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  // -
} from 'typeorm';
import { Base } from './base';
import { TopLevelRoles } from '../types/auth_types';
import { TwoFactorAuthenticationMethods } from './two-factor-authentication.entity';

export enum CONNECTION_TYPES {
  LOCAL = 1,
}
@Entity('User')
export class User extends Base {
  @PrimaryColumn()
  user_id: string;
  @Column({
    unique: true,
    default: null,
  })
  email?: string;
  @Column({
    unique: false,
    default: null,
  })
  phone_number: string;

  @Index()
  @Column({
    unique: true,
    default: null,
    nullable: true,
  })
  username?: string;
  //
  @Column({
    nullable: true,
  })
  firstname: string;
  @Column({
    nullable: true,
  })
  middlename?: string;
  @Column({
    nullable: true,
  })
  lastname: string;
  @Column({ select: false })
  password: string;
  @Column({
    default: CONNECTION_TYPES.LOCAL,
  })
  connection_type?: number;

  @Column({
    default: TopLevelRoles.USER,
    type: 'varchar',
  })
  role?: TopLevelRoles;

  @Column({
    type: 'boolean',
    default: false,
  })
  email_verified?: boolean;
  @Column({
    type: 'boolean',
    default: false,
  })
  phone_verified?: boolean;

  @Column('timestamp without time zone', {
    nullable: true,
  })
  last_login?: Date;

  @Column({
    nullable: true,
    default: 1,
  })
  account_tier?: number;

  @OneToMany(() => TwoFactorAuthenticationMethods, (twoFA) => twoFA.user)
  two_fa_methods?: TwoFactorAuthenticationMethods[];

  public get full_name(): string {
    return `${this.firstname} ${this.lastname}`;
  }
}
