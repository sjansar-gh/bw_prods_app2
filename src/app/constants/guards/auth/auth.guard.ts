import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const userService = inject(UserService);

  if(localStorage.getItem('tw_user')){
    return true;
  }else{
    router.navigateByUrl("login");
    return false;
  }
};
