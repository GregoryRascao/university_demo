import { Module } from '@nestjs/common';
import { SimpleQueryModule } from './SimpleQuery/simpleQuery.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { BulletinAnomalieModule } from './bulletin&anomalies/bulletin&anomalie.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', '/data/universite_demo.sqlite'), 
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, 
    }),
    SimpleQueryModule,
    BulletinAnomalieModule,
  ],
})
export class AppModule {}
