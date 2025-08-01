import { Module } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { JobApplicationController } from './job-application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from './entities/job-application.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JobsService } from 'src/jobs/jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplication, Job, User])],
  controllers: [JobApplicationController],
  providers: [JobApplicationService, UsersService, JobsService],
})
export class JobApplicationModule {}
