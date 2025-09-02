import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserQueryDTO } from './dto/user-query.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(query: UserQueryDTO): Promise<{
    data: UserResponseDTO[];
    meta: { total: number; page: number; limit: number };
  }> {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles');

    const {
      search,
      limit = 10,
      page = 1,
      createdAfter,
      createdBefore,
      sortBy,
      order,
    } = query;

    const offset = (page - 1) * limit;

    if (search) {
      qb.andWhere(
        `(user.firstname ILIKE(:search) OR user.lastname ILIKE(:search))`,
        { search: `%${search}%` },
      );
    }

    if (createdAfter) {
      qb.andWhere(`user.createdAt >= :createdAfter`, { createdAfter });
    }

    if (createdBefore) {
      qb.andWhere(`user.createdAt <= :createdBefore`, { createdBefore });
    }

    qb.orderBy(`user.${sortBy || 'createdAt'}`, order || 'DESC')
      .skip(offset)
      .take(limit);

    const [users, total] = await qb.getManyAndCount();

    // ✅ Transform to DTOs with class-transformer
    const data = plainToInstance(UserResponseDTO, users, {
      excludeExtraneousValues: true,
    });

    return {
      data,
      meta: { total, page, limit },
    };
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'firstname', 'lastname', 'email'], // include password
      relations: ['roles'], //  include roles
    });
    if (!user) {
      throw new NotFoundException(`user with ${email} not found`);
    }

    return user;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'firstname', 'lastname', 'email', 'roles'],
    });
    if (!user) {
      throw new NotFoundException(`user with id- ${userId} not found`);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDTO> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles'], // ensure roles are loaded
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepo.save(user);

    return plainToInstance(UserResponseDTO, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async deleteUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return this.userRepo.remove(user);
  }
}
