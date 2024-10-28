import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from '@src/entity/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDTO } from './dto/create-reports.dto';
import { UserEntity } from '@src/entity/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity) private repo: Repository<ReportEntity>,
  ) {}

  create({
    reportDto,
    user,
  }: {
    reportDto: CreateReportDTO;
    user: UserEntity;
  }) {
    const report = this.repo.create(reportDto); // create instance of ReportEntity
    report.user = user; // set user in the ReportEntity
    return this.repo.save(report); // save instance of ReportEntity
  }
}
