import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobApplicationModule } from './job-application/job-application.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/app-datasource';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceOptions,
    }),
    JobsModule,
    AuthModule,
    UsersModule,
    JobApplicationModule,
  ],
})
export class AppModule {}
