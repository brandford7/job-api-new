import { IsDateString, IsString } from 'class-validator';
import { Role } from '../entities/role.entity';
import { Expose, Transform } from 'class-transformer';

export class UserResponseDTO {
  @Expose()
  @IsString()
  id!: string;

  @Expose()
  @IsString()
  firstname!: string;

  @Expose()
  @IsString()
  lastname!: string;

  @Expose()
  @IsString()
  email!: string;

  @Expose()
  @IsString()
  summary?: string;

  @Expose()
  @Transform(({ obj }) => {
    const roles = (obj as { roles?: Role[] }).roles;
    return roles ? roles.map((r) => r.name) : [];
  })
  roles!: string[];

  @Expose()
  @IsDateString()
  createdAt!: string;

  @Expose()
  @IsString()
  updatedAt!: string;
}
