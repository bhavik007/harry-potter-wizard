type Column<T> = {
  header: string; // The column header text
  accessor: keyof T; // The key in the data object this column maps to
  customRow?: (value: T[keyof T], row: T) => React.ReactNode; // Optional custom rendering function for the cell
};

type TableProps<T> = {
  data: T[]; // Array of data objects
  columns: Column<T>[]; // Array of column definitions
  rowsPerPage?: number; // Default number of rows per page (optional, default is 5)
  loading?: boolean; // Loading state (optional, default is false)
};
