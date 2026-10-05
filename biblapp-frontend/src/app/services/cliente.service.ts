import { Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Cliente } from '../model/cliente';
import { GenericService } from './generic.service';

@Service()
export class ClienteService extends GenericService<Cliente> {

    protected override url = `${environment.HOST}/v1/cliente`;
}
