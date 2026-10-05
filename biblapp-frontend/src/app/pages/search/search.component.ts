import { Component, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Reserva } from '../../model/reserva';
import { ReservaService } from '../../services/reserva.service';
import { SearchStore } from '../../store/search.store';
import { SearchForm } from '../../forms/search.form';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';

@Component({
  selector: 'app-search',
  imports: [
    MatTableModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatDialogModule,
    MatTooltipModule,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  providers: [SearchStore, SearchForm, ReservaService, provideNativeDateAdapter()],
})
export class SearchComponent {
  private readonly store = inject(SearchStore);
  readonly form = inject(SearchForm);
  private readonly dialog = inject(MatDialog);

  activeTab = 0;
  readonly hasSearched = signal(false);

  readonly dataSource = new MatTableDataSource<Reserva>([]);
  readonly $loading = this.store.$loading;
  readonly $error = this.store.$error;

  readonly displayedColumns: string[] = [
    'id',
    'cliente',
    'cedula',
    'fechaReserva',
    'estado',
    'libros',
    'actions',
  ];

  constructor() {
    effect(() => {
      const data = this.store.$reservaData();
      this.dataSource.data = data;
    });
  }

  onTabChange(index: number) {
    this.activeTab = index;
  }

  search() {
    this.hasSearched.set(true);

    if (this.activeTab === 0) {
      // Tab 0: Búsqueda por cliente
      const cedula = this.form.cedula()?.trim() || null;
      const rawFullname = this.form.fullname()?.trim() || null;
      const fullname = rawFullname ? rawFullname.toLowerCase() : null;

      this.store.searchByOthers({
        cedula,
        fullname,
      });
    } else {
      // Tab 1: Búsqueda por rango de fechas
      const start = this.form.startDate();
      const end = this.form.endDate();

      if (!start || !end) {
        return;
      }

      const date1 = this.formatDateToIso(start, false);
      const date2 = this.formatDateToIso(end, true);

      this.store.searchByDates(date1, date2);
    }
  }

  clearFilters() {
    this.form.reset();
    this.store.clear();
    this.hasSearched.set(false);
  }

  openDetail(reserva: Reserva) {
    this.dialog.open(SearchDialogComponent, {
      width: '800px',
      data: reserva,
    });
  }

  private formatDateToIso(date: Date, isEndOfDay: boolean): string {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = isEndOfDay ? '23' : '00';
    const minutes = isEndOfDay ? '59' : '00';
    const seconds = isEndOfDay ? '59' : '00';
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
}
