import { Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { EstadoReserva, Reserva } from '../model/reserva';
import { GenericService } from './generic.service';

@Service()
export class ReservaService extends GenericService<Reserva> {
  protected override url = `${environment.HOST}/v1/reserva`;

  cambiarEstado(id: number, estado: EstadoReserva) {
    return this.http.patch<Reserva>(`${this.url}/${id}/estado`, null, {
      params: { estado },
    });
  }

  searchByOthers(filter: { cedula?: string | null; fullname?: string | null }) {
    return this.http.post<Reserva[]>(`${this.url}/search/others`, filter);
  }

  searchDates(date1: string, date2: string) {
    return this.http.get<Reserva[]>(`${this.url}/search/dates`, {
      params: { date1, date2 },
    });
  }

  searchByDates(date1: string, date2: string) {
    return this.searchDates(date1, date2);
  }
}
