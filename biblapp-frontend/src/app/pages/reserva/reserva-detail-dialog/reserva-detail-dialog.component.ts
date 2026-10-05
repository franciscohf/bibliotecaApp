import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { Reserva } from '../../../model/reserva';

@Component({
  selector: 'app-reserva-detail-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatCardModule,
    DatePipe,
  ],
  template: `
    <div class="dialog-header">
      <div class="dialog-title-group">
        <mat-icon color="primary" class="header-icon">book_online</mat-icon>
        <div>
          <h2 mat-dialog-title class="dialog-title">Detalle de Reserva #{{ data.reserva.id }}</h2>
          <p class="dialog-subtitle">
            Cliente: <strong>{{ data.reserva.cliente.nombres }} {{ data.reserva.cliente.apellidos }}</strong>
            ({{ data.reserva.cliente.cedula }})
          </p>
        </div>
      </div>
      <button mat-icon-button mat-dialog-close aria-label="Cerrar">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="dialog-content">
      <!-- Info Cards -->
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Fecha Reserva</span>
          <span class="value">{{ data.reserva.fechaReserva | date: 'dd/MM/yyyy HH:mm' }}</span>
        </div>
        <div class="info-item">
          <span class="label">Estado</span>
          <mat-chip [class]="'chip-status chip-' + (data.reserva.estado || 'PENDIENTE').toLowerCase()">
            {{ data.reserva.estado || 'PENDIENTE' }}
          </mat-chip>
        </div>
        <div class="info-item">
          <span class="label">Email Cliente</span>
          <span class="value">{{ data.reserva.cliente.email || 'N/A' }}</span>
        </div>
        <div class="info-item">
          <span class="label">Teléfono Cliente</span>
          <span class="value">{{ data.reserva.cliente.telefono || 'N/A' }}</span>
        </div>
      </div>

      @if (data.reserva.observacion) {
        <div class="observacion-box">
          <mat-icon class="obs-icon">notes</mat-icon>
          <div>
            <div class="obs-label">Observaciones</div>
            <div class="obs-text">{{ data.reserva.observacion }}</div>
          </div>
        </div>
      }

      <div class="section-title">
        <mat-icon>menu_book</mat-icon>
        <span>Libros Reservados ({{ data.reserva.detallesReserva.length || 0 }})</span>
      </div>

      <div class="table-responsive">
        <table mat-table [dataSource]="data.reserva.detallesReserva" class="books-table">
          <!-- Portada -->
          <ng-container matColumnDef="foto">
            <th mat-header-cell *matHeaderCellDef>Portada</th>
            <td mat-cell *matCellDef="let item">
              <div class="book-cover-wrapper">
                <img
                  [src]="getPhotoUrl(item.libro.photoUrl)"
                  [alt]="item.libro.titulo"
                  class="book-thumbnail"
                  (error)="onImageError($event)"
                />
              </div>
            </td>
          </ng-container>

          <!-- Titulo -->
          <ng-container matColumnDef="titulo">
            <th mat-header-cell *matHeaderCellDef>Título</th>
            <td mat-cell *matCellDef="let item">
              <div class="book-title">{{ item.libro.titulo }}</div>
              @if (item.libro.editorial) {
                <div class="book-editorial">{{ item.libro.editorial }}</div>
              }
            </td>
          </ng-container>

          <!-- Autor -->
          <ng-container matColumnDef="autor">
            <th mat-header-cell *matHeaderCellDef>Autor</th>
            <td mat-cell *matCellDef="let item">{{ item.libro.autor }}</td>
          </ng-container>

          <!-- Categoria -->
          <ng-container matColumnDef="categoria">
            <th mat-header-cell *matHeaderCellDef>Categoría</th>
            <td mat-cell *matCellDef="let item">
              <span class="category-badge">{{ item.libro.categoria?.nombre || 'General' }}</span>
            </td>
          </ng-container>

          <!-- ISBN -->
          <ng-container matColumnDef="isbn">
            <th mat-header-cell *matHeaderCellDef>ISBN</th>
            <td mat-cell *matCellDef="let item">
              <code>{{ item.libro.isbn }}</code>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-flat-button color="primary" [mat-dialog-close]="true">
        Cerrar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }
    .dialog-title-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .header-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }
    .dialog-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #0f172a;
    }
    .dialog-subtitle {
      margin: 0.2rem 0 0 0;
      font-size: 0.875rem;
      color: #64748b;
    }
    .dialog-content {
      padding: 1.5rem;
      max-height: 75vh;
      overflow-y: auto;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      background: #f8fafc;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.25rem;
      border: 1px solid #e2e8f0;
    }
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .label {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 600;
      color: #64748b;
      letter-spacing: 0.05em;
    }
    .value {
      font-size: 0.95rem;
      font-weight: 500;
      color: #1e293b;
    }
    .observacion-box {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 8px;
      margin-bottom: 1.25rem;
    }
    .obs-icon {
      color: #d97706;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }
    .obs-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #92400e;
      text-transform: uppercase;
    }
    .obs-text {
      font-size: 0.875rem;
      color: #78350f;
      margin-top: 0.15rem;
    }
    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.75rem;
    }
    .table-responsive {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .books-table {
      width: 100%;
    }
    .book-cover-wrapper {
      width: 40px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      overflow: hidden;
      background: #f1f5f9;
    }
    .book-thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .book-title {
      font-weight: 600;
      color: #0f172a;
    }
    .book-editorial {
      font-size: 0.75rem;
      color: #64748b;
    }
    .category-badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .chip-status {
      font-size: 0.75rem !important;
      font-weight: 600 !important;
      border-radius: 16px !important;
      padding: 0 10px !important;
      min-height: 24px !important;
      width: fit-content;
    }
    .chip-pendiente {
      background-color: #fef3c7 !important;
      color: #b45309 !important;
      border: 1px solid #fde68a !important;
    }
    .chip-confirmada {
      background-color: #e0f2fe !important;
      color: #0369a1 !important;
      border: 1px solid #bae6fd !important;
    }
    .chip-completada {
      background-color: #e8f5e9 !important;
      color: #2e7d32 !important;
      border: 1px solid #c8e6c9 !important;
    }
    .chip-cancelada {
      background-color: #fee2e2 !important;
      color: #b91c1c !important;
      border: 1px solid #fecaca !important;
    }
    .dialog-actions {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e2e8f0;
    }
  `],
})
export class ReservaDetailDialogComponent {
  readonly data: { reserva: Reserva } = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ReservaDetailDialogComponent>);

  readonly columns = ['foto', 'titulo', 'autor', 'categoria', 'isbn'];

  getPhotoUrl(photoUrl?: string | null): string {
    return photoUrl && photoUrl.trim() !== '' ? photoUrl : 'default-book.svg';
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'default-book.svg';
  }
}
