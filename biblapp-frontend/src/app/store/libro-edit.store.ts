import { computed, inject, Service, signal } from '@angular/core';
import { LibroService } from '../services/libro.service';
import { httpResource } from '@angular/common/http';
import { Libro } from '../model/libro';

@Service({ autoProvided: false })
export class LibroEditStore {
  private readonly libroService = inject(LibroService);
  readonly $id = signal<number | null>(null);

  private readonly $libroRequest = computed(() => {
    const id = this.$id();
    return id ? `${this.libroService.resourceUrl}/${id}` : undefined;
  });

  readonly libroResource = httpResource<Libro>(() => this.$libroRequest());

  setId(id: number | null) {
    this.$id.set(id);
  }
}
