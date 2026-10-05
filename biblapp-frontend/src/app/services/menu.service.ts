import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Menu } from '../model/menu';

@Service()
export class MenuService {

   private readonly http = inject(HttpClient);
    private readonly url = `${environment.HOST}/v1/menus`;

    //POST sin cuerpo por convencion del backend. Sin token la respuesta es una lista vacia
    getMenusByUser(){
        return this.http.post<Menu[]>(`${this.url}/user`, {});
    }
}
