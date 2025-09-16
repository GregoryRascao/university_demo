import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cours } from 'src/entities/cours.entity';
import { Inscription } from 'src/entities/inscription.entity';
import { Note } from 'src/entities/note.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SimpleQueryService {
  constructor(
    @InjectRepository(Inscription)
    private readonly inscriptionRepo: Repository<Inscription>,
    @InjectRepository(Cours)
    private readonly coursRepo: Repository<Cours>,
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
  ) {}

  async findAllInscriptions() {
    const inscriptions = await this.inscriptionRepo.find();
    console.log(inscriptions);
    return inscriptions;
  }

  findInscriptionByMatricule(matricule: string) {
    return this.inscriptionRepo.findOne({ where: { matricule } });
  }

  async findAllCours() {
    return await this.coursRepo.find();
  }

  findCoursByMnemonique(mnemonique: string) {
    return this.coursRepo.findOne({ where: { mnemonique } });
  }

  findNotesByMatricule(matricule: string) {
    return this.noteRepo.find({ where: { matricule } });
  }

  findNotesByMnemonique(mnemonique: string) {
    return this.noteRepo.find({ where: { mnemonique } });
  }

  // Exemple d'extraction des cours au format JSON parsé
  async getCoursInscription(matricule: string) {
    const inscription = await this.findInscriptionByMatricule(matricule);
    if (!inscription) return null;
    try {
      return JSON.parse(inscription.cours_json);
    } catch {
      return null;
    }
  }
}
