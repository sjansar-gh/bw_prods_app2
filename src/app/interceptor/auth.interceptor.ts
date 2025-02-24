import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const reqWithCreds = req.clone({
    withCredentials: true,
  });

  console.log('-> authInterceptor');

  return next(reqWithCreds);
};
