import { inject, Injectable, signal } from '@angular/core';
import { ReservaService } from '../services/reserva.service';
import { Reserva } from '../model/reserva';
import { FilterReservaDto } from '../model/filter-reserva-dto';
import { finalize } from 'rxjs';

@Injectable()
export class SearchStore {
  private readonly reservaService = inject(ReservaService);

  readonly $reservaData = signal<Reserva[]>([]);
  readonly $loading = signal<boolean>(false);
  readonly $error = signal<string | null>(null);

  searchByOthers(filter: FilterReservaDto) {
    this.$loading.set(true);
    this.$error.set(null);

    this.reservaService
      .searchByOthers(filter)
      .pipe(finalize(() => this.$loading.set(false)))
      .subscribe({
        next: (data) => {
          this.$reservaData.set(data || []);
        },
        error: (err) => {
          this.$error.set(err?.message || 'Error al consultar reservas');
          this.$reservaData.set([]);
        },
      });
  }

  searchByDates(date1: string, date2: string) {
    this.$loading.set(true);
    this.$error.set(null);

    this.reservaService
      .searchDates(date1, date2)
      .pipe(finalize(() => this.$loading.set(false)))
      .subscribe({
        next: (data) => {
          this.$reservaData.set(data || []);
        },
        error: (err) => {
          this.$error.set(err?.message || 'Error al consultar reservas por fechas');
          this.$reservaData.set([]);
        },
      });
  }

  clear() {
    this.$reservaData.set([]);
    this.$error.set(null);
  }
}
