import { Cliente } from './cliente';
import { Libro } from './libro';

export type EstadoReserva = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';

export interface DetalleReserva {
  id?: number | null;
  libro: Libro;
}

export interface Reserva {
  id?: number | null;
  fechaReserva: string;
  estado?: EstadoReserva;
  observacion?: string | null;
  fechaCreacion?: string;
  cliente: Cliente;
  detallesReserva: DetalleReserva[];
}
