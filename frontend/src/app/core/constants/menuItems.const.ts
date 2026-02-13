import { MenuItem } from 'primeng/api';
import { UserRoleType } from '../models/auth';
import { AppRoutePath } from './appRoutePath.enum';

export interface MenuItemWithPermissions extends MenuItem {
  permissions?: UserRoleType[];
}

export const menuItems: MenuItemWithPermissions[] = [
  {
    label: 'Home',
    icon: 'pi pi-home',
    routerLink: AppRoutePath.HOME,
  },
  {
    label: 'Post',
    routerLink: AppRoutePath.POST,
    visible: false,
  },
  {
    label: 'Profile',
    icon: 'pi pi-user',
    routerLink: AppRoutePath.PROFILE,
  },
  {
    label: 'Users',
    icon: 'pi pi-users',
    routerLink: AppRoutePath.USERS,
    permissions: [UserRoleType.ADMIN],
  },
];
