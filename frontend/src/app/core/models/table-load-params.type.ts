export interface TableLoadParams {
  page: number;
  pageSize: number;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  filter?: {
    filter?: string;
    filterKeys?: string[];
  };
}
