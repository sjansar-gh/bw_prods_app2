import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user!: any;

  constructor(){
    this.getUserProfile();
  }

  ngOnInit(){
    this.getUserProfile();
  }

  getUserProfile(){
    let currentUser = localStorage.getItem('tw_user');

    if(currentUser){
      this.user = JSON.parse(currentUser);
    }
  }


}
