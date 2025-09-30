import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../feature/auth/auth-model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  currentUser = signal<User | null>(null);

  loginUser() {
    this.currentUser.set({ _id: '123123123123', email: 'first@gmail.com', username: 'firstuser' });
    this.router.navigate(['posts']);
    console.log('login user called');
    console.log('this is the value of current user', this.currentUser());
  }

  logoutFromClient() {
    this.currentUser.set(null);
    this.router.navigate(['']);
  }
}
