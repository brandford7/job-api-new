import { Exclude } from 'class-transformer';
import { JobApplication } from 'src/job-application/entities/job-application.entity';
import { Job } from 'src/jobs/entities/job.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';
import { CV } from 'src/cv/entities/cv.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ default: false })
  isAdmin!: boolean;

  @ManyToMany(() => Role, (role) => role.users, { eager: true }) // optional: eager load roles
  @JoinTable()
  roles!: Role[];

  @OneToMany(() => Job, (job) => job.createdBy)
  jobs!: Job[];

  @OneToMany(() => CV, (cv) => cv.user)
  cvs: CV[];
  @OneToMany(() => JobApplication, (app) => app.applicant)
  applications!: JobApplication[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
