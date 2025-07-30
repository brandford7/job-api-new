import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/users/entities/role.entity';

/*
enum Role {
  ADMIN = 'admin',
  CANDIDATE = 'candidate',
  RECRUITER = 'recruiter',
}
*/

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  firstname!: string;

  @IsNotEmpty()
  @IsString()
  lastname!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsEnum(Role, { message: 'Role must be either admin or user' })
  @IsOptional()
  roles!: Role[];
}
