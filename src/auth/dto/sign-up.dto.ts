import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

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

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roles!: string[];
}
