import { User } from 'src/users/entities/user.entity';

export class SignInResponseDto {
  access_token: string;
  user: Pick<User, 'id' | 'firstname' | 'lastname' | 'email' | 'role'>;
}
