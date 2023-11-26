import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(
    public accountService: AccountService
  ) {}

  ngOnInit(): void {

  }

  public login(): void {
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log('response', response);
      },
      error: error => console.log(error)
    });
  }

  public logout(): void {
    this.accountService.logout();
  }
}
