import { Injectable } from '@angular/core';
import { API_URL } from '../../constants/tw_contants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../../models/user';
import { catchError, retry, throwError } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  auth_url = API_URL + "users";
  logged_in: boolean = false

  constructor(private http: HttpClient, private apiService: ApiService) { }

  login(login_obj: any){
    let msg = login_obj
    console.log('login_obj = ', login_obj);
    let login_resp: any = this.http.post(this.auth_url+"/login", msg).pipe(
      retry(2),
      catchError( (error: any) => {
        console.log('error = ', error);
        return throwError(() => new Error('Please enter correct email and password'));
      })
    )
    console.log('login_resp = ', login_resp);
    return login_resp;
  }

  creatUser(userPayload: any){
    return this.http.post(this.auth_url, userPayload);
    //return this.apiService.post("users", userPayload);
  }

  updateUser(userPayload: any){
    const email_param = new HttpParams().set('email', userPayload.email);
    return this.http.put(this.auth_url, userPayload, {
      params: email_param
    });
    //return this.apiService.put("users", userPayload);
  }

  getUsers(){
    const users = this.http.get<User[]>(this.auth_url);
    //const users = this.apiService.get("users");
    //console.log('users = ', users);
    return users;
  }

  deleteUser(user_email: string){
    const email_param = new HttpParams().set('email', user_email);
    let deleteResp = this.http.delete(this.auth_url, {
      params: email_param
    });
    // let deleteResp = this.apiService.delete("users", {
    //   params: email_param
    // });
    console.log('deleteResp = ', deleteResp);
    return deleteResp;
  }

  getUserProfile(user_email: string){
    console.log('user_email = ', user_email);
    const email_param = new HttpParams().set('email', user_email);
    const user_profile = this.http.get<User>(API_URL+'user', {
      params: email_param
    });

    return user_profile;
  }

  userLoggedIn(){
    return localStorage.getItem('tw_user')? true: false;
  }

}
