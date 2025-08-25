import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobApplicationModule } from './job-application/job-application.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/app-datasource';
import { CvModule } from './cv/cv.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    // config module
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceOptions,
    }),

    // multer module
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dest: configService.get<string>('MULTER_DEST'),
      }),
      inject: [ConfigService],
    }),

    JobsModule,
    AuthModule,
    UsersModule,
    JobApplicationModule,
    CvModule,
  ],
})
export class AppModule {}
