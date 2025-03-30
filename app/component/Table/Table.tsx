import React, { useState } from 'react';
import './Table.css'; // Import the updated CSS file
import Loading from '../Loading/Loading';

const Table = <T,>({ data, columns, rowsPerPage = 5, loading }: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPageState, setRowsPerPageState] = useState(rowsPerPage);

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPageState);
  const paginatedData = data.slice((currentPage - 1) * rowsPerPageState, currentPage * rowsPerPageState);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPageState(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when rows per page changes
  };

  return (
    <div className="table-container">
      {loading ? (
        <Loading />
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={String(column.accessor)} className="table-header">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="table-row">
                  {columns.map((column) => (
                    <td key={String(column.accessor)}>
                      {column.customRow
                        ? column.customRow(row[column.accessor], row)
                        : String(row[column.accessor] || '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-pagination">
            <div className="rows-per-page">
              <label htmlFor="rowsPerPage">Rows per page:</label>
              <select id="rowsPerPage" value={rowsPerPageState} onChange={handleRowsPerPageChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div className="pagination-controls">
              <button onClick={handleFirstPage} disabled={currentPage === 1}>
                First
              </button>
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </button>
              <button onClick={handleLastPage} disabled={currentPage === totalPages}>
                Last
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Table;
