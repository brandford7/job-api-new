import { IsBooleanString, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstname!: string;

  @IsString()
  lastname!: string;

  @IsString()
  username?: string;

  @IsEmail()
  email!: string;

  @IsBooleanString()
  isAdmin?: boolean;
}
