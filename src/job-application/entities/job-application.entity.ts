import { CV } from 'src/cv/entities/cv.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['job', 'applicant'])
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.applications, {
    eager: true,
    onDelete: 'CASCADE',
  })
  applicant!: User;

  @ManyToOne(() => Job, (job) => job.applications, {
    eager: true,
    onDelete: 'CASCADE',
  })
  job!: Job;

  @ManyToOne(() => CV, (cv) => cv.applications, { nullable: true })
  cv: CV;

  @CreateDateColumn()
  appliedAt!: Date;
}
