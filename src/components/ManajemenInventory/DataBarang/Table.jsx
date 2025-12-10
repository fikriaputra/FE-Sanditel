import { useState, useMemo, useEffect } from "react";
import React from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

// Untuk komponen Filter dengan scroll vertikal dan tampilan responsif
export default function Table({
  headers,
  children,
  pagination = true,
  customFilters = [],
}) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // --- STATE FOR FILTERS ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});

  // --- Initialize filters based on customFilters passed from parent ---
  useEffect(() => {
    // Initialize filters only when customFilters change, not on every render
    if (customFilters.length) {
      const initialFilters = customFilters.reduce((acc, filter) => {
        // Initialize each filter with an empty array
        acc[filter.name] = [];
        return acc;
      }, {});
      setFilters((prevFilters) => {
        // Only update state if the filters haven't been initialized yet
        if (JSON.stringify(prevFilters) !== JSON.stringify(initialFilters)) {
          return initialFilters;
        }
        return prevFilters;
      });
    }
  }, [customFilters]); // Only run when customFilters prop changes

  // Toggle filter option in the filters state
  const toggleFilterOption = (columnName, value) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      const currentFilter = newFilters[columnName] || [];

      if (currentFilter.includes(value)) {
        // Remove filter option if already selected
        newFilters[columnName] = currentFilter.filter((item) => item !== value);
      } else {
        // Add filter option if not selected
        newFilters[columnName] = [...currentFilter, value];
      }

      return newFilters;
    });
  };

  // Apply filters and reset to the first page
  const handleApplyFilter = () => {
    setIsFilterOpen(false);
    setCurrentPage(1); // Reset to the first page after applying filters
  };

  // Sorting handler
  const handleSort = (index) => {
    let direction = "asc";
    if (sortConfig.key === index && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: index, direction });
  };

  // Filtering + Sorting logic
  const filteredRows = React.Children.toArray(children)
    .filter((child) => {
      if (!child) return false;

      // Get the row values
      let rowValues = [];
      if (child.props?.item) {
        rowValues = Object.values(child.props.item);
      } else if (child.props?.children) {
        rowValues = React.Children.toArray(child.props.children).map((td) => {
          if (typeof td === "string") return td;
          if (td?.props?.children) {
            return Array.isArray(td.props.children)
              ? td.props.children.join(" ")
              : td.props.children;
          }
          return "";
        });
      }

      const stringValues = rowValues.map((v) => String(v));

      // --- SEARCH ---
      const searchableContent = stringValues.join(" ");
      const matchesSearch = searchableContent
        .toLowerCase()
        .includes(search.toLowerCase());

      // --- FILTERS (Check the selected filter values) ---
      let isMatch = true;
      for (let columnName in filters) {
        const filterValues = filters[columnName];
        if (filterValues.length > 0) {
          const columnIndex = headers.indexOf(columnName);
          const columnValue = stringValues[columnIndex];
          if (!filterValues.includes(columnValue)) {
            isMatch = false;
            break;
          }
        }
      }

      return matchesSearch && isMatch;
    })
    .sort((a, b) => {
      if (!sortConfig.key && !sortConfig.direction) return 0;

      let aValue = "";
      let bValue = "";

      if (a.props?.item && b.props?.item) {
        aValue = Object.values(a.props.item)[sortConfig.key] || "";
        bValue = Object.values(b.props.item)[sortConfig.key] || "";
      } else if (a.props?.children && b.props?.children) {
        const aChildren = React.Children.toArray(a.props.children);
        const bChildren = React.Children.toArray(b.props.children);
        const aChild = aChildren[sortConfig.key];
        const bChild = bChildren[sortConfig.key];

        const aChildVal = aChild?.props?.children;
        const bChildVal = bChild?.props?.children;

        aValue = Array.isArray(aChildVal)
          ? aChildVal.join(" ")
          : aChildVal || "";
        bValue = Array.isArray(bChildVal)
          ? bChildVal.join(" ")
          : bChildVal || "";
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  // Pagination logic
  const totalRows = filteredRows.length;
  const totalPages = pagination ? Math.ceil(totalRows / rowsPerPage) : 1;
  const startIndex = pagination ? (currentPage - 1) * rowsPerPage : 0;
  const endIndex = pagination ? startIndex + rowsPerPage : totalRows;
  const paginatedRows = pagination
    ? filteredRows.slice(startIndex, endIndex)
    : filteredRows;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="w-full px-2 sm:px-0">
      {/* Top Controls */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-3">
        {/* FILTER DROPDOWN */}
        <div className="relative w-full md:w-auto self-start">
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm bg-white flex items-center gap-2"
          >
            Filter
            <span className="text-xs">▼</span>
          </button>

          {isFilterOpen && (
            <div className="absolute mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4">
              <div className="mb-2 text-sm font-semibold text-gray-700">Filter</div>

              {/* Render dynamic filters for each custom filter passed to Table */}
              {customFilters.map((filter) => (
                <div key={filter.name} className="border border-gray-200 rounded-lg p-3 mb-3">
                  <div className="text-xs font-semibold text-gray-700 mb-2">
                    {filter.label}
                  </div>
                  <div className="max-h-40 overflow-y-auto"> {/* Scrollable container */}
                    {filter.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 text-xs mb-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters[filter.name]?.includes(opt)}
                          onChange={() => toggleFilterOption(filter.name, opt)}
                          className="rounded border-gray-300"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  className="px-4 py-1.5 text-xs rounded-lg bg-blue-500 text-white font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-[25%]">
          <input
            type="text"
            placeholder="Cari data..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none transition text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-[700px] sm:min-w-full border-collapse bg-white">
          <thead>
            <tr className="bg-blue-500 text-xs sm:text-sm">
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="p-2 sm:p-3 text-left cursor-pointer select-none text-white whitespace-nowrap"
                  onClick={() => handleSort(idx)}
                >
                  <div className="flex items-center">
                    {header}
                    {sortConfig.key === idx ? (
                      sortConfig.direction === "asc" ? (
                        <FaSortUp className="ml-1" />
                      ) : (
                        <FaSortDown className="ml-1" />
                      )
                    ) : (
                      <FaSort className="ml-1 opacity-50" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm">
            {paginatedRows.length > 0 ? (
              paginatedRows
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-4 text-gray-500 italic"
                >
                  Data Kosong Tidak Tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Controls */}
      {pagination && (
        <div className="mt-3 text-xs sm:text-sm text-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <span>
              Show {totalRows === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(endIndex, totalRows)} from {totalRows} data
            </span>

            <div className="flex gap-1 sm:gap-2 mt-2 md:mt-0 overflow-x-auto">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-1.5 sm:px-2 py-1 border rounded disabled:opacity-50 text-xs sm:text-sm"
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-1.5 sm:px-2 py-1 border rounded disabled:opacity-50 text-xs sm:text-sm"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`px-1.5 sm:px-2 py-1 border rounded text-xs sm:text-sm ${
                    currentPage === idx + 1
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-1.5 sm:px-2 py-1 border rounded disabled:opacity-50 text-xs sm:text-sm"
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-1.5 sm:px-2 py-1 border rounded disabled:opacity-50 text-xs sm:text-sm"
              >
                Last
              </button>
            </div>
          </div>

          {/* Show data move to bottom-center */}
          <div className="mt-3 flex justify-center">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-700 font-medium">Show</span>
              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-transparent border-b-2 border-gray-300 
                             focus:border-blue-500 outline-none px-1 py-1 pr-6 text-gray-800 
                             font-medium transition-all duration-200 text-sm"
                >
                  {[10, 25, 50, 100].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-1 top-2 w-4 h-4 text-gray-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <span className="text-gray-700 font-medium">data</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
