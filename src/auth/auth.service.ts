import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (user && compareSync(password, user.password)) {
        delete user.password;

        return user;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }
  
  createToken(user: User): string {
    return this.jwtService.sign({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  }
}
