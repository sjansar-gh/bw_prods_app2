import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-show-users',
  imports: [],
  templateUrl: './show-users.component.html',
  styleUrl: './show-users.component.css'
})
export class ShowUsersComponent {

  users: User[] = [];

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


}
