import { Controller, Get, Param } from '@nestjs/common';
import { SimpleQueryService } from '../service/simpleQuery.service';

@Controller('SimpleQuery')
export class SimpleQueryController {
  constructor(private readonly simpleQueryService: SimpleQueryService) {}

  @Get('cours')
  async getAllCours() {
    return await this.simpleQueryService.findAllCours();
  }
  
  @Get('inscriptions')
  getAllInscriptions() {
    return this.simpleQueryService.findAllInscriptions();
  }

  @Get('inscriptions/:matricule')
  getInscription(@Param('matricule') matricule: string) {
    return this.simpleQueryService.findInscriptionByMatricule(matricule);
  }

  @Get('inscriptions/:matricule/cours')
  getCoursInscription(@Param('matricule') matricule: string) {
    return this.simpleQueryService.getCoursInscription(matricule);
  }


  @Get('cours/:mnemonique')
  getCours(@Param('mnemonique') mnemonique: string) {
    return this.simpleQueryService.findCoursByMnemonique(mnemonique);
  }

  @Get('notes/matricule/:matricule')
  getNotesByMatricule(@Param('matricule') matricule: string) {
    return this.simpleQueryService.findNotesByMatricule(matricule);
  }

  @Get('notes/cours/:mnemonique')
  getNotesByCours(@Param('mnemonique') mnemonique: string) {
    return this.simpleQueryService.findNotesByMnemonique(mnemonique);
  }
}
