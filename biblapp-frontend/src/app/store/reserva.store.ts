import { inject, Service } from '@angular/core';
import { ReservaService } from '../services/reserva.service';
import { httpResource } from '@angular/common/http';
import { Reserva } from '../model/reserva';

@Service({ autoProvided: false })
export class ReservaStore {
  private readonly reservaService = inject(ReservaService);

  readonly reservaResource = httpResource<Reserva[]>(
    () => this.reservaService.resourceUrl,
    { defaultValue: [] }
  );

  readonly $reservas = this.reservaResource.value;
  readonly $loading = this.reservaResource.isLoading;
  readonly $error = this.reservaResource.error;

  reload() {
    this.reservaResource.reload();
  }
}
