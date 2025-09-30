import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, UpperCasePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit {
  private authService = inject(AuthService);
  private renderer = inject(Renderer2);

  currentUser = this.authService.currentUser;

  dropdownEl = viewChild<ElementRef>('dropdown');

  isDropdownOpen = signal(false);

  ngAfterViewInit() {
    this.renderer.listen(document, 'click', (e) => {
      if (!this.dropdownEl()?.nativeElement.contains(e.target)) {
        this.isDropdownOpen.set(false);
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen.update((prev) => !prev);
  }

  onLogoutClick() {
    this.authService.logoutFromClient();
  }
}
