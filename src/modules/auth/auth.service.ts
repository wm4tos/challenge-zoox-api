import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { UserDto } from '../users/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUserAndPassword(email: string, password: string): Promise<UserDto | null> {
    try {
      const userData = await this.usersService.findOneByEmail(email);
      const user = userData.toObject();

      if (user && compareSync(password, user.password)) {
        delete user.password;
        delete user.__v;

        return user;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async userExists(email): Promise<UserDto | null> {
    return this.usersService.findOneByEmail(email);
  }
  
  createToken(user: UserDto): string {
    return this.jwtService.sign({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  }
}
