import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { JobApplicationQueryDto } from './dto/job-application-query.dto';
import { JobApplication } from './entities/job-application.entity';
import { User } from 'src/users/entities/user.entity';

@Controller('/api/job-applications')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Post()
  create(@Body() jobId: string, userId: string) {
    return this.jobApplicationService.create(jobId, userId);
  }

  @Get()
  async getAllApplications(@Query() query: JobApplicationQueryDto) {
    return this.jobApplicationService.getAllApplications(query);
  }

  @Get()
  async getMyApplications(user: User): Promise<JobApplication[]> {
    return this.jobApplicationService.getMyApplications(user);
  }

  @Get(':id')
  findApplication(@Param('id') id: string) {
    return this.jobApplicationService.findApplication(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobApplicationDto: UpdateJobApplicationDto,
  ) {
    return this.jobApplicationService.update(id, updateJobApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobApplicationService.cancel(id);
  }
}
