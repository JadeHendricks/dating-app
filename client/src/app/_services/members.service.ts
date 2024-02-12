import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { Observable, Subscription, map, of, take } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MembersService implements OnDestroy {

  private baseUrl: string = environment.apiUrl;
  public members: Member[] = [];
  private memberCache = new Map();
  userParams: UserParams | undefined;
  user: User | undefined;
  currentUserSubscription: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) { 
    this.getCurrentUser();
  }

  public getCurrentUser(): void {
    this.currentUserSubscription = this.accountService.currentUser$.subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    });
  }

  public getUserParams(): UserParams  | undefined {
    return this.userParams;
  }

  public setUserParams(params: UserParams): void {
    this.userParams = params;
  }

  public resetUserParams(): UserParams  | undefined{
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }

    return;
  }

  public getMembers(userParams: UserParams) {
    //setting a key here, so we can check it on the second call
    const response = this.memberCache.get(Object.values(userParams).join('-'));

    if (response) return of(response); 

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params).pipe(
      map(response => {
        //setting the value to the key here so we can go and get it later 
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  public getMember(username: string): Observable<Member> {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName === username);
    
    if (member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  public updateMember(member: Member): Observable<void> {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member}
      })
    );
  }

  public setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  public deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  public addLike(username: string): Observable<{}> {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  public getLikes(predicate: string, pageNumber: number, pageSize: number): Observable<PaginatedResult<Member[]>> {
    let params = this.getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);

    return this.getPaginatedResult<Member[]>(this.baseUrl + 'likes', params);
  }

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;

    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }

        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    return params;
  }

  public ngOnDestroy(): void {
    if (this.currentUserSubscription) this.currentUserSubscription.unsubscribe();
  }
}
