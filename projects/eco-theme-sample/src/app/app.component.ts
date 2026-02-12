import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeTestComponent } from './theme-test/theme-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThemeTestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Testing theme';
}
