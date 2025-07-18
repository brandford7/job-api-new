import {
  Body,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
//   import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplication } from './entities/job-application.entity';
import { Repository } from 'typeorm';
import { Job } from 'src/jobs/entities/job.entity';
import { JobsService } from 'src/jobs/jobs.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly appRepo: Repository<JobApplication>,
    @InjectRepository(Job)
    private readonly jobService: JobsService,
    @InjectRepository(User)
    private readonly userService: UsersService,
  ) {}

  async create(@Body() userId: string, jobId: string): Promise<JobApplication> {
    const job = await this.jobService.findOne(jobId);
    const user = await this.userService.getUserByEmail(userId);

    if (!job || !job.isActive) {
      throw new NotFoundException('job not found or not active');
    }

    if (job.createdBy.id === userId) {
      throw new UnauthorizedException('You cannot apply for your own job');
    }

    if (!user) {
      throw new UnauthorizedException('User not authorized');
    }

    const application = this.appRepo.create({ job, applicant: user });
    await this.appRepo.save(application);
    return application;
  }

  async getAllApplications(): Promise<JobApplication[]> {
    const applications = await this.appRepo.find();
    return applications;
  }

  async getMyApplications(user: User): Promise<JobApplication[]> {
    const applications = await this.appRepo.find({
      where: { applicant: user },
      relations: ['job'],
      order: { appliedAt: 'DESC' },
    });
    return applications;
  }

  async findApplication(applicationId: string): Promise<JobApplication> {
    const application = await this.appRepo.findOne({
      where: { id: applicationId },
    });
    if (!application) {
      throw new NotFoundException('Job application does not exist');
    }
    return application;
  }

  async update(
    appId: string,
    updateApplicationDto: UpdateJobApplicationDto,
  ): Promise<JobApplication> {
    const application = await this.appRepo.findOne({ where: { id: appId } });
    if (!application) {
      throw new NotFoundException('job application does not exist');
    }
    Object.assign(application, updateApplicationDto);
    return application;
  }

  async cancel(appId: string): Promise<void> {
    const application = await this.appRepo.findOne({ where: { id: appId } });
    if (!application) {
      throw new NotFoundException('job application does not exist');
    }
    await this.appRepo.delete(application);
  }
}
