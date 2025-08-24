import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map } from 'rxjs';
import { User, UsersListResponse } from 'src/app/shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly userBaseUrl = 'users'

  list(page = 1, per_page = 6) {
    return this.http.get<UsersListResponse>(`${this.userBaseUrl}`, { params: { page, per_page } }).pipe(delay(500));
  }

  getById(id: number) {
    return this.http.get<{ data: User }>(`${this.userBaseUrl}/${id}`).pipe(map(r => r.data));
  }

  update(id: number, payload: Partial<User>) {
    return this.http.put<User>(`${this.userBaseUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.userBaseUrl}/${id}`);
  }
}
