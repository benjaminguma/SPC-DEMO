import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('auth_credentials')
export class AuthCredential {
  @PrimaryColumn()
  id: string;

  @Index()
  @Column({
    unique: true,
  })
  value: string;
  @Column()
  crendential_type: 'email' | 'phonenumber';

  @Column()
  verified: boolean;
}
