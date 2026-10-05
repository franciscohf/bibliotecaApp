import { Service, signal } from '@angular/core';
import { Libro } from '../model/libro';
import { categoria } from '../model/categoria';
import { form, maxLength, minLength, required } from '@angular/forms/signals';

const emptyLibro = (): Libro => ({
  id: null,
  titulo: '',
  autor: '',
  isbn: '',
  disponible: true,
  editorial: '',
  anioPublicacion: new Date().getFullYear(),
  cantidadEjemplares: 1,
  photoUrl: null,
  categoria: {
    id: 0,
    nombre: '',
    descripcion: '',
    estado: true,
  },
});

@Service({ autoProvided: false })
export class LibroForm {
  readonly $model = signal<Libro>(emptyLibro());

  readonly $form = form(this.$model, (path) => {
    required(path.titulo);
    minLength(path.titulo, 1);
    maxLength(path.titulo, 200);

    required(path.autor);
    minLength(path.autor, 1);
    maxLength(path.autor, 150);

    required(path.isbn);
    minLength(path.isbn, 1);
    maxLength(path.isbn, 20);
  });

  readonly isInvalid = () => {
    const model = this.$model();
    const hasCategory = model.categoria && model.categoria.id && model.categoria.id > 0;
    return this.$form().invalid() || !hasCategory;
  };

  setDisponible(disponible: boolean) {
    this.$model.update((l) => ({ ...l, disponible }));
  }

  setCategoria(cat: categoria) {
    this.$model.update((l) => ({ ...l, categoria: cat }));
  }

  setPhotoUrl(photoUrl: string | null) {
    this.$model.update((l) => ({ ...l, photoUrl }));
  }

  patch(libro: Libro) {
    this.$model.set({
      ...libro,
      categoria: libro.categoria || { id: 0, nombre: '', descripcion: '', estado: true },
    });
  }

  value(): Libro {
    return this.$model();
  }

  reset() {
    this.$model.set(emptyLibro());
  }
}
