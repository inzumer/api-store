/** Category dependencies */
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

/** Schema */
import { Category, CategorySchema } from './schema/category.schema';

/** Nest */
import { Module } from '@nestjs/common';

/** Mongoose */
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [MongooseModule],
})
export class CategoryModule {}
