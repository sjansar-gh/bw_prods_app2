import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  if(!userService.userLoggedIn()){
    return true;
  }else{
    router.navigateByUrl("home");
    return false;
  }
};
