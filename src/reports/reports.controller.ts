// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDTO } from './dto/create-reports.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserEntity } from '@src/entity/user.entity';
import { ReportDTO } from './dto/reports.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {} // this is called dependency injection

  @Post('/create')
  @UseGuards(AuthGuard)
  @Serialize(ReportDTO)
  createReport(
    @Body() body: CreateReportDTO,
    @CurrentUser() user: UserEntity,
    // @Session() session: any,
  ) {
    // const { userId } = session;
    // const user = await this.userService.findOne({ id: userId });
    return this.reportsService.create({ reportDto: body, user });
  }
}
