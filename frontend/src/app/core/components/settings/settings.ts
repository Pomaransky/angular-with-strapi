import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Theme } from '../../constants';
import { ThemeService } from '../../services/theme-service';

@Component({
  selector: 'app-settings',
  imports: [ButtonModule, DrawerModule, ToggleSwitchModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  private themeService = inject(ThemeService);

  drawerVisible = signal(false);
  isDark = computed(() => this.themeService.themeMode() === Theme.DARK);

  onDarkModeChange(checked: boolean): void {
    this.themeService.setTheme(checked ? Theme.DARK : Theme.LIGHT);
  }
}
