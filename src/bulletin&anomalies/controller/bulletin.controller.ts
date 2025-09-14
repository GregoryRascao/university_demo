import { Controller, Get } from '@nestjs/common';
import { BulletinService } from '../services/bulletin.service';

@Controller('bulletin-anomalies')
export class BulletinController {
  constructor(private readonly bulletinService: BulletinService) {}

  @Get('bulletins')
  async getBulletins() {
    return await this.bulletinService.buildBulletins();
  }

  @Get('anomalies')
  async getAnomalies() {
    return await this.bulletinService.anomaliesReport();
  }
}
