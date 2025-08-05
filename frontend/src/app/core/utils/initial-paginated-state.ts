import { Paginated } from '../models';

export const initialPaginatedState = <T>(data: T[]): Paginated<T> => ({
  data: data,
  meta: {
    pagination: {
      page: 1,
      pageSize: 3,
      total: 0,
      pageCount: 0,
    },
  },
});
