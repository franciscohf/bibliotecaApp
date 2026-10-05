import { Service, signal } from "@angular/core";
import { Cliente } from "../model/cliente";
import { email, form, maxLength, minLength, required } from "@angular/forms/signals";

const emptyCliente = (): Cliente => ({
  id: null,
  nombres: '',
  apellidos: '',
  cedula: '',
  email: '',
  telefono: '',
  estado: true,
});

@Service({ autoProvided: false })
export class ClienteForm {

  readonly $model = signal<Cliente>(emptyCliente());

  readonly $form = form(this.$model, (path) => {
    required(path.nombres);
    minLength(path.nombres, 2);
    maxLength(path.nombres, 100);

    required(path.apellidos);
    minLength(path.apellidos, 2);
    maxLength(path.apellidos, 100);

    required(path.cedula);
    minLength(path.cedula, 5);
    maxLength(path.cedula, 30);

    required(path.email);
    email(path.email);
    maxLength(path.email, 150);

    required(path.telefono);
    minLength(path.telefono, 6);
    maxLength(path.telefono, 30);
  });

  readonly isInvalid = () => this.$form().invalid();

  setEstado(estado: boolean) {
    this.$model.update(c => ({ ...c, estado }));
  }

  patch(cliente: Cliente) {
    this.$model.set(cliente);
  }

  value() {
    return this.$model();
  }

  reset() {
    this.$model.set(emptyCliente());
  }
}
