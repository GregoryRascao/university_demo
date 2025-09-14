import { Injectable } from '@nestjs/common';
import { GeneralService } from './generalService.service';
import { Bulletin } from '../entities/bulletin.interface';
import { AnomalyReport } from '../entities/anomalie.interface';

@Injectable()
export class BulletinService {
  constructor(
    private readonly generalService: GeneralService
) {}


  async buildBulletins() {
    const { inscriptions, cours, notes } = await this.generalService.fetchAllData();
    const bulletins: Bulletin[] = [];

    for (const inscription of inscriptions) {
      const coursSuivis = safeJsonParse(inscription.cours_json);

      const notesEtudiant = notes.filter(n => n.matricule === inscription.matricule);

      // Filtrer les cours existant
      const details = coursSuivis.map(mnemo => {
        const coursInfo = cours.find(c => c.mnemonique === mnemo);
        const noteObj = notesEtudiant.find(n => n.mnemonique === mnemo);
        return {
          mnemonique: mnemo,
          intitule: coursInfo?.intitule ?? null,
          credit: coursInfo?.credit ?? null,
          titulaire: coursInfo?.titulaire ?? null,
          note: noteObj ? noteObj.note : null,
        };
      }).sort((a, b) => a.mnemonique.localeCompare(b.mnemonique));

      // Calculs
      const ects_total_inscrits = details.reduce((a, c) => a + (c.credit || 0), 0);
      const obtenus = details.filter(c => (c.note !== null && c.note >= 10 && c.credit)).map(c => c.credit || 0);
      const ects_obtenus = obtenus.reduce((a, c) => a + c, 0);

      const weightedNotes = details.filter(c => c.note !== null && c.credit)
        .map(c => ({ note: c.note, credit: c.credit }));
      const moyenne_ponderee = weightedNotes.length
        ? weightedNotes.reduce((a, c) => a + c.note * c.credit, 0)
          / weightedNotes.reduce((a, c) => a + c.credit, 0)
        : null;

      const allCoursesHaveNotes = details.every(c => c.note !== null);
      const reussite = (ects_obtenus >= 60)
        || (allCoursesHaveNotes && moyenne_ponderee !== null && moyenne_ponderee >= 10);

      bulletins.push({
        matricule: inscription.matricule,
        nom: inscription.nom,
        prenom: inscription.prenom,
        annee: inscription.annee_etude,
        ects_total_inscrits,
        ects_obtenus,
        moyenne_ponderee: moyenne_ponderee ? +moyenne_ponderee.toFixed(2) : null,
        reussite,
        details,
      });
    }
    return bulletins;
  }

  async anomaliesReport() {
    const { inscriptions, cours, notes } = await this.generalService.fetchAllData();
    const report: AnomalyReport[] = [];

    // NOTE_SANS_INSCRIPTION
    for (const n of notes) {
      const insc = inscriptions.find(i => i.matricule === n.matricule);
      if (!insc) continue;
      const coursSuivis = safeJsonParse(insc.cours_json);
      if (!coursSuivis.includes(n.mnemonique)) {
        report.push({
          type: 'NOTE_SANS_INSCRIPTION',
          matricule: n.matricule,
          annee: insc.annee_etude,
          detail: `note présente pour le cours ${n.mnemonique}, non inscrit dans cours_json`
        });
      }
    }

    // COURS_INCONNU
    for (const i of inscriptions) {
      const coursSuivis = safeJsonParse(i.cours_json);
      for (const mnem of coursSuivis) {
        if (!cours.find(c => c.mnemonique === mnem)) {
          report.push({
            type: 'COURS_INCONNU',
            matricule: i.matricule,
            annee: i.annee_etude,
            detail: `Cours ${mnem} absent de liste_cours`
          });
        }
      }
    }

    // INSCRIPTION_SANS_COURS
    for (const i of inscriptions) {
      if (!i.cours_json || safeJsonParse(i.cours_json).length === 0) {
        report.push({
          type: 'INSCRIPTION_SANS_COURS',
          matricule: i.matricule,
          annee: i.annee_etude,
          detail: `cours_json vide`
        });
      }
    }

    // DUPLICATA_NOTE
    const noteKeys = notes.map(n => `${n.matricule}|${n.mnemonique}`);
    const dups = noteKeys.filter((key, idx) => noteKeys.indexOf(key) !== idx);
    Array.from(new Set(dups) as Set<string>).forEach((key: string) => {
      const [matricule, mnemonique] = key.split('|');
      report.push({
        type: 'DUPLICATA_NOTE',
        matricule,
        annee: inscriptions.find(i => i.matricule === matricule)?.annee_etude,
        detail: `plusieurs notes pour le même cours (${mnemonique})`
      });
    });

    // NOTE_SANS_CREDIT
    for (const n of notes) {
      const coursObj = cours.find(c => c.mnemonique === n.mnemonique);
      if (!coursObj || !coursObj.credit || coursObj.credit <= 0) {
        report.push({
          type: 'NOTE_SANS_CREDIT',
          matricule: n.matricule,
          annee: inscriptions.find(i => i.matricule === n.matricule)?.annee_etude,
          detail: `cours noté ${n.mnemonique} mais crédit manquant ou ≤ 0`
        });
      }
    }

    return report;
  }
}

function safeJsonParse(s: string): string[] {
  if (!s) return [];
  try {
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
