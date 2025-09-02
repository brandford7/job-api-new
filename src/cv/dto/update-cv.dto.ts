import { PartialType } from '@nestjs/mapped-types';

import { UploadCVDto } from './upload-cv.dto';

export class UpdateCvDto extends PartialType(UploadCVDto) {}
