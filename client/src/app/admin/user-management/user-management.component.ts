import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModelComponent } from 'src/app/modals/roles-model/roles-model.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit{
  public users: User[] = [];
  public bsModalRef: BsModalRef<RolesModelComponent> = new BsModalRef<RolesModelComponent>();
  public availableRoles: string[] = [
    'Admin',
    'Moderator',
    'Member'
  ];

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  public getUsersWithRoles(): void {
    this.adminService.getUsersWithRoles().subscribe({
      next: users => this.users = users
    });
  }

  public openRolesModal(user: User): void {
    console.log('openRolesModal user', user)
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
      }
    }
    
    this.bsModalRef = this.modalService.show(RolesModelComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        if (!this.arrayEqual(selectedRoles!, user.roles)) {
          this.adminService.updateUserRoles(user.username, selectedRoles!).subscribe({
            next: roles => user.roles = roles
          });
        }
      }
    })
  }

  private arrayEqual(arr1: string[], arr2: string[]): boolean {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort())
  }

}
