import { categoria } from './categoria';

export class Libro {
  id: number | null;
  titulo: string;
  autor: string;
  isbn: string;
  disponible?: boolean;
  editorial?: string;
  anioPublicacion?: number | null;
  cantidadEjemplares?: number;
  photoUrl?: string | null;
  fechaCreacion?: string;
  fechaModificacion?: string;
  categoria: categoria;
}

export type libro = Libro;
