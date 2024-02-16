import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-model',
  templateUrl: './roles-model.component.html',
  styleUrls: ['./roles-model.component.css']
})
export class RolesModelComponent implements OnInit {
  public username: string = '';
  public availableRoles: string[] = [];
  public selectedRoles: string[] = [];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    console.log('RolesModelComponent username', this.username);
    console.log('RolesModelComponent availableRoles', this.availableRoles);
    console.log('RolesModelComponent selectedRoles', this.selectedRoles);
  }

  public updateChecked(checkedValue: string): void {
    const index = this.selectedRoles.indexOf(checkedValue);
    index !== -1 ? this.selectedRoles.splice(index, 1) : this.selectedRoles.push(checkedValue);
  }
}
