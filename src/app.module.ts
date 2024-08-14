import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { ReportsController } from './reports/reports.controller';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { ReportEntity } from './entity/report.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [UserEntity, ReportEntity],
      synchronize: true, // run this in development mode only
    }),
    ReportsModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController, ReportsController],
  providers: [AppService],
})
export class AppModule {}
