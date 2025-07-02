import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
//import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User): Promise<SignInResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateUser(loginDto: SignInDto): Promise<User> {
    const user = await this.userService.getUser(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      user.password, // ✅ compare to hash stored in DB
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async signup(signupDto: SignUpDto): Promise<User> {
    // Implement user creation logic (hashing password, etc.)

    const exists = await this.userRepo.findOne({
      where: { email: signupDto.email },
    });
    if (exists) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = this.userRepo.create({
      email: signupDto.email,
      firstname: signupDto.firstname,
      lastname: signupDto.lastname,
      password: hashedPassword,
      role: signupDto.role,
    });
    await this.userRepo.save(user);
    return user;
  }
}
