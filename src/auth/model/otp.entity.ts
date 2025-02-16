import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OTP_CODE_TYPES } from '../types/otp_types';

@Entity('Otp')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  otp_id: string;
  @Column({
    type: 'bigint',
  })
  expires: number;

  @Column({ type: 'varchar', length: 256 })
  code: string;

  @Column()
  grantee: string;

  @Column()
  type: OTP_CODE_TYPES;

  @Column({
    default: 0,
  })
  failed_attempts?: number;
}
