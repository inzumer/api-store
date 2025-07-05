/** Class validators */
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsUrl,
} from 'class-validator';

/** Swagger */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Yerbas',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'A detailed description of the category',
    example: 'Category for all yerba mate-related products',
    maxLength: 8000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(8000)
  description: string;

  @ApiPropertyOptional({
    description: 'URL of the category image',
    example: 'https://example.com/images/yerbas.jpg',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiPropertyOptional({
    description: 'Whether the category is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
