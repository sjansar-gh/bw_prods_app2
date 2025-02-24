import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user';
import {MatSnackBar} from '@angular/material/snack-bar';
import { timer } from 'rxjs';

@Component({
  selector: 'app-update-users',
  imports: [],
  templateUrl: './update-users.component.html',
  styleUrl: './update-users.component.css'
})
export class UpdateUsersComponent {
  users: User[] = [];
  del_resp!: any;
  private _snackBar = inject(MatSnackBar);

  constructor(private userService: UserService){

  }

  ngOnInit(){
    this.getAllUsers();
  }

  getAllUsers(){
    this.userService.getUsers().subscribe( (result) => {
      this.users = result;
      console.log('all_users = ', this.users);
    })
  }

  delayedGetAllUsers(){
    timer(3000).subscribe( () => {
      this.getAllUsers();
    })
  }

  deleteUser(user_email: string){
    this.userService.deleteUser(user_email).subscribe( (resp) => {
      console.log(resp);
      this.del_resp = resp;
      this.displaySnackbar(this.del_resp);
      this.delayedGetAllUsers();
    })
  }

  displaySnackbar(resp: any){
    //console.log(resp);
    if(resp){
      let msg = `User (${resp.email}) ${resp.status == 'deleted'? ' deleted successfully': ' does not exists'}`;
      this._snackBar.open(msg, "OK", {
        duration: 3000,
        panelClass: ['tw_snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
}
