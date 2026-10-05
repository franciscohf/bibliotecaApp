import { inject, Service } from "@angular/core";
import { CategoriaService } from "../services/categoria.service";
import { httpResource } from "@angular/common/http";
import { categoria } from "../model/categoria";

@Service({autoProvided: false})
export class CategoriaStore{

    private readonly categoriaService = inject(CategoriaService);

    readonly categoriaResource = httpResource<categoria[]>( () => this.categoriaService.resourceUrl, { defaultValue: [] } );

    readonly $categoria = this.categoriaResource.value;
    readonly $loading = this.categoriaResource.isLoading;
    readonly $error = this.categoriaResource.error;

    reload(){
        this.categoriaResource.reload();
    }
}
