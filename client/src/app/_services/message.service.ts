import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { getPaginationHeaders, getPaginatedResult } from './paginationHelper';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public baseUrl = environment.apiUrl;
  public hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  public messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) { }

  public createHubConnection(user: User, otherUsername: string): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));
    this.hubConnection.on('RecieveMessageThread', (messages: Message[]) => {
      this.messageThreadSource.next(messages);
    });

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: messages => {
          //taking the old list and adding one to it, then sending out a new array of messages
          this.messageThreadSource.next([...messages, message]);
        }
      })
    });

  }

  public stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection?.stop();
    }
  }

  public getMessages(pageNumber: number, pageSize: number, container: string): Observable<PaginatedResult<Message[]>> {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  public getMessageThread(username: string): Observable<Message[]> {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  public async sendMessage(username: string, content: string): Promise<any> {
    //we want to invoke a message from our messagehub called SendMessage, so we need to name it the exacct same thing
    return this.hubConnection?.invoke('SendMessage', {recipientUsername: username, content})
      .catch(error => console.log(error));
  }

  public deleteMessage(id: number): Observable<Object> {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
