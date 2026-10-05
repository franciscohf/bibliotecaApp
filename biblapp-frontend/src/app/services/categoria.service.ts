import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { categoria } from '../model/categoria';
import { GenericService } from './generic.service';

@Service()
export class CategoriaService extends GenericService<categoria> {

    protected override url = `${environment.HOST}/v1/categoria`;
}
