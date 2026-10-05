import { Service, signal } from "@angular/core";
import { categoria } from "../model/categoria";
import { form, maxLength, minLength, required } from "@angular/forms/signals";

const emptyCategoria = (): categoria => ({
    id: null,
    nombre: '',
    descripcion: '',
    estado:true
});

@Service({autoProvided: false})
export class CategoriaForm {

    readonly $model = signal<categoria>(emptyCategoria());

    readonly $form = form(this.$model, (path) => {
        required(path.nombre);
        minLength(path.nombre, 3);
        maxLength(path.nombre, 100);

        required(path.descripcion);
        minLength(path.descripcion, 3);
        maxLength(path.descripcion, 500);
  });

  readonly isInvalid = () => this.$form().invalid();

  setEstado(estado: boolean){
    this.$model.update(cat => ({ ...cat, estado }));
  }

  patch(categoria: categoria){
    this.$model.set(categoria);
  }

  value(){
    return this.$model();
  }

  reset(){
    this.$model.set(emptyCategoria());
  }
}
