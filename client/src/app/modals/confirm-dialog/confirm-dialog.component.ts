import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  public title: string = '';
  public message: string = '';
  public btnOkText: string = '';
  public btnCancelText: string = '';
  public result: boolean = false;

  constructor(public bsModalRef: BsModalRef) {

  }

  ngOnInit(): void {
    
  }

  public confirm(): void {
    this.result = true;
    this.bsModalRef.hide();
  }

  public decline(): void {
    this.bsModalRef.hide();
  }
}
