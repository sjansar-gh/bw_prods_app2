import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PatternValidatorService {

  static PatternValidators(regexp: RegExp, error: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if(!control.value){
        return null;
      }

      const valid = regexp.test(control.value);
      return valid? null : error;
    }
  }

  static MatchingPasswords(control: AbstractControl): ValidatorFn {
    return (confirmPassCtrl: AbstractControl): any | null => {
      const passwordVal = confirmPassCtrl.parent?.get('password')?.value;
      //const password = control.parent?.get('confirmPassword')?.value;
      const confirmPassVal = confirmPassCtrl.value;
      const currentErrors = confirmPassCtrl.errors;
      //const confirmControl = control.parent?.get('confirmPassword');

      if (PatternValidatorService.compare(passwordVal, confirmPassVal)) {
        confirmPassCtrl?.setErrors({...currentErrors, not_matching: true});
      } else {
        confirmPassCtrl?.setErrors(currentErrors!);
      }
    }
  }

  static compare(password: string, confirmPassword: string) {
    return password !== confirmPassword && confirmPassword !== ''
  }

  static passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const passwordVal = formGroup.get('password')?.value;
      const confirmPasswordVal = formGroup.get('confirm_password')?.value;
      return passwordVal === confirmPasswordVal? null : { passwordMismatch: true };
    };
  }
}
