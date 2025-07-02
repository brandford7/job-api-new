/* eslint-disable prettier/prettier */
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsIn,
  IsDateString,
  
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UserQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['candidate', 'recruiter', 'admin'])
  role?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isAdmin?: boolean;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @IsOptional()
  @IsDateString()
  createdBefore?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  offset?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}
