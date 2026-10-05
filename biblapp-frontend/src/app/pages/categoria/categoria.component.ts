import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaStore } from '../../store/categoria.store';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { categoria } from '../../model/categoria';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map, startWith, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../shared/services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatIcon,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
    RouterOutlet,
    RouterLink,
    MatDialogModule,
  ],
  selector: 'app-categoria',
  styleUrl: './categoria.component.css',
  templateUrl: './categoria.component.html',
  providers: [CategoriaStore],
})
export class CategoriaComponent {
  private readonly categoriaStore = inject(CategoriaStore);
  private readonly router = inject(Router);
  private readonly categoriaService = inject(CategoriaService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);

  protected readonly dataSource = new MatTableDataSource<categoria>();
  protected readonly $paginator = viewChild(MatPaginator);
  protected readonly $sort = viewChild(MatSort);

  protected readonly $categoria = this.categoriaStore.$categoria;
  protected readonly $loading = this.categoriaStore.$loading;
  protected readonly $error = this.categoriaStore.$error;

  private readonly $url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
  );

  protected displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'estado', 'actions'];

  constructor() {
    this.setupTableEffect();
    this.setupNotificationEffect();
  }

  private setupTableEffect() {
    effect(() => {
      const data = this.$categoria();
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

  applyFilter(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  protected readonly hasChildActive = computed(
    () =>
      this.$url().startsWith('/pages/categoria/new') ||
      this.$url().startsWith('/pages/categoria/edit/'),
  );

  delete(id: number) {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.categoriaService.delete(id)),
        tap(() => this.notificationService.notify('Categoría eliminada con éxito')),
      )
      .subscribe(() => this.categoriaStore.reload());
  }
}
