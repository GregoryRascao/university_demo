import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Inscription } from './inscription.entity';
import { Cours } from './cours.entity';

@Entity('liste_notes')
export class Note {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  matricule: string;

  @Column()
  mnemonique: string;

  @Column('float')
  note: number;

  @ManyToOne(() => Inscription, (inscription) => inscription.notes)
  @JoinColumn({ name: 'matricule', referencedColumnName: 'matricule' })
  inscription: Inscription;

  @ManyToOne(() => Cours, (cours) => cours.notes)
  @JoinColumn({ name: 'mnemonique', referencedColumnName: 'mnemonique' })
  cours: Cours;
}
