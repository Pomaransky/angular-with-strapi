import { TableColumn } from "./table-column.type";

export type TableConfig = {
  columns: TableColumn[];
  pageSize: number;
};