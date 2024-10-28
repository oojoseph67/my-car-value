import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.currentUser) {
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);
    }

    const admin = request.currentUser.admin;

    return admin;
  }
}
