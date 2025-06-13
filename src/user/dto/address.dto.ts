/** Swagger */
import { ApiProperty } from '@nestjs/swagger';

/** Validators */
import { IsString, IsInt, MaxLength, Min, Max } from 'class-validator';

export class Address {
  @ApiProperty({ example: 'Av. Siempre Viva 742' })
  @IsString()
  @MaxLength(100)
  street: string;

  @ApiProperty({ example: 'Springfield' })
  @IsString()
  @MaxLength(50)
  city: string;

  @ApiProperty({ example: 'United States' })
  @IsString()
  @MaxLength(50)
  country: string;

  @ApiProperty({ example: 'B2345' })
  @IsString()
  @MaxLength(20)
  postal_code: string;

  @ApiProperty({ example: 'Illinois' })
  @IsString()
  @MaxLength(50)
  state: string;

  @ApiProperty({ example: 123 })
  @IsInt()
  @Min(1)
  @Max(99999)
  house_number: number;
}
