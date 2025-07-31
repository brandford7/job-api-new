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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(query: UserQueryDTO): Promise<{
    data: User[];
    meta: { total: number; offset: number; limit: number };
  }> {
    const qb = this.userRepo.createQueryBuilder('user');

    const {
      search,
      limit = 10,
      offset = 0,
      createdAfter,
      createdBefore,
    } = query;

    if (search) {
      qb.andWhere(
        `(user.firstname ILIKE(:search) OR user.lastname ILIKE(:search))`,
        { search: `%${search}%` },
      );
    }

    if (createdAfter) {
      qb.andWhere(`(user.createdAt >= :createdAfter)`, {
        createdAfter,
      });
    }

    if (createdBefore) {
      qb.andWhere(`(user.createdAt <= :createdBefore)`, { createdBefore });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, meta: { total, limit, offset } };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'firstname', 'lastname', 'email', 'isAdmin', 'password'], // ✅ include password
      relations: ['roles'], // ✅ include roles
    });
    return user;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'firstname', 'lastname', 'email', 'isAdmin'],
    });
    if (!user) {
      throw new NotFoundException(`user with id- ${userId} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException();
    }
    Object.assign(user, updateUserDto);
    return user;
  }

  async deleteUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return this.userRepo.remove(user);
  }
}
