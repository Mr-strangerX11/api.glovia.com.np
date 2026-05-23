import { IsString, IsOptional, IsBoolean, IsDateString, IsObject } from 'class-validator';

export class CreatePopupDto {
  @IsString()
  title: string;

  @IsString()
  htmlContent: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
