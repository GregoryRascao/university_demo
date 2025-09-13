import { Module } from '@nestjs/common';
import { SimpleQueryModule } from './SimpleQuery/simpleQuery.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', '/data/universite_demo.sqlite'), 
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, 
    }),
    SimpleQueryModule,
  ],
})
export class AppModule {}
