import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Trash2, Printer, Pencil } from "lucide-react";  // Pastikan ini ada di bagian import

import MainLayout2 from "@/layouts/MainLayout2";
import Table from "@/components/ManajemenInventory/DataBarang/Table";
import TableRowMT from "@/components/LaporanPekerjaan/Maintenance/TableRowMT";

export default function Maintenance() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Pastikan state filter dibuka/tutup ada

  // Dummy data sementara
  const [data, setData] = useState([
    {
      id: 1,
      nomorForm: "PM-NET-01:01",
      tanggal: "2025-08-10",
      periode: "Bulanan",
      timPelaksana: "Tim Jaringan 1",
      area: "Gedung Setda A",
    },
    {
      id: 2,
      nomorForm: "PM-NET-01:02",
      tanggal: "2025-08-09",
      periode: "Triwulanan",
      timPelaksana: "Tim Jaringan 2",
      area: "Gedung Setda B",
    },
    {
      id: 3,
      nomorForm: "PM-NET-01:03",
      tanggal: "2025-08-08",
      periode: "Mingguan",
      timPelaksana: "Tim Infrastruktur",
      area: "Gedung Sate",
    },
    {
      id: 4,
      nomorForm: "PM-NET-01:04",
      tanggal: "2025-08-07",
      periode: "Tahunan",
      timPelaksana: "Tim Jaringan 1",
      area: "Gedung Setda A",
    },
  ]);

  const [filters, setFilters] = useState({
    periode: [],
    timPelaksana: [],
    area: [],
  });

  // Filtered data based on search and selected filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search match
      const searchMatch = Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      // Filter match
      const filterMatch = Object.keys(filters).every((filterName) => {
        if (filters[filterName].length === 0) return true;
        return filters[filterName].includes(item[filterName]);
      });

      return searchMatch && filterMatch;
    });
  }, [data, search, filters]);

  // Handle filter change for different fields (periode, timPelaksana, area)
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      const selectedFilter = updatedFilters[filterName];
      if (selectedFilter.includes(value)) {
        updatedFilters[filterName] = selectedFilter.filter(
          (item) => item !== value
        );
      } else {
        updatedFilters[filterName] = [...selectedFilter, value];
      }
      return updatedFilters;
    });
  };

  // Function to handle the filter apply action
  const handleApplyFilter = () => {
    setIsFilterOpen(false); // Close the filter modal
  };

  // Custom filters for table columns
  const customFilters = [
    {
      name: "periode",
      label: "Periode",
      options: ["Bulanan", "Triwulanan", "Mingguan", "Tahunan"],
    },
    {
      name: "timPelaksana",
      label: "Tim Pelaksana",
      options: ["Tim Jaringan 1", "Tim Jaringan 2", "Tim Infrastruktur"],
    },
    {
      name: "area",
      label: "Area",
      options: ["Gedung Setda A", "Gedung Setda B", "Gedung Sate"],
    },
  ];

  const handleDelete = (index) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      setData((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout2>
      <div className="bg-white rounded-lg shadow p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <h2 className="font-bold text-lg">Daftar Maintenance Jaringan</h2>

          <div className="flex gap-2 flex-wrap">
            {/* Tombol Tambah */}
            <button
              onClick={() => navigate("/add-maintenance")}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition-transform hover:scale-105"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah</span>
            </button>
          </div>
        </div>

        {/* Search (Mobile) */}
        <div className="sm:hidden mb-4 relative">
          <input
            type="text"
            placeholder="Cari data..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </div>

        {/* Filter Mobile (Same as Desktop) */}
        <div className="sm:hidden mb-4">
          <div className="relative">
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
                {customFilters.map((filter) => (
                  <div key={filter.name} className="border border-gray-200 rounded-lg p-3 mb-3">
                    <div className="text-xs font-semibold text-gray-700 mb-2">
                      {filter.label}
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {filter.options.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 text-xs mb-1 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters[filter.name]?.includes(opt)}
                            onChange={() => handleFilterChange(filter.name, opt)}
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
                    onClick={handleApplyFilter} // Apply filter function
                    className="px-4 py-1.5 text-xs rounded-lg bg-blue-500 text-white font-medium"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card View (Mobile) */}
        <div className="sm:hidden space-y-3">
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
              <div
                key={item.id}
                className="border rounded-lg p-3 shadow-sm bg-gray-50 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    {item.nomorForm}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {item.tanggal}
                  </span>
                </div>

                <p className="text-sm">
                  <span className="font-medium">Periode:</span> {item.periode}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Tim Pelaksana:</span>{" "}
                  {item.timPelaksana}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Area:</span> {item.area}
                </p>

                {/* Actions (Mobile) */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button
                    onClick={() =>
                      navigate(`/detail-maintenance/${item.id}`, {
                        state: { maintenance: item },
                      })
                    }
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm"
                  >
                    <Eye size={14} /> <span>Lihat</span>
                  </button>

                  <button
                    onClick={() =>
                      navigate("/edit-maintenance", { state: { data: item } })
                    }
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-sm"
                  >
                    <Pencil size={14} /> <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(idx)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
                  >
                    <Trash2 size={14} /> <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-gray-500 italic">
              Tidak ada data
            </p>
          )}
        </div>

        {/* Table (Desktop) */}
        <div className="hidden sm:block overflow-x-auto">
          <Table
            headers={[
              "Nomor Form",
              "Tanggal",
              "Periode",
              "Tim Pelaksana",
              "Area",
              "Aksi",
            ]}
            customFilters={customFilters} // Menambahkan filters di sini
          >
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <TableRowMT
                  key={item.id}
                  item={item}
                  onView={() =>
                    navigate(`/detail-maintenance/${item.id}`, {
                      state: { maintenance: item },
                    })
                  }
                  onEdit={() =>
                    navigate("/edit-maintenance", { state: { data: item } })
                  }
                  onDelete={() => handleDelete(idx)}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 text-gray-500 italic"
                >
                  Tidak ada data tersedia
                </td>
              </tr>
            )}
          </Table>
        </div>
      </div>
    </MainLayout2>
  );
}
