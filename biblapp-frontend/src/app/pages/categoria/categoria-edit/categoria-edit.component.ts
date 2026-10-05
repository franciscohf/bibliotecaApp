import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CategoriaForm } from '../../../forms/categoria.form';
import { FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaStore } from '../../../store/categoria.store';
import { CategoriaService } from '../../../services/categoria.service';
import { categoria } from '../../../model/categoria';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoriaEditStore } from '../../../store/categoria-edit.store';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-categoria-edit',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    FormRoot,
    FormField,
    RouterLink,
  ],
  styleUrl: './categoria-edit.component.css',
  templateUrl: './categoria-edit.component.html',
  providers: [CategoriaForm, CategoriaEditStore],
})
export class CategoriaEditComponent {
  protected readonly categoriaForm = inject(CategoriaForm);
  private readonly route = inject(ActivatedRoute);
  private readonly categoriaEditStore = inject(CategoriaEditStore);
  private readonly categoriaStore = inject(CategoriaStore);
  private readonly categoriaService = inject(CategoriaService);

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  protected readonly $isSaving = signal(false);
  protected readonly $isLoading = computed(
    () => this.categoriaEditStore.categoriaResource.isLoading?.() ?? false
  );

  protected readonly $id = computed(() => {
    const id = this.$params()['id'];
    return id ? Number(id) : null;
  });
  protected readonly $isEdit = computed(() => this.$id() !== null);

  constructor() {
    effect(() => {
      this.categoriaEditStore.setId(this.$id());
    });

    effect(() => {
      if (this.categoriaEditStore.categoriaResource.hasValue()) {
        const data = this.categoriaEditStore.categoriaResource.value();
        if (data) {
          this.categoriaForm.patch(data);
        }
      }
    });
  }

  onEstadoChange(checked: boolean) {
    this.categoriaForm.setEstado(checked ? true : false);
  }

  operate() {
    if (this.categoriaForm.isInvalid()) return;

    this.$isSaving.set(true);
    const isEdit = this.$isEdit();
    const id = this.$id();
    const categoriaData: categoria = this.categoriaForm.value();

    const operation$ = isEdit
      ? this.categoriaService.update(id!, categoriaData)
      : this.categoriaService.save(categoriaData);

    operation$.subscribe({
      next: () => {
        this.categoriaStore.reload();
        this.notificationService.notify(isEdit ? 'UPDATED' : 'CREATED');
        this.router.navigate(['/pages/categoria']);
      },
      error: () => {
        this.$isSaving.set(false);
      },
    });
  }
}
