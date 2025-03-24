import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IdleService } from './services/idle/idle.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [MatSnackBarModule, NgIf, MatIconModule, RouterLink, RouterOutlet, MatButtonModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatMenuModule, MatTooltipModule, MatProgressBarModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  user!: any;
  idleService = inject(IdleService);
  router = inject(Router)
  private idleSubscription?: Subscription; 

  constructor(){

  }

  ngOnInit(){
    const tw_user: any = localStorage.getItem('tw_user');
    console.log('tw_user = ', tw_user);
    if(tw_user){
      let twUserObj = JSON.parse(tw_user);
      
      if(twUserObj && twUserObj.token){
        this.user = twUserObj;

        //Check app idleness
        //this.checkAppIdleness();
      }
    }
  }

  get isAuth(){
    const tw_user: any = localStorage.getItem('tw_user');
    if(tw_user){
      let twUserObj = JSON.parse(tw_user);
      if(twUserObj.token){
        this.user = twUserObj;
        return true
      }
      return false
    }
    return false;
  }

  logout(){
    this.router.navigate(['/login']);
    localStorage.removeItem('tw_user');
  }

  checkAppIdleness(){
    this.idleSubscription = this.idleService.idleState.subscribe( (isIdle) => {
      if(isIdle){
        console.log('user is idle');
      }else{
        console.log('user is active');
      }
    })
  }

  onUserAction(){
    this.idleService.resetTimer();
  }

  ngOnDestroy(): void {
    if(this.idleSubscription){
      this.idleSubscription?.unsubscribe();
    }
  }
}
