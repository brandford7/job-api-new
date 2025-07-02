import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobRepo.create(createJobDto);

    return await this.jobRepo.save(job);
  }

  async findAll(): Promise<Job[]> {
    const jobs = await this.jobRepo.find();
    return jobs;
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepo.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`job with id ${id} does not exist `);
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
