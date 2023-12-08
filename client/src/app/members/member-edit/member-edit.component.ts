import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeUnload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true; //will return a broswer proompt if you decide to leave the domain
    }
  }

  public member: Member | undefined;
  public user: User | null = null;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  private getCurrentUser(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user && Object.keys(user).length) {
          this.user = user;
          this.loadMember(this.user);
        }
      }
    });
  }

  private loadMember(user: User): void {
    this.memberService.getMember(user.username).subscribe({
      next: member => this.member = member
    });
  }

  public updateMember(): void {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Profile updated successfully.');
        this.editForm?.reset(this.member); //works becaise of [()]
      }
    });
  }
}
