import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  
  members: Member[] = [];
  public members$: Observable<Member[]> | undefined;
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;

  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];

  constructor(
    private membersService: MembersService
  ) {}

  ngOnInit(): void {
    this.userParams = this.membersService.getUserParams();
    this.loadMembers();
  }

  public loadMembers() {
    if (this.userParams) {
      this.membersService.setUserParams(this.userParams);
      this.membersService.getMembers(this.userParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        }
      });
    }
  }

  public resetFilters(): void {
      //this will revert everything to default, default ages and default genders
      this.userParams = this.membersService.resetUserParams();
      this.loadMembers();
  }

  public pageChanged(event: any): void {
    if (this.userParams && this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.membersService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }
}
