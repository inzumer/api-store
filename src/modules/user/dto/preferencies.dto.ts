/** Swagger */
import { ApiProperty } from '@nestjs/swagger';

/** Class validator */
import { IsString, IsIn, IsOptional } from 'class-validator';

export class Preferencies {
  @ApiProperty({ example: 'dark', enum: ['light', 'dark'] })
  @IsOptional()
  @IsString()
  @IsIn(['light', 'dark'])
  theme: string;

  @ApiProperty({ example: 'en', enum: ['en', 'es', 'pt'] })
  @IsOptional()
  @IsString()
  @IsIn(['en', 'es', 'pt'])
  lang: string;
}
