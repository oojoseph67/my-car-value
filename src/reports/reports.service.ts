import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from '@src/entity/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDTO } from './dto/create-reports.dto';
import { UserEntity } from '@src/entity/user.entity';
import { GetEstimateDTO } from './dto/get-estimate.dto';

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
    return await this.repo.find({ relations: ['user'] });
  }

  async createEstimate({ data }: { data: Partial<GetEstimateDTO> }) {
    const { company, model, year, longitude, latitude, mileage } = data;

    //   return (
    //     this.repo
    //       .createQueryBuilder()
    //       // .select('*')
    //       .select('AVG(price)', 'price')
    //       .where('company = :company', { company })
    //       .andWhere('model = :model', { model })
    //       .andWhere('year = :year', { year })
    //       .andWhere('longitude - :longitude BETWEEN -5 AND 5', { longitude })
    //       .andWhere('latitude - :latitude BETWEEN -5 AND 5', { latitude })
    //       .andWhere('mileage - :mileage BETWEEN -5000 AND 5000', { mileage })
    //       .andWhere('approved = TRUE')
    //       .orderBy('ABS(mileage - :mileage)', 'DESC')
    //       .setParameters({ mileage })
    //       .limit(3)
    //       .getRawOne()
    //     // .getRawMany()
    //   );

    const queryBuilder = this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('approved = TRUE');

    // Add conditions only if the corresponding data is provided
    if (company) {
      queryBuilder.andWhere('company = :company', { company });
    }
    if (model) {
      queryBuilder.andWhere('model = :model', { model });
    }
    if (year) {
      queryBuilder.andWhere('year = :year', { year });
    }
    if (longitude) {
      queryBuilder.andWhere('longitude - :longitude BETWEEN -5 AND 5', {
        longitude,
      });
    }
    if (latitude) {
      queryBuilder.andWhere('latitude - :latitude BETWEEN -5 AND 5', {
        latitude,
      });
    }
    if (mileage) {
      queryBuilder.andWhere('mileage - :mileage BETWEEN -5000 AND 5000', {
        mileage,
      });
      queryBuilder
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        .setParameters({ mileage });
    }

    return queryBuilder.limit(3).getRawOne();
  }
}
