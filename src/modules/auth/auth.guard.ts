import { AuthGuard as NestGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { ResponseDto } from 'src/common/interfaces/response.dto';
import { CommonMessages } from 'src/common/enums/messages.enum';

export class AuthGuard extends NestGuard('jwt') {
  constructor(...args) {
    super(...args);
  }

  async canActivate(ctx: ExecutionContext): Promise<any> {
    try {
      const canActivate = await super.canActivate(ctx);

      return canActivate;
    } catch (error) {
      throw new ResponseDto(false, null, CommonMessages.UNAUTHORIZED, error);
    }
  }

  handleRequest(err, user, info, ctx) {
    console.log('super.handleRequest(err, user, info, ctx) :', super.handleRequest(err, user, info, ctx));
    return super.handleRequest(err, user, info, ctx)
  }

  logIn(req) {
    console.log('super.logIn(req) :', super.logIn(req));
    return super.logIn(req);
  }
}