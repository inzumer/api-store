/** Validators */
import { IsMongoId, IsInt, Min } from 'class-validator';

/** Transformer */
import { Type } from 'class-transformer';

export class CartItem {
  @IsMongoId()
  productId: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}
