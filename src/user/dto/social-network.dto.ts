/** Swagger */
import { ApiPropertyOptional } from '@nestjs/swagger';

/** Validators */
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class SocialNetwork {
  @ApiPropertyOptional({ example: 'https://facebook.com/tomcruise' })
  @IsOptional()
  @IsString()
  @IsUrl()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/emmastone' })
  @IsOptional()
  @IsString()
  @IsUrl()
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://tiktok.com/@mi6' })
  @IsOptional()
  @IsString()
  @IsUrl()
  tiktok?: string;
}
