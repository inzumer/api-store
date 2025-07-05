/** Class validators */
import {
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
  IsInt,
  IsMongoId,
} from 'class-validator';

/** Class transformer */
import { Type } from 'class-transformer';

/** Swagger */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
