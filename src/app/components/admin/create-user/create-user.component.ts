import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';

import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-user',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatCheckboxModule, NgIf],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  userForm!: FormGroup;
  isSubmitted = false;
  hide_password: boolean = true;
  hide_confirm_password: boolean = true;
  userResp!: any;
  private _snackBar = inject(MatSnackBar);

  constructor(private userService: UserService){

  }

  ngOnInit(){
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),
      'admin': new FormControl(false)
    });
  }

  createNewUser(userPayload: User){
    this.userService.creatUser(userPayload).subscribe( (resp) => {
      if(resp){
        console.log(resp);
        this.userResp = resp;
        this.displaySnackbar(this.userResp);
      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    console.log('userForm = ', this.userForm.value);
    console.log('userForm valid = ', this.userForm.valid);
    if(this.userForm.valid){
      this.createNewUser(this.userForm.value);
    }
  }

  displaySnackbar(resp: any){
    //console.log(resp);
    if(resp){
      let msg = `User (${resp.email}) ${resp.status == 'created'? ' created successfully': ' exists'}`;
      this._snackBar.open(msg, "OK", {
        duration: 3000,
        panelClass: ['tw_snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
}
