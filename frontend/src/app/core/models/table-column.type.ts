import { TableColumnType } from ".";

export type TableColumn = {
  key: string;
  label: string;
  type: TableColumnType;
}