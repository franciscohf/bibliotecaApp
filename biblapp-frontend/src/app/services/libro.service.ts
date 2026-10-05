import { Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Libro } from '../model/libro';
import { GenericService } from './generic.service';

@Service()
export class LibroService extends GenericService<Libro> {
  protected override url = `${environment.HOST}/v1/libro`;

  saveWithPhoto(libro: Libro, file?: File | null) {
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(libro)], { type: 'application/json' });
    formData.append('libro', blob);
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<Libro>(this.url, formData);
  }

  updateWithPhoto(id: number, libro: Libro, file?: File | null) {
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(libro)], { type: 'application/json' });
    formData.append('libro', blob);
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<Libro>(`${this.url}/${id}`, formData);
  }
}
