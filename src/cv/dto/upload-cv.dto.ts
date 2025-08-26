import { IsOptional, IsBoolean } from 'class-validator';

export class UploadCVDto {
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
