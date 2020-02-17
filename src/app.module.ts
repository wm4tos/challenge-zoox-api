import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { StateModule } from './modules/state/state.module';
import { CitiesModule } from './modules/cities/cities.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    ),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
    PassportModule,
    UsersModule,
    AuthModule,
    StateModule,
    CitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
