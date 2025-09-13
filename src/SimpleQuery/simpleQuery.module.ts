import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cours } from 'src/entities/cours.entity';
import { Inscription } from 'src/entities/inscription.entity';
import { Note } from 'src/entities/note.entity';
import { SimpleQueryController } from './controller/simpleQuery.controller';
import { SimpleQueryService } from './service/simpleQuery.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inscription, Cours, Note]),
  ],
  controllers: [SimpleQueryController],
  providers: [SimpleQueryService],
})
export class SimpleQueryModule {}
