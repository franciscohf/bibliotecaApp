import { inject, Service } from "@angular/core";
import { ClienteService } from "../services/cliente.service";
import { httpResource } from "@angular/common/http";
import { Cliente } from "../model/cliente";

@Service({autoProvided: false})
export class ClienteStore {

    private readonly clienteService = inject(ClienteService);

    readonly clienteResource = httpResource<Cliente[]>( () => this.clienteService.resourceUrl, { defaultValue: [] } );

    readonly $cliente = this.clienteResource.value;
    readonly $loading = this.clienteResource.isLoading;
    readonly $error = this.clienteResource.error;

    reload(){
        this.clienteResource.reload();
    }
}
