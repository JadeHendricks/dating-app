import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.baseUrl + 'users', this.getHttpOptions());
  }

  public getMember(username: string): Observable<Member> {
    return this.http.get<Member>(this.baseUrl + 'user/' + username, this.getHttpOptions());
  }

  private getHttpOptions() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);

    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    };
  }
}
