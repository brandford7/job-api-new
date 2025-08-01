import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
//import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { Role } from 'src/users/entities/role.entity';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User): Promise<SignInResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    console.log('User from DB:', user);
    //console.log('Input password:', loginDto.password);
    console.log('Stored hash:', user.password);

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async validateUser(loginDto: SignInDto): Promise<User> {
    const user = await this.userService.getUserByEmail(loginDto.email);

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

    const roles = await this.roleRepo.findBy({ name: In(signupDto.roles) });

    const exists = await this.userService.getUserByEmail(signupDto.email);
    if (exists) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    signupDto.roles = [...new Set(signupDto.roles)];

    const user = this.userRepo.create({
      email: signupDto.email,
      firstname: signupDto.firstname,
      lastname: signupDto.lastname,
      password: hashedPassword,
      roles,
    });
    await this.userRepo.save(user);
    return user;
  }

  async getMyProfile(user: User): Promise<User> {
    const currentUser = await this.userService.getUserById(user.id);

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    return currentUser;
  }

  async updateMyProfile(
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const currentUser = await this.userService.getUserById(user.id);
    if (!currentUser) {
      throw new UnauthorizedException('User not authorized');
    }
    Object.assign(currentUser, updateUserDto);
    return currentUser;
  }
}
