import { User } from 'src/auth/model/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('passkey')
export class Passkey {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'bytea',
  })
  public_key: Uint8Array;

  @Column()
  credential_id: string;

  @Column()
  last_used: Date;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({ type: 'bigint' })
  counter: number;

  @ManyToOne(() => User)
  owner: User;

  // @Column({ type: 'jsonb', nullable: true })
  // transports: AuthenticatorTransportFuture[] | null;
}
