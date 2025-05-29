import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from './schema/users.schema';
import { Address, AddressSchema } from './schema/address.schema';
import { PreferencesSchema } from './schema/preferences.schema';
import { SocialNetworkSchema } from './schema/social-network.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Users',
        schema: UsersSchema,
      },
      {
        name: Address.name,
        schema: AddressSchema,
      },
      {
        name: 'Preferences',
        schema: PreferencesSchema,
      },
      {
        name: 'SocialNetwork',
        schema: SocialNetworkSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
