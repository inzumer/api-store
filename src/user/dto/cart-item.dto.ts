/** Swagger */
import { ApiProperty } from '@nestjs/swagger';

/** Class validator */
import { IsMongoId, IsInt, Min } from 'class-validator';

/** Class transformer */
import { Type } from 'class-transformer';

export class CartItem {
  @ApiProperty({ example: '684471f278939b7fa540eb53' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: '10' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}
