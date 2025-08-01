import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { JobApplicationQueryDto } from './dto/job-application-query.dto';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/api/job-applications')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @UseGuards(JWTAuthGuard)
  @Post(':id')
  create(@Param('id') jobId: string, @CurrentUser() user: User) {
    return this.jobApplicationService.create(jobId, user.id);
  }

  @UseGuards(JWTAuthGuard)
  @Get()
  async getAllApplications(@Query() query: JobApplicationQueryDto) {
    return this.jobApplicationService.getAllApplications(query);
  }

  @UseGuards(JWTAuthGuard)
  @Get('/me')
  async getMyApplications(
    @CurrentUser() user: User,
    @Query() query: JobApplicationQueryDto,
  ) {
    return this.jobApplicationService.getMyApplications(user, query);
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
