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
import { ProfileComponent } from "../view/profile.component";
import { ProfileEditComponent } from "../edit/profile-edit.component";

@Component({
  selector: 'app-profile-parent',
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
    ProfileComponent,
    ProfileEditComponent
],
  templateUrl: './profile-parent.component.html',
  styleUrl: './profile-parent.component.css'
})
export class ProfileParentComponent {
  div_hide_list: boolean[] = [false, false];
  selectedAdminAction: string = "";

  showProfileActionDiv(event: any){
    console.log('Profile action = ', event.value);
    if(this.selectedAdminAction){
      if(this.selectedAdminAction === "view_profile"){
        this.div_hide_list = [true, false];
      }

      if(this.selectedAdminAction === "edit_profile"){
        this.div_hide_list = [false, true];
      }
    }
  }
}
