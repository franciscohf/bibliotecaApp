import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map, startWith, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

import { EstadoReserva, Reserva } from '../../model/reserva';
import { ReservaService } from '../../services/reserva.service';
import { ReservaStore } from '../../store/reserva.store';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../shared/services/notification.service';
import { ReservaDetailDialogComponent } from './reserva-detail-dialog/reserva-detail-dialog.component';

@Component({
  selector: 'app-reserva',
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
    RouterOutlet,
    RouterLink,
    MatDialogModule,
    DatePipe,
  ],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css',
  providers: [ReservaStore],
})
export class ReservaComponent {
  private readonly reservaStore = inject(ReservaStore);
  private readonly router = inject(Router);
  private readonly reservaService = inject(ReservaService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);

  protected readonly dataSource = new MatTableDataSource<Reserva>();
  protected readonly $paginator = viewChild(MatPaginator);
  protected readonly $sort = viewChild(MatSort);

  protected readonly $reservas = this.reservaStore.$reservas;
  protected readonly $loading = this.reservaStore.$loading;
  protected readonly $error = this.reservaStore.$error;

  private readonly $url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    )
  );

  protected displayedColumns: string[] = [
    'id',
    'cliente',
    'fechaReserva',
    'libros',
    'estado',
    'observacion',
    'actions',
  ];

  constructor() {
    this.setupTableEffect();
    this.setupNotificationEffect();
    this.setupFilterPredicate();
  }

  private setupTableEffect() {
    effect(() => {
      const data = this.$reservas();
      const p = this.$paginator();
      const s = this.$sort();

      this.dataSource.data = data;
      this.dataSource.paginator = p;
      this.dataSource.sort = s;
    });
  }

  private setupNotificationEffect() {
    effect(() => {
      const message = this.notificationService.$message();
      if (message) {
        this.snackBar.open(message, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.notificationService.clear();
      }
    });
  }

  private setupFilterPredicate() {
    this.dataSource.filterPredicate = (data: Reserva, filter: string) => {
      const clienteName = `${data.cliente?.nombres || ''} ${data.cliente?.apellidos || ''}`.toLowerCase();
      const cedula = (data.cliente?.cedula || '').toLowerCase();
      const estado = (data.estado || '').toLowerCase();
      const observacion = (data.observacion || '').toLowerCase();
      const id = String(data.id || '');

      return (
        clienteName.includes(filter) ||
        cedula.includes(filter) ||
        estado.includes(filter) ||
        observacion.includes(filter) ||
        id.includes(filter)
      );
    };
  }

  applyFilter(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  protected readonly hasChildActive = computed(
    () =>
      this.$url().startsWith('/pages/reserva/new') ||
      this.$url().startsWith('/pages/reserva/edit/')
  );

  openDetail(reserva: Reserva) {
    this.dialog.open(ReservaDetailDialogComponent, {
      width: '750px',
      data: { reserva },
    });
  }

  cambiarEstado(reserva: Reserva, nuevoEstado: EstadoReserva) {
    if (!reserva.id) return;
    this.reservaService.cambiarEstado(reserva.id, nuevoEstado).subscribe({
      next: () => {
        this.notificationService.notify(`Estado actualizado a ${nuevoEstado}`);
        this.reservaStore.reload();
      },
      error: () => {
        this.snackBar.open('Error al cambiar el estado de la reserva', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  delete(id: number) {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.reservaService.delete(id)),
        tap(() => this.notificationService.notify('Reserva eliminada con éxito'))
      )
      .subscribe(() => this.reservaStore.reload());
  }
}
