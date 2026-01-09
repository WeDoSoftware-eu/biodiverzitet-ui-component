import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeTestComponent } from '../../../ngx-eco-theme/src/public-api';

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
