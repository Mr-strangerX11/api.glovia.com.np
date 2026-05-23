import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsDateString,
  IsObject,
} from 'class-validator';

export class CreatePromoCodeDto {
  @IsString()
  code: string;

  @IsNumber()
  discount: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  usageLimit?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
