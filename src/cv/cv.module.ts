import { Module } from '@nestjs/common';
//import { CVService } from './cv.service';
//import { CvController } from './cv.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  /*controllers: [CvController],
  providers: [CVService],*/
})
export class CvModule {}
