import { MenuItem } from 'primeng/api';
import { UserRoleType } from '../models/auth';
import { AppRoutePath } from './app-route-path.enum';

export interface MenuItemWithPermissions extends MenuItem {
  permissions?: UserRoleType[];
}

export const menuItems: MenuItemWithPermissions[] = [
  {
    label: 'menu.home',
    icon: 'pi pi-home',
    routerLink: AppRoutePath.HOME,
  },
  {
    label: 'menu.post',
    routerLink: AppRoutePath.POST,
    visible: false,
  },
  {
    label: 'menu.profile',
    icon: 'pi pi-user',
    routerLink: AppRoutePath.PROFILE,
  },
  {
    label: 'menu.users',
    icon: 'pi pi-users',
    routerLink: AppRoutePath.USERS,
    permissions: [UserRoleType.ADMIN],
  },
];
