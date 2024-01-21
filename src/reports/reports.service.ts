import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from './reports.entity';
import { User } from '../users/users.entity';

import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(body: CreateReportDto, user: User) {
    const report = this.repo.create(body);

    report.user = user;

    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;

    return this.repo.save(report);
  }

  async createEstimate({
    make,
    model,
    longitude,
    latitude,
    year,
    mileage,
  }: GetEstimateDto) {
    this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('longitude - :lng BETWEEN -5 AND 5', { longitude })
      .andWhere('latitude - :lng BETWEEN -5 AND 5', { latitude })
      .andWhere('year - :lng BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('mileage = :mileage', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
