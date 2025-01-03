import { Module, MiddlewareConsumer } from '@nestjs/common';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { AuthService } from './auth/auth.service';
// import { CurrentUserInterceptor } from '../interceptors/user/current-user-interceptor';
import { CurrentUserMiddleware } from '../middleware/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    // { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}

/**
 * NOTE (DEPENDENCY INJECTION)
 * to use an interceptor as an injectable module, we need to add the
 * @Injectable tag and then pass it as a provider to our module
 */
