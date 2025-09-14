import { Injectable } from "@nestjs/common";
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GeneralService {
    constructor(private httpService: HttpService) {}


    async fetchAllData() {

    const inscriptionsPromise = lastValueFrom(this.httpService.get('https://b0s0kwos00g48ow8cg0skg4w.89.116.111.143.sslip.io/inscriptions'));
    const coursPromise = lastValueFrom(this.httpService.get('https://b0s0kwos00g48ow8cg0skg4w.89.116.111.143.sslip.io/cours'));
    const notesPromise = lastValueFrom(this.httpService.get('https://b0s0kwos00g48ow8cg0skg4w.89.116.111.143.sslip.io/notes'));

    const [inscriptions, cours, notes] = await Promise.all([
      inscriptionsPromise,
      coursPromise,
      notesPromise,
    ]);
    
    return {
      inscriptions: inscriptions.data,
      cours: cours.data,
      notes: notes.data,
    };
  }
}