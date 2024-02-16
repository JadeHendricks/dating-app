import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { take } from 'rxjs';

@Directive({
  selector: '[appHasRole]' //*appHasRole='["Admin", "Moderator"]' etc
})
export class HasRoleDirective implements OnInit{
  @Input() appHasRole: string[] = [];
  user: User = {} as User;

  constructor(
    private viewContainerRef: ViewContainerRef, 
    private templateRef: TemplateRef<any>,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    
    if (this.user.roles.some(r => this.appHasRole.includes(r))) {
      //this will add the element to the DOM
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      //this will remove the element from the DOM
      this.viewContainerRef.clear();
    }
  }

  private getCurrentUser(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    })
  }
}
