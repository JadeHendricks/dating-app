import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  
  public members: Member[] = [];

  constructor(
    private memberService: MembersService
  ) {}

  ngOnInit(): void {
    this.loadMembers();
    console.log('Members', this.members)
  }

  private loadMembers(): void {
    this.memberService.getMembers().subscribe({
      next: members => this.members = members
    });
  }
}
