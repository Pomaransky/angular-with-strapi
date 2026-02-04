import { TableColumnType } from ".";

export interface TableColumn {
  key: string;
  label: string;
  type: TableColumnType;
  sortable?: boolean;
  filterable?: boolean;
}