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
import { PatternValidatorService } from '../../../services/validators/pattern-validator/pattern-validator.service';

@Component({
  selector: 'app-profile-edit',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatCheckboxModule, NgIf],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent {
  userForm!: FormGroup;
  isSubmitted = false;
  hide_password: boolean = true;
  hide_new_password: boolean = true;
  hide_confirm_password: boolean = true;
  userResp!: any;
  user!: User;
  private _snackBar = inject(MatSnackBar);

  constructor(private userService: UserService){

  }

  ngOnInit(){
    this.getUserProfile();
  }

  updateProfile(userPayload: User){
    this.userService.updateUser(userPayload).subscribe( (resp) => {
      if(resp){
        console.log(resp);
        this.userResp = resp;
        this.displaySnackbar(this.userResp);
      }
    });
  }

  getUserProfile(){
    const tw_user: any = localStorage.getItem('tw_user');
    console.log('tw_user = ', tw_user);
    if(tw_user){
      let user_logged_in = JSON.parse(tw_user);
      if(user_logged_in && user_logged_in.email){
        this.userService.getUserProfile(user_logged_in.email).subscribe( (user_profile_resp) => {
          this.user = user_profile_resp;
          console.log('this.user = ', this.user);
          this.initializeForm();
        })
      }
    }
  }

  initializeForm(){
    this.userForm = new FormGroup({
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      first_name: new FormControl(this.user.first_name, Validators.required),
      last_name: new FormControl(this.user.last_name, Validators.required),
      password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
            PatternValidatorService.PatternValidators(/\d/, {hasNumbers: true}),
            PatternValidatorService.PatternValidators(/[A-Z]/, {hasUppercase: true}),
            PatternValidatorService.PatternValidators(/[a-z]/, {hasLowercase: true})
        ]),
      confirm_password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          PatternValidatorService.PatternValidators(/\d/, { hasNumbers: true }),
          PatternValidatorService.PatternValidators(/[A-Z]/, { hasUppercase: true }),
          PatternValidatorService.PatternValidators(/[a-z]/, { hasLowercase: true })
      ]),
      'admin': new FormControl(this.user.admin)
    },
    { validators: PatternValidatorService.passwordMatchValidator() });
  }

  onSubmit() {
    this.isSubmitted = true;
    console.log('userForm = ', this.userForm.value);
    console.log('userForm valid = ', this.userForm.valid);
    if(this.userForm.valid){
      this.updateProfile(this.userForm.value);
    }
  }

  displaySnackbar(resp: any){
    //console.log(resp);
    if(resp){
      let msg = `User (${resp.email}) ${resp.status == 'updated'? ' updated successfully': resp.status}`;
      this._snackBar.open(msg, "OK", {
        duration: 3000,
        panelClass: ['tw_snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

}
