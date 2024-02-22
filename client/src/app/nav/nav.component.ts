import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(
    public accountService: AccountService,
    private router: Router,
    private membersService: MembersService
  ) {}

  ngOnInit(): void {

  }

  public login(): void {
    this.accountService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        //reseting the params if the application is still open and a new user logs in on the same tab
        //only really needed for DEV
        this.membersService.resetUserParams();
        this.model = {};
      }
    });
  }

  public logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/')
  }
}
