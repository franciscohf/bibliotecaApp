import { computed, inject, Service, signal } from '@angular/core';
import { ReservaService } from '../services/reserva.service';
import { httpResource } from '@angular/common/http';
import { Reserva } from '../model/reserva';

@Service({ autoProvided: false })
export class ReservaEditStore {
  private readonly reservaService = inject(ReservaService);
  readonly $id = signal<number | null>(null);

  private readonly $reservaRequest = computed(() => {
    const id = this.$id();
    return id ? `${this.reservaService.resourceUrl}/${id}` : undefined;
  });

  readonly reservaResource = httpResource<Reserva>(() => this.$reservaRequest());

  setId(id: number | null) {
    this.$id.set(id);
  }
}
