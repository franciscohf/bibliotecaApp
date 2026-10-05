import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Cliente } from '../../../model/cliente';
import { Libro } from '../../../model/libro';
import { DetalleReserva, Reserva } from '../../../model/reserva';
import { ClienteService } from '../../../services/cliente.service';
import { LibroService } from '../../../services/libro.service';
import { ReservaService } from '../../../services/reserva.service';
import { ReservaStore } from '../../../store/reserva.store';
import { ReservaEditStore } from '../../../store/reserva-edit.store';
import { ReservaForm } from '../../../forms/reserva.form';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-reserva-edit',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatProgressBarModule,
    MatTableModule,
  ],
  templateUrl: './reserva-edit.component.html',
  styleUrl: './reserva-edit.component.css',
  providers: [ReservaForm, ReservaEditStore],
})
export class ReservaEditComponent {
  protected readonly reservaForm = inject(ReservaForm);
  private readonly clienteService = inject(ClienteService);
  private readonly libroService = inject(LibroService);
  private readonly reservaService = inject(ReservaService);
  private readonly reservaStore = inject(ReservaStore);
  private readonly reservaEditStore = inject(ReservaEditStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected readonly $isSaving = signal(false);
  protected readonly selectedLibroId = signal<number | null>(null);

  protected readonly $id = computed(() => {
    const id = this.$params()['id'];
    return id ? Number(id) : null;
  });
  protected readonly $isEdit = computed(() => this.$id() !== null);

  // Load clients and books lists
  protected readonly $allClientes = toSignal(this.clienteService.findAll(), { initialValue: [] });
  protected readonly $allLibros = toSignal(this.libroService.findAll(), { initialValue: [] });

  // Only active clients
  protected readonly $clientesActivos = computed(() =>
    this.$allClientes().filter((c) => c.estado !== false)
  );

  // Available books (disponible === true)
  protected readonly $librosDisponibles = computed(() =>
    this.$allLibros().filter((l) => l.disponible === true)
  );

  protected readonly $model = this.reservaForm.$model;
  protected readonly $selectedCliente = computed(() => this.$model().cliente);
  protected readonly $detalles = computed(() => this.$model().detallesReserva);

  protected readonly displayedColumns = ['foto', 'titulo', 'autor', 'categoria', 'isbn', 'actions'];

  constructor() {
    effect(() => {
      this.reservaEditStore.setId(this.$id());
    });

    effect(() => {
      if (this.reservaEditStore.reservaResource.hasValue()) {
        const data = this.reservaEditStore.reservaResource.value();
        if (data) {
          this.reservaForm.patch(data);
        }
      }
    });
  }

  onClienteSelect(clienteId: number) {
    const cliente = this.$allClientes().find((c) => c.id === clienteId);
    if (cliente) {
      this.reservaForm.setCliente(cliente);
    }
  }

  onFechaChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.reservaForm.setFechaReserva(value);
  }

  onObservacionChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.reservaForm.setObservacion(value);
  }

  agregarLibro() {
    const libroId = this.selectedLibroId();
    if (!libroId) return;

    const libro = this.$allLibros().find((l) => l.id === libroId);
    if (!libro) return;

    if (!libro.disponible) {
      this.snackBar.open('El libro seleccionado no se encuentra disponible', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    const added = this.reservaForm.addLibro(libro);
    if (!added) {
      this.snackBar.open('Este libro ya ha sido agregado a la reserva', 'Cerrar', {
        duration: 3000,
      });
    } else {
      this.selectedLibroId.set(null);
    }
  }

  removerLibro(libroId: number) {
    this.reservaForm.removeLibro(libroId);
  }

  getPhotoUrl(photoUrl?: string | null): string {
    return photoUrl && photoUrl.trim() !== '' ? photoUrl : 'default-book.svg';
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'default-book.svg';
  }

  guardar() {
    if (this.reservaForm.isInvalid()) {
      this.snackBar.open('Complete todos los campos requeridos y agregue al menos un libro', 'Cerrar', {
        duration: 3500,
      });
      return;
    }

    this.$isSaving.set(true);
    const isEdit = this.$isEdit();
    const id = this.$id();
    const payload = this.reservaForm.value();

    const operation$ = isEdit && id
      ? this.reservaService.update(id, payload)
      : this.reservaService.save(payload);

    operation$.subscribe({
      next: () => {
        this.reservaStore.reload();
        this.notificationService.notify(isEdit ? 'Reserva actualizada con éxito' : 'Reserva registrada con éxito');
        this.router.navigate(['/pages/reserva']);
      },
      error: (err) => {
        this.$isSaving.set(false);
        const errorMsg = err?.error?.message || 'Error al guardar la reserva. Verifique los datos.';
        this.snackBar.open(errorMsg, 'Cerrar', { duration: 4000 });
      },
    });
  }
}
