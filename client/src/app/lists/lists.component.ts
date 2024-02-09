import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';
import { PaginatedResult, Pagination } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  
  members: Member[] | undefined;
  predicate: string = 'liked';
  pageNumber: number = 1;
  pageSize: number = 5;
  pagination: Pagination | undefined;
  
  constructor(
    private memberService: MembersService
  ) {}

  ngOnInit(): void {
    this.loadLikes();
  }

  public loadLikes(): void {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: (response: PaginatedResult<Member[]>) => {
        this.members = response.result;
        this.pagination = response.pagination;
      }
    });
  }

  public pageChanged(event: any): void {
    if (this.pageNumber !== event.page) {
      this.loadLikes();
    }
  }

}
