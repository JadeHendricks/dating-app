import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  standalone: true,
  styleUrls: ['./member-messages.component.css'],
  imports: [CommonModule, TimeagoModule, FormsModule]
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm;
  @Input() username?: string;
  public messageContent = '';

  constructor(public messageService: MessageService) {}

  ngOnInit(): void {}

  public sendMessage(): void {
    if (!this.username) return;

    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      console.log('SendMessage this.username', this.username);
      console.log('SendMessage this.messageContent', this.messageContent);
      //we don't need to do anything with the mssages we get back, because our messageThreadObservable is managing all of that
      this.messageForm?.reset();
    })
  }
}
