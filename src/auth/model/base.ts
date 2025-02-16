import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export class Base {
  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @VersionColumn({
    default: 1,
  })
  _v?: number;
}
