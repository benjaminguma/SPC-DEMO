import { AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('BlockedUser')
export class BlockedUser {
  @AfterUpdate()
  updateLastLog() {
    console.log(1);
    this.last_failed_log = new Date().getTime();
  }

  @PrimaryGeneratedColumn('uuid') blocked_id: number;
  @Column({
    type: 'bigint',
    default: 0,
  })
  blocked_until: number;
  @Column({
    type: 'int',
    default: 0,
  })
  failed_login_attempts: number;
  @Column({
    unique: true,
    type: 'varchar',
    //
    nullable: false,
  })
  id: string;

  @Column({
    type: 'bigint',
    default: () => new Date().getTime().toString(),
  })
  last_failed_log?: number;
}
