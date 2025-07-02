import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  company!: string;

  @IsNotEmpty()
  @IsString()
  location!: string;

  @IsNotEmpty()
  @IsString()
  jobType!: string; // e.g., 'Full-time', 'Remote'

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
