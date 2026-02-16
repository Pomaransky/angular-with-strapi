import { TableColumnType, TableConfig } from '../../../models';

export const USERS_TABLE_CONFIG: TableConfig = {
  columns: [
    {
      key: 'username',
      label: 'users.username',
      type: TableColumnType.STRING,
      sortable: true,
      filterable: true,
    },
    {
      key: 'email',
      label: 'users.email',
      type: TableColumnType.STRING,
      sortable: true,
      filterable: true,
    },
    {
      key: 'firstName',
      label: 'users.firstName',
      type: TableColumnType.STRING,
    },
    { key: 'lastName', label: 'users.lastName', type: TableColumnType.STRING },
    {
      key: 'confirmed',
      label: 'users.confirmed',
      type: TableColumnType.STATUS_TAG,
    },
    {
      key: 'blocked',
      label: 'users.blocked',
      type: TableColumnType.STATUS_TAG,
    },
    {
      key: 'createdAt',
      label: 'users.createdAt',
      type: TableColumnType.DATE,
      sortable: true,
    },
  ],
  pageSize: 5,
};
