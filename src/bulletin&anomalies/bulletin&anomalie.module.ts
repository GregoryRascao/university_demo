import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BulletinService } from './services/bulletin.service';
import { BulletinController } from './controller/bulletin.controller';
import { GeneralService } from './services/generalService.service';


@Module({
  imports: [
    HttpModule,
  ],
  controllers: [BulletinController,],
  providers: [BulletinService, GeneralService],
})
export class BulletinAnomalieModule {}
