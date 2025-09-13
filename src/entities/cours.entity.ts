import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Note } from './note.entity';

@Entity('liste_cours')
export class Cours {
  @PrimaryColumn()
  mnemonique: string;

  @Column()
  intitule: string;

  @Column('int')
  credit: number;

  @Column()
  titulaire: string;

  @OneToMany(() => Note, (note) => note.cours)
  notes: Note[];
}
