// src/components/SortableSearchableTable.jsx
import { useState, useMemo, useEffect } from "react";

export default function SortableSearchableTable({ columns, data, renderRow }) {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ default sort: cari kolom "no" dulu, kalau tidak ada pakai kolom pertama
  const [sortConfig, setSortConfig] = useState(() => {
    const noKey =
      columns?.find((c) => c.accessor?.toLowerCase() === "no")?.accessor ||
      columns?.[0]?.accessor ||
      null;

    return { key: noKey, direction: "asc" };
  });

  // kalau columns baru ke-load belakangan
  useEffect(() => {
    if (!sortConfig.key && columns?.length) {
      const noKey =
        columns.find((c) => c.accessor?.toLowerCase() === "no")?.accessor ||
        columns[0].accessor;

      setSortConfig({ key: noKey, direction: "asc" });
    }
  }, [columns, sortConfig.key]);

  // Filtering
  const filteredData = useMemo(() => {
    return (data || []).filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sorting (✅ numeric aware)
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a?.[sortConfig.key];
      const bVal = b?.[sortConfig.key];

      const aNum = Number(aVal);
      const bNum = Number(bVal);

      const bothNumeric = !Number.isNaN(aNum) && !Number.isNaN(bNum);

      if (bothNumeric) {
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }

      // fallback string compare
      const aStr = String(aVal ?? "");
      const bStr = String(bVal ?? "");
      const cmp = aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: "base" });

      return sortConfig.direction === "asc" ? cmp : -cmp;
    });
  }, [filteredData, sortConfig]);

  // Request sort
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Cari..."
          className="w-full sm:w-64 border px-3 py-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white text-sm uppercase">
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className={`p-3 text-left ${col.sortable ? "cursor-pointer select-none" : ""}`}
                  onClick={() => col.sortable && requestSort(col.accessor)}
                >
                  {col.title}
                  {sortConfig.key === col.accessor &&
                    (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>{sortedData.map((row, idx) => renderRow(row, idx))}</tbody>
        </table>
      </div>
    </div>
  );
}
