import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async changeApproval({ id, approved }: { id: string; approved: boolean }) {
    // return this.repo.update(id, { approved });
    const report = await this.repo.findOne({ where: { id: Number(id) } });
    if (!report) {
      throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
    }
    report.approved = approved;
    return this.repo.save(report);
  }

  async findAll() {
    // return this.repo.find({ relations: ['user'] });
    const userReports = await this.repo.find({ relations: ['user'] });
    // const user = userReports.map((report) => report.user);
    // console.log({ user, userReports });

    // const reports = await this.repo.find();
    // console.log({ reports });

    return userReports;
  }
}
