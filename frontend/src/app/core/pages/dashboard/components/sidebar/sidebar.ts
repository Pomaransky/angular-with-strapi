import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  computed,
} from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import {
  menuItems,
  MenuItemWithPermissions,
} from '../../../../constants/menu-items.const';
import { AuthService } from '../../../../services/auth-service';
import { UserStore } from '../../../../store/user.store';
import { Settings } from '../../../../components/settings/settings';
import { Spinner } from '../../../../components';

@Component({
  selector: 'app-sidebar',
  imports: [MenuModule, DividerModule, ButtonModule, Settings, Spinner],
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
  private userStore = inject(UserStore);

  items = computed(() => this.getFilteredMenuItems());
  isUserLoading = this.userStore.me.isLoading;

  isMenuPopup = false;

  ngOnInit(): void {
    this.checkWindowDimensions();
  }

  private getFilteredMenuItems(): MenuItemWithPermissions[] {
    const userRole = this.userStore.me.data()?.role?.type;

    return menuItems.map((item: MenuItemWithPermissions) => {
      if (item.permissions && item.permissions.length > 0) {
        return {
          ...item,
          visible: userRole ? item.permissions.includes(userRole) : false,
        };
      }
      return item;
    });
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
      reject: () => {
        /* do nothing */
      },
    });
  }
}
