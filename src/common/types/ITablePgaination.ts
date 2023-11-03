export interface TablePagination {
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
  descending: boolean;
  sortBy: string | null;
}
