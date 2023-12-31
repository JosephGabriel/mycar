import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';

import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersServices: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    if (request.session?.userId) {
      const user = await this.usersServices.findOne(request.session.userId);

      request.currentUser = user;
    }

    return next.handle();
  }
}
