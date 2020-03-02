import { AuthGuard as NestGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { ResponseDto } from 'src/common/interfaces/response.dto';
import { CommonMessages } from 'src/common/enums/messages.enum';

export class AuthGuard extends NestGuard('jwt') {
  constructor(...args) {
    super(...args);
  }

  canActivate(ctx: ExecutionContext) {
    return super.canActivate(ctx);
  }

  handleRequest(err, user, info, ctx) {
    return super.handleRequest(err, user, info, ctx)
  }

  logIn(req) {
    return super.logIn(req);
  }
}