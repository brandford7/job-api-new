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
import { JobsService } from 'src/jobs/jobs.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JobApplicationQueryDto } from './dto/job-application-query.dto';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly appRepo: Repository<JobApplication>,

    private readonly jobService: JobsService,

    private readonly userService: UsersService,
  ) {}

  async create(jobId: string, userId: string): Promise<JobApplication> {
    const [job, user] = await Promise.all([
      this.jobService.findOne(jobId),
      this.userService.getUserById(userId),
    ]);

    if (!job.isActive) {
      throw new NotFoundException('Job is not active');
    }

    if (job.createdBy.id === userId) {
      throw new UnauthorizedException('You cannot apply for your own job');
    }

    const application = this.appRepo.create({ job, applicant: user });
    await this.appRepo.save(application);
    return application;
  }

  async getAllApplications(query: JobApplicationQueryDto): Promise<{
    data: JobApplication[];
    meta: { total: number; page: number; limit: number };
  }> {
    const {
      createdAfter,
      createdBefore,
      sortBy = 'appliedAt',
      order = 'DESC',
      page = 1,
      limit = 10,
    } = query;

    const offset = (page - 1) * limit;

    const qb = this.appRepo.createQueryBuilder('job_application');

    // Only allow sorting by specific columns
    const allowedSortFields = ['appliedAt'];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'appliedAt';

    if (createdAfter) {
      qb.andWhere('job_application.appliedAt >= :createdAfter', {
        createdAfter,
      });
    }

    if (createdBefore) {
      qb.andWhere('job_application.appliedAt <= :createdBefore', {
        createdBefore,
      });
    }

    qb.orderBy(
      `job_application.${safeSortBy}`,
      order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
    )
      .skip(offset)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async getMyApplications(
    user: User,
    query: JobApplicationQueryDto,
  ): Promise<{
    data: JobApplication[];
    meta: { total: number; page: number; limit: number };
  }> {
    const {
      createdAfter,
      createdBefore,
      sortBy = 'appliedAt',
      order = 'DESC',
      page = 1,
      limit = 10,
    } = query;

    const offset = (page - 1) * limit;

    const qb = this.appRepo.createQueryBuilder('job_application');

    // ✅ Filter by user ID
    qb.where('job_application.userId = :userId', { userId: user.id });

    // Only allow sorting by specific columns
    const allowedSortFields = ['appliedAt'];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'appliedAt';

    if (createdAfter) {
      qb.andWhere('job_application.appliedAt >= :createdAfter', {
        createdAfter,
      });
    }

    if (createdBefore) {
      qb.andWhere('job_application.appliedAt <= :createdBefore', {
        createdBefore,
      });
    }

    qb.orderBy(
      `job_application.${safeSortBy}`,
      order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
    )
      .skip(offset)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
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
