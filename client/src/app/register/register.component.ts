import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  public registerForm: FormGroup = new FormGroup({})

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
    });

    //checking changes to the form
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true}
    }
  }

  public register(): void {
    console.log(this.registerForm?.value);
    // this.accountService.register(this.model).subscribe({
    //   next: () => {
    //     this.cancel();
    //   },
    //   error: error => this.toastr.error(error.error)
    // })
  }

  public cancel(): void {
    this.cancelRegister.emit(false);
  }

}
