import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { menuItems } from '../../../../constants/menuItems.const';
import { AuthService } from '../../../../services/auth-service';

@Component({
  selector: 'app-sidebar',
  imports: [MenuModule, DividerModule, ButtonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'checkWindowDimensions()',
  },
})
export class Sidebar implements OnInit {
  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);

  items = menuItems;
  isMenuPopup = false;
  appTitle = 'AWS APP';

  ngOnInit(): void {
    this.checkWindowDimensions();
  }

  checkWindowDimensions(): void {
    if (window.innerWidth < 768) {
      this.isMenuPopup = true;
    } else {
      this.isMenuPopup = false;
    }
  }

  logout(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to logout?',
      header: 'Confirm logout',
      acceptLabel: 'Logout',
      rejectLabel: 'Cancel',
      icon: 'pi pi-sign-out',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-info',
      accept: () => this.authService.logout(),
      reject: () => {},
    });
  }
}
