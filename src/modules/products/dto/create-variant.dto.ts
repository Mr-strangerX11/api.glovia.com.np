import { IsString, IsOptional, IsNumber, IsInt, Min, IsObject } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  title: string;

  @IsString()
  sku: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;
}
