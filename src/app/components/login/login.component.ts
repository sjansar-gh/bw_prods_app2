import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  isSubmitted = false;
  hide = true;
  private _snackBar = inject(MatSnackBar);
  error_msg: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    this.error_msg = '';
    if (this.loginForm.invalid) return;
    
    let logging_obj = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value
    }

    this.userService.login(logging_obj).subscribe({
      next: (result: any) => {
          if(result){
          console.log(JSON.stringify(result));
          if(result.status === 'success'){
            localStorage.setItem('tw_user', JSON.stringify(result));
            this.router.navigate(['/home']);
          }else{
            this.router.navigate(['/login']);
            localStorage.removeItem('tw_user');
          }
        }
      },
      error: (error: any) => {
        console.error('login failed', error);
        this.displaySnackbar(error);
        this.error_msg = error;
      },

      
    })
  }

  displaySnackbar(msg: any){
    if(msg){
        this._snackBar.open(msg, "X", {
        duration: 3000,
        panelClass: ['tw_snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
}
