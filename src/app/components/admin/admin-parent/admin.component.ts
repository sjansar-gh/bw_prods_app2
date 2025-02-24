import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';

import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CreateUserComponent } from "../create-user/create-user.component";
import { ShowUsersComponent } from "../show-users/show-users.component";
import { UpdateUsersComponent } from "../update-users/update-users.component";
import { ManageDataComponent } from '../manage-data/manage-data.component';

@Component({
  selector: 'app-admin',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    NgIf,
    MatSelectModule,
    CreateUserComponent,
    ShowUsersComponent,
    UpdateUsersComponent,
    ManageDataComponent
],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  div_hide_list: boolean[] = [false, false, false, false];
  selectedAdminAction: string = "";

  constructor(private userService: UserService){

  }

  ngOnInit(){
  }

  showAdminActionDiv(event: any){
    console.log('admin action = ', event.value);
    if(this.selectedAdminAction){
      if(this.selectedAdminAction === "new_user"){
        this.div_hide_list = [true, false, false, false];
      }

      if(this.selectedAdminAction === "show_users"){
        this.div_hide_list = [false, true, false, false];
      }

      if(this.selectedAdminAction === "update_users"){
        this.div_hide_list = [false, false, true, false];
      }

      if(this.selectedAdminAction === "manage_data"){
        this.div_hide_list = [false, false, false, true];
      }
    }
  }
}
