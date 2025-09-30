import { Component, signal } from '@angular/core';
import { Header } from './core/components/header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet, Header],
})
export class App {
  protected readonly title = signal('client');
}
