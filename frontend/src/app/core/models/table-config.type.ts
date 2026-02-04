import { TableColumn } from "./table-column.type";

export interface TableConfig {
  columns: TableColumn[];
  pageSize: number;
}