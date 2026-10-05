import { inject, Service } from '@angular/core';
import { LibroService } from '../services/libro.service';
import { httpResource } from '@angular/common/http';
import { Libro } from '../model/libro';

@Service({ autoProvided: false })
export class LibroStore {
  private readonly libroService = inject(LibroService);

  readonly libroResource = httpResource<Libro[]>(() => this.libroService.resourceUrl, { defaultValue: [] });

  readonly $libro = this.libroResource.value;
  readonly $loading = this.libroResource.isLoading;
  readonly $error = this.libroResource.error;

  reload() {
    this.libroResource.reload();
  }
}
