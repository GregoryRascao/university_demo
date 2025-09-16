import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Note } from './note.entity';

@Entity('liste_inscriptions')
export class Inscription {
  @PrimaryColumn()
  matricule: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @PrimaryColumn()
  annee_etude: number;

  @Column('text')
  cours_json: string; // JSON string, à parser dans le service si besoin

  @OneToMany(() => Note, (note) => note.inscription)
  notes: Note[];
}
