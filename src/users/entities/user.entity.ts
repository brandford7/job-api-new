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
} from 'typeorm';

enum Role {
  ADMIN = 'admin',
  CANDIDATE = 'candidate',
  RECRUITER = 'recruiter',
}

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

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CANDIDATE,
  })
  role!: Role;

  @OneToMany(() => Job, (job) => job.createdBy)
  jobs!: Job[];

  @OneToMany(() => JobApplication, (app) => app.applicant)
  applications!: JobApplication[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
