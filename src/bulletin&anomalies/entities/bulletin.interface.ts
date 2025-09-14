export type BulletinDetail = {
  mnemonique: any;
  intitule: string;
  credit: number;
  titulaire: string;
  note: string;
};

export type Bulletin = {
  matricule: any;
  nom: string;
  prenom: string;
  annee: string;
  ects_total_inscrits: number;
  ects_obtenus: number;
  moyenne_ponderee: number | null;
  reussite: boolean;
  details: BulletinDetail[];
};