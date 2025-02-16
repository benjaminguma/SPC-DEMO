import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Roles')
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column()
  role_name: string;

  @Column()
  role_description: string;
}
