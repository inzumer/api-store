/** Swagger */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Transformer */
import { Type } from 'class-transformer';

/** Validators */
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsMongoId,
  IsArray,
  ArrayNotEmpty,
  IsUrl,
  IsEnum,
  IsBoolean,
  MaxLength,
  Min,
  Max,
  IsInt,
} from 'class-validator';

export const CURRENCIES = ['USD', 'EUR', 'ARS'] as const;

export type Currency = (typeof CURRENCIES)[number];

export class ReviewDto {
  @ApiProperty({
    description: 'Mongo ID of user',
    example: '60c72b2f9b1e8d001c8e4f3a',
  })
  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @ApiPropertyOptional({
    description: 'Creation date of the review (auto-generated)',
    example: '2023-10-01T00:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  created_at?: Date;

  @ApiProperty({ description: 'Rating from 1 to 5', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Vote affirmative' })
  @IsInt()
  vote_affirmative: number;

  @ApiProperty({ description: 'Vote negative' })
  vote_negative: number;
}

export class ProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Mate Imperial',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'Detailed description of the product',
    example: 'A handcrafted mate cup made from algarrobo wood.',
    maxLength: 70000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(70000)
  description: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 1500,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty({
    description: 'Mongo ID of the product category',
    example: '60c72b2f9b1e8d001c8e4f3a',
  })
  @IsMongoId()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty({
    description: 'List of product image URLs',
    example: [
      'https://example.com/images/mate-imperial-1.jpg',
      'https://example.com/images/mate-imperial-2.jpg',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({}, { each: true })
  images: string[];

  @ApiProperty({
    description: 'Number of products in stock',
    example: 50,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  stock: number;

  @ApiProperty({
    description: 'Mongo ID of the product owner',
    example: '60c72b2f9b1e8d001c8e4f3b',
  })
  @IsMongoId()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({
    description: 'Currency used for the product',
    enum: CURRENCIES,
    example: 'USD',
  })
  @IsEnum(CURRENCIES)
  currency: Currency;

  @ApiPropertyOptional({
    description: 'Creation date of the product (auto-generated)',
    example: '2023-10-01T00:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  created_at?: Date;

  @ApiPropertyOptional({
    description: 'Last update date of the product (auto-generated)',
    example: '2023-10-02T00:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  updated_at?: Date;

  @ApiPropertyOptional({
    description: 'Whether the product is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({
    description: 'Average rating from reviews',
    example: 4.5,
  })
  score: number;

  @ApiProperty({
    description: 'List of product reviews',
    type: [ReviewDto],
  })
  @IsMongoId()
  @IsNotEmpty()
  reviews: ReviewDto[];
}
