import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LibroStore } from '../../../store/libro.store';
import { LibroService } from '../../../services/libro.service';
import { LibroEditStore } from '../../../store/libro-edit.store';
import { LibroForm } from '../../../forms/libro.form';
import { Libro } from '../../../model/libro';
import { categoria } from '../../../model/categoria';
import { CategoriaService } from '../../../services/categoria.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-libro-edit',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatSelectModule,
    FormRoot,
    FormField,
    RouterLink,
  ],
  styleUrl: './libro-edit.component.css',
  templateUrl: './libro-edit.component.html',
  providers: [LibroForm, LibroEditStore, LibroStore],
})
export class LibroEditComponent {
  protected readonly libroForm = inject(LibroForm);
  private readonly route = inject(ActivatedRoute);
  private readonly libroEditStore = inject(LibroEditStore);
  private readonly libroStore = inject(LibroStore);
  private readonly libroService = inject(LibroService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  private readonly $params = toSignal(this.route.params, { initialValue: {} });

  protected readonly $isSaving = signal(false);
  protected readonly $isLoading = computed(
    () => this.libroEditStore.libroResource.isLoading?.() ?? false,
  );

  protected readonly $id = computed(() => {
    const id = this.$params()['id'];
    return id ? Number(id) : null;
  });
  protected readonly $isEdit = computed(() => this.$id() !== null);

  protected readonly $categories = signal<categoria[]>([]);
  protected readonly $selectedFile = signal<File | null>(null);
  protected readonly $filePreview = signal<string | null>(null);
  protected readonly $fileError = signal<string | null>(null);

  protected readonly currentPhotoUrl = computed(() => {
    const preview = this.$filePreview();
    if (preview) return preview;
    const modelUrl = this.libroForm.value().photoUrl;
    if (modelUrl && modelUrl.trim() !== '') return modelUrl;
    return '/default-book.svg';
  });

  constructor() {
    this.categoriaService.findAll().subscribe({
      next: (cats) => this.$categories.set(cats || []),
    });

    effect(() => {
      this.libroEditStore.setId(this.$id());
    });

    effect(() => {
      if (this.libroEditStore.libroResource.hasValue()) {
        const data = this.libroEditStore.libroResource.value();
        if (data) {
          this.libroForm.patch(data);
        }
      }
    });
  }

  onDisponibleChange(checked: boolean) {
    this.libroForm.setDisponible(checked);
  }

  onCategoriaSelect(categoriaId: number) {
    const selected = this.$categories().find((c) => c.id === categoriaId);
    if (selected) {
      this.libroForm.setCategoria(selected);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.$fileError.set(null);

    // Validate type image/*
    if (!file.type.startsWith('image/')) {
      this.$fileError.set('El archivo seleccionado debe ser una imagen (image/*)');
      return;
    }

    // Validate size <= 2MB
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      this.$fileError.set('La imagen excede el límite máximo de 2MB');
      return;
    }

    this.$selectedFile.set(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.$filePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeSelectedFile() {
    this.$selectedFile.set(null);
    this.$filePreview.set(null);
    this.$fileError.set(null);
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/default-book.svg';
  }

  operate() {
    if (this.libroForm.isInvalid()) return;

    this.$isSaving.set(true);
    const isEdit = this.$isEdit();
    const id = this.$id();
    const libroData: Libro = this.libroForm.value();
    const file = this.$selectedFile();

    const operation$ = isEdit
      ? this.libroService.updateWithPhoto(id!, libroData, file)
      : this.libroService.saveWithPhoto(libroData, file);

    operation$.subscribe({
      next: () => {
        this.libroStore.reload();
        this.notificationService.notify(isEdit ? 'Libro actualizado con éxito' : 'Libro creado con éxito');
        this.router.navigate(['/pages/libro']);
      },
      error: (err) => {
        this.$isSaving.set(false);
        const errMsg = err?.error?.message || 'Error al guardar el libro';
        this.notificationService.notify(errMsg);
      },
    });
  }
}
