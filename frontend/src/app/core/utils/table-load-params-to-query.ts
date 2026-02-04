import { TableLoadParams } from '../models/table-load-params.type';

export function tableLoadParamsToStrapiQuery(params: TableLoadParams): {
  sort: string;
  filter: string;
} {
  const sort =
    params.sort != null
      ? `&sort=${params.sort.field}:${params.sort.order}`
      : '';
  const filterValue = params.filter?.filter?.trim();
  const filterKeys = params.filter?.filterKeys;
  const filter =
    filterValue && filterKeys?.length
      ? '&' +
        filterKeys
          .map(
            (key, i) =>
              `filters[$or][${i}][${key}][$containsi]=${encodeURIComponent(filterValue)}`,
          )
          .join('&')
      : '';
  return { sort, filter };
}
