// src/cv/dto/upload-cv.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UploadCVDto {
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
