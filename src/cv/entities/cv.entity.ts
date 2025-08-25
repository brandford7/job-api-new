import { JobApplication } from 'src/job-application/entities/job-application.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CV {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  url: string;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  uploadedAt: Date;

  @ManyToOne(() => User, (user) => user.cvs)
  user: User;

  @OneToMany(() => JobApplication, (application) => application.cv)
  applications: JobApplication[];
}
