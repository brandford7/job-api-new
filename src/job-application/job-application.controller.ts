import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';

@Controller('job-application')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Post()
  create(@Body() jobId: string, userId: string) {
    return this.jobApplicationService.create(jobId, userId);
  }

  @Get()
  findAll() {
    return this.jobApplicationService.getAllApplications();
  }

  @Get(':id')
  findApllication(@Param('id') id: string) {
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
