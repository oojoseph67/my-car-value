import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use();
  // app.use(
  // cookieSession({
  //   name: 'session',
  //   keys: ['abcdef'],
  //   // Cookie Options
  //   maxAge: 24 * 60 * 60 * 1000, // 24 hours
  // }),
  // );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );
  await app.listen(6666);
}
bootstrap();
