import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { JobQueryDTO } from './dto/job-query.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    private readonly userService: UsersService,
  ) {}

  async create(user: User, createJobDto: CreateJobDto): Promise<Job> {
    const currentUser = await this.userService.getUserByEmail(user.email);
    if (!currentUser) {
      throw new UnauthorizedException('User not authorized');
    }
    const job = this.jobRepo.create({
      createdBy: currentUser,
      ...createJobDto,
    });

    await this.jobRepo.save(job);
    return job;
  }

  async findAll(query: JobQueryDTO): Promise<{
    data: Job[];
    meta: { total: number; page: number; limit: number };
  }> {
    const {
      search,
      type,
      location,
      minSalary,
      maxSalary,
      createdAfter,
      createdBefore,
      sortBy = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 10,
    } = query;

    const offset = (page - 1) * limit;

    const qb = this.jobRepo.createQueryBuilder('job');

    // Search across title and description
    if (search) {
      qb.andWhere(
        '(LOWER(job.title) LIKE LOWER(:search) OR LOWER(job.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (type) {
      qb.andWhere('Lower(job.type) = :type', { type });
    }

    if (location) {
      qb.andWhere('Lower(job.location) = :location', { location });
    }

    if (minSalary) {
      qb.andWhere('job.salary >= :minSalary', { minSalary });
    }

    if (maxSalary) {
      qb.andWhere('job.salary <= :maxSalary', { maxSalary });
    }

    if (createdAfter) {
      qb.andWhere('job.createdAt >= :createdAfter', { createdAfter });
    }

    if (createdBefore) {
      qb.andWhere('job.createdAt <= :createdBefore', { createdBefore });
    }

    qb.orderBy(`job.${sortBy}`, order).skip(offset).take(limit);

    const total = await qb.getCount();
    const data = await qb.getMany();

    return { data, meta: { total, page, limit } };
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.jobRepo.findOne({ where: { id } });

    if (!job) {
      throw new NotFoundException(`job with id ${id} does not exist `);
    }

    Object.assign(job, updateJobDto);

    await this.jobRepo.save(job);

    return job;
  }

  async remove(id: string): Promise<string> {
    const job = await this.jobRepo.findOne({ where: { id } });

    if (!job) {
      throw new NotFoundException(`job with id ${id} does not exist `);
    }
    await this.jobRepo.remove(job);
    return id;
  }
}
