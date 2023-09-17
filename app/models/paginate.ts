export interface PaginateReturn<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  pageCount: number;
}
