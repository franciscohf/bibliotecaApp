import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

export const TOKEN_NAME = 'access_token';

@Service()
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly logoutUrl = `${environment.HOST}/auth/logout`;

  logout() {
    return this.http.get<void>(this.logoutUrl).pipe(
      tap(() => sessionStorage.removeItem(TOKEN_NAME)),
    );
  }
}
