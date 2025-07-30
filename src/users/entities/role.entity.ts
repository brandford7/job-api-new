import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

/*
enum UserRole {
  ADMIN = 'admin',
  CANDIDATE = 'candidate',
  RECRUITER = 'recruiter',
}
*/

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
