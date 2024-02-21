import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Member } from 'src/app/_models/member';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';
import { PresenceService } from 'src/app/_services/presence.service';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-details',
  standalone: true,
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
  imports: [CommonModule, TabsModule, GalleryModule, TimeagoModule, MemberMessagesComponent]
})
export class MemberDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent; //static means our memberTbas should be constructed immediately
  public member: Member = {} as Member;
  public images: GalleryItem[] = [];
  public activeTab?: TabDirective;
  public messages: Message[] = [];
  public user?: User;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    public presenceService: PresenceService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getUser();
    
    this.route.data.subscribe({
      next: data => this.member = data['member']
    });

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab']);
      }
    });

    this.getImages();
  }

  private getUser() {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    })
  }

  public selectTab(heading: string): void {
    if (this.memberTabs) {
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true;
    }
  }

  public onTabActivated(data: TabDirective): void {
    this.activeTab = data;
    if (this.user) {
      if (this.activeTab.heading === 'Messages') {
        this.messageService.createHubConnection(this.user, this.member.userName)
      } else {
        this.messageService.stopHubConnection();
      }
    }
  }

  public loadMessages(): void {
    if (this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: messages => this.messages = messages
      });
    }
  }

  private getImages(): void {
    if (this.member && Object.keys(this.member).length > 0) {
      for (const photo of this.member?.photos) {
        this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
      }
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
