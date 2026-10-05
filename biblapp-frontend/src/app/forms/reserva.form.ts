import { Service, signal } from '@angular/core';
import { form, maxLength, required } from '@angular/forms/signals';
import { Cliente } from '../model/cliente';
import { Libro } from '../model/libro';
import { DetalleReserva, EstadoReserva, Reserva } from '../model/reserva';

const nowIso = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const emptyReserva = (): Reserva => ({
  id: null,
  fechaReserva: nowIso(),
  estado: 'PENDIENTE',
  observacion: '',
  cliente: {
    id: null,
    nombres: '',
    apellidos: '',
    cedula: '',
    email: '',
    telefono: '',
    estado: true,
  },
  detallesReserva: [],
});

@Service({ autoProvided: false })
export class ReservaForm {
  readonly $model = signal<Reserva>(emptyReserva());

  readonly $form = form(this.$model, (path) => {
    required(path.fechaReserva);
    maxLength(path.observacion, 500);
  });

  readonly isInvalid = () => {
    const model = this.$model();
    const hasCliente = Boolean(model.cliente && model.cliente.id && model.cliente.id > 0);
    const hasLibros = Boolean(model.detallesReserva && model.detallesReserva.length > 0);
    const hasFecha = Boolean(model.fechaReserva);
    return this.$form().invalid() || !hasCliente || !hasLibros || !hasFecha;
  };

  setCliente(cliente: Cliente) {
    this.$model.update((r) => ({ ...r, cliente }));
  }

  setFechaReserva(fecha: string) {
    this.$model.update((r) => ({ ...r, fechaReserva: fecha }));
  }

  setObservacion(observacion: string) {
    this.$model.update((r) => ({ ...r, observacion }));
  }

  setEstado(estado: EstadoReserva) {
    this.$model.update((r) => ({ ...r, estado }));
  }

  addLibro(libro: Libro): boolean {
    const current = this.$model();
    const exists = current.detallesReserva.some((d) => d.libro.id === libro.id);
    if (exists) {
      return false;
    }
    const nuevoDetalle: DetalleReserva = {
      id: null,
      libro,
    };
    this.$model.update((r) => ({
      ...r,
      detallesReserva: [...r.detallesReserva, nuevoDetalle],
    }));
    return true;
  }

  removeLibro(libroId: number) {
    this.$model.update((r) => ({
      ...r,
      detallesReserva: r.detallesReserva.filter((d) => d.libro.id !== libroId),
    }));
  }

  patch(reserva: Reserva) {
    this.$model.set({
      ...reserva,
      fechaReserva: reserva.fechaReserva ? reserva.fechaReserva.slice(0, 16) : nowIso(),
      detallesReserva: reserva.detallesReserva || [],
      observacion: reserva.observacion || '',
    });
  }

  value(): Reserva {
    return this.$model();
  }

  reset() {
    this.$model.set(emptyReserva());
  }
}
