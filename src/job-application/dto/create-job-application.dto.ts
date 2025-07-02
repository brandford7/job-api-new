import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobApplicationDto {
  @IsString()
  @IsNotEmpty()
  jobId!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;
}
