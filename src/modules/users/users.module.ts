import { Module } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './users.schema';

export const UsersModuleOptions: ModuleMetadata = {
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  exports: [UsersService],
  providers: [UsersService],
};

@Module(UsersModuleOptions)
export class UsersModule {}
