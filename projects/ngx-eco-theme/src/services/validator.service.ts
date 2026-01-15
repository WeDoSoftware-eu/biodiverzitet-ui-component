import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  public capitalFirstLetter() {
    return [Validators.pattern(/^[A-Z].*/)];
  }

  public email() {
    return [Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/)];
  }
}
