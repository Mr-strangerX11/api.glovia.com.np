import { IsString, IsOptional, IsNumber, IsInt, Min, IsObject } from 'class-validator';

export class UpdateVariantDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;
}
