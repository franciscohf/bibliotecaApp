import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { Reserva } from '../../../model/reserva';

@Component({
  selector: 'app-search-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    DatePipe,
  ],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.css',
})
export class SearchDialogComponent {
  private readonly injectedData: any = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<SearchDialogComponent>);

  readonly reserva: Reserva = this.injectedData?.reserva ?? this.injectedData;
  readonly columns = ['foto', 'titulo', 'autor', 'categoria', 'isbn'];

  getPhotoUrl(photoUrl?: string | null): string {
    return photoUrl && photoUrl.trim() !== '' ? photoUrl : 'default-book.svg';
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'default-book.svg';
  }
}
