import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ClienteForm } from '../../../forms/cliente.form';
import { FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteStore } from '../../../store/cliente.store';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../model/cliente';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClienteEditStore } from '../../../store/cliente-edit.store';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-cliente-edit',
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
  styleUrl: './cliente-edit.component.css',
  templateUrl: './cliente-edit.component.html',
  providers: [ClienteForm, ClienteEditStore],
})
export class ClienteEditComponent {
  protected readonly clienteForm = inject(ClienteForm);
  private readonly route = inject(ActivatedRoute);
  private readonly clienteEditStore = inject(ClienteEditStore);
  private readonly clienteStore = inject(ClienteStore);
  private readonly clienteService = inject(ClienteService);

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  protected readonly $isSaving = signal(false);
  protected readonly $isLoading = computed(
    () => this.clienteEditStore.clienteResource.isLoading?.() ?? false
  );

  protected readonly $id = computed(() => {
    const id = this.$params()['id'];
    return id ? Number(id) : null;
  });
  protected readonly $isEdit = computed(() => this.$id() !== null);

  constructor() {
    effect(() => {
      this.clienteEditStore.setId(this.$id());
    });

    effect(() => {
      if (this.clienteEditStore.clienteResource.hasValue()) {
        const data = this.clienteEditStore.clienteResource.value();
        if (data) {
          this.clienteForm.patch(data);
        }
      }
    });
  }

  onEstadoChange(checked: boolean) {
    this.clienteForm.setEstado(checked ? true : false);
  }

  operate() {
    if (this.clienteForm.isInvalid()) return;

    this.$isSaving.set(true);
    const isEdit = this.$isEdit();
    const id = this.$id();
    const clienteData: Cliente = this.clienteForm.value();

    const operation$ = isEdit
      ? this.clienteService.update(id!, clienteData)
      : this.clienteService.save(clienteData);

    operation$.subscribe({
      next: () => {
        this.clienteStore.reload();
        this.notificationService.notify(isEdit ? 'UPDATED' : 'CREATED');
        this.router.navigate(['/pages/cliente']);
      },
      error: () => {
        this.$isSaving.set(false);
      },
    });
  }
}
