import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);

  onLoginClick() {
    this.authService.loginUser();
  }
}
