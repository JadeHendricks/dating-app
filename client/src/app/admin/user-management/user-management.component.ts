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

  public openRolesModal(): void {
    const initialState: ModalOptions = {
      initialState: {
        list: [
          'Do thing',
          'Do another thing',
          'Something else'
        ],
        title: 'Test modal'
      }
    }
    
    this.bsModalRef = this.modalService.show(RolesModelComponent, initialState);
    this.bsModalRef.content!.closeBtnName = 'Close';
  }

}
