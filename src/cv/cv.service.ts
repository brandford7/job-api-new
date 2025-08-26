/*
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CV } from './entities/cv.entity';
import { Repository } from 'typeorm';
//import { UploadCVDto } from './dto/upload-cv.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CVService {
  constructor(
    @InjectRepository(CV) private readonly cvRepo: Repository<CV>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUserCVs(user: User): Promise<CV[]> {
    const cvList = await this.cvRepo.find({
      where: { user: { id: user.id } },
      order: { uploadedAt: 'DESC' },
    });
    return cvList;
  }
  
  async uploadCV(file: Express.Multer.File, user: User, dto: UploadCVDto) {
    if (!file) throw new BadRequestException('No file uploaded');

    // Upload to Cloudinary
    const result = await this.cloudinary.uploader.upload_stream({
      folder: `cvs/${user.id}`,
      resource_type: 'raw',
      public_id: file.originalname.split('.')[0],
      format: 'pdf', // or docx based on content-type
    });

    // Store in DB
    const cv = this.cvRepo.create({
      filename: file.originalname,
      url: result.secure_url,
      user,
      isDefault: dto.isDefault || false,
    });

    return this.cvRepo.save(cv);
  }

  deleteCV(id: number) {
    return `This action removes a #${id} cv`;
  }
}
*/
