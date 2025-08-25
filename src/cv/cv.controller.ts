import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CVService } from './cv.service';
import { UploadCVDto } from './entities/upload-cv.dto';
import { FileSizeValidationPipe } from 'src/common/pipes/filesize-validation-pipe';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CVService) {}

  @Post('upload')
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCV(
    @UploadedFile(new FileSizeValidationPipe()) file: Express.Multer.File,
    @CurrentUser() user: User,
    @Body() dto: UploadCVDto,
  ) {
    return this.cvService.uploadCV(file, user, dto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cvService.deleteCV(+id);
  }
}
