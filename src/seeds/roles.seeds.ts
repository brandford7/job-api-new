import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/users/entities/role.entity';

config(); // Load .env
const configService = new ConfigService();

export const seedRoles = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: configService.getOrThrow<string>('DATABASE_HOST'),
    port: parseInt(configService.getOrThrow<string>('DATABASE_PORT')), // safer casting
    username: configService.getOrThrow<string>('DATABASE_USERNAME'),
    password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
    database: configService.getOrThrow<string>('DATABASE_NAME'),
    entities: [Role],
    synchronize: false,
    url: configService.get<string>('DATABASE_URL') || undefined, // fallback if not using DATABASE_URL
  });

  await dataSource.initialize();
  const roleRepo = dataSource.getRepository(Role);

  const roles = ['admin', 'recruiter', 'candidate'];

  for (const name of roles) {
    const exists = await roleRepo.findOneBy({ name });
    if (!exists) {
      const role = roleRepo.create({ name });
      await roleRepo.save(role);
      console.log(`✅ Inserted role: ${name}`);
    } else {
      console.log(`ℹ️ Role "${name}" already exists`);
    }
  }

  await dataSource.destroy();
};

seedRoles().catch((err) => {
  console.error('❌ Failed to seed roles:', err);
  process.exit(1);
});
