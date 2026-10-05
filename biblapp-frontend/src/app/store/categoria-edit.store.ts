import { computed, inject, Service, signal } from "@angular/core";
import { CategoriaService } from "../services/categoria.service";
import { httpResource } from "@angular/common/http";
import { categoria } from "../model/categoria";

@Service({ autoProvided: false })
export class CategoriaEditStore{

    private readonly categoriaService = inject(CategoriaService);
    readonly $id = signal<number | null>(null);

    private readonly $categoriaRequest = computed(() => {
        const id = this.$id();

        return id ? `${this.categoriaService.resourceUrl}/${id}` : undefined;
    });

    readonly categoriaResource = httpResource<categoria>(() => this.$categoriaRequest());

    setId(id: number | null){
        this.$id.set(id);
    }


}
