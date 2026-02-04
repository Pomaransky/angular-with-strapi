import { TableColumnType, TableConfig } from "../../../models";


export const USERS_TABLE_CONFIG: TableConfig = {
  columns: [
    { key: 'username', label: 'Username', type: TableColumnType.STRING, sortable: true, filterable: true },
    { key: 'email', label: 'Email', type: TableColumnType.STRING, sortable: true, filterable: true },
    { key: 'firstName', label: 'First Name', type: TableColumnType.STRING },
    { key: 'lastName', label: 'Last Name', type: TableColumnType.STRING },
    { key: 'confirmed', label: 'Confirmed', type: TableColumnType.STATUS_TAG },
    { key: 'blocked', label: 'Blocked', type: TableColumnType.STATUS_TAG },
    { key: 'createdAt', label: 'Created At', type: TableColumnType.DATE, sortable: true },
  ],
  pageSize: 5,
};