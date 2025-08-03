import { MenuItem } from 'primeng/api';
import { UserRoleType } from '../models/auth';

export interface MenuItemWithPermissions extends MenuItem {
  permissions?: UserRoleType[];
}

export const menuItems: MenuItemWithPermissions[] = [
  {
    label: 'Home',
    icon: 'pi pi-home',
    routerLink: '/',
  },
  {
    label: 'Profile',
    icon: 'pi pi-user',
    routerLink: '/profile',
  },
  {
    label: 'Users',
    icon: 'pi pi-users',
    routerLink: '/users',
    permissions: [UserRoleType.ADMIN],
  },
];
