import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout2 from "../../../layouts/MainLayout2";
import { Plus, Trash2, Pencil } from "lucide-react";
import Table from "../../../components/ManajemenInventory/DataBarang/Table";
import TableRowPK from "../../../components/LaporanPekerjaan/Pekerjaan/TableRowPK";
import "../../../index.css";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function Pekerjaan() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Menambahkan state untuk membuka/tutup filter mobile

  const [filters, setFilters] = useState({
    JenisPekerjaan: [],
    Bagian: [],
    Status: [],
  });

  const [dataPekerjaan, setDataPekerjaan] = useState([
    {
      No: 1,
      HariTanggal: "2025-08-25",
      JenisPekerjaan: "Instalasi",
      Bagian: "CCTV",
      Petugas: "Budi",
      Status: "Dikerjakan",
    },
    {
      No: 2,
      HariTanggal: "2025-08-26",
      JenisPekerjaan: "Maintenance",
      Bagian: "Internet",
      Petugas: "Budi",
      Status: "Dikerjakan",
    },
    {
      No: 3,
      HariTanggal: "2025-08-27",
      JenisPekerjaan: "Troubleshooting",
      Bagian: "Telepon",
      Petugas: "Budi",
      Status: "Dikerjakan",
    },
  ]);

  const headers = [
    "No",
    "Hari Tanggal",
    "Jenis Pekerjaan",
    "Bagian",
    "Petugas",
    "Status",
    "Aksi",
  ];

  const customFilters = [
    {
      name: "JenisPekerjaan",
      label: "Jenis Pekerjaan",
      options: ["Instalasi", "Maintenance", "Troubleshooting"],
    },
    {
      name: "Bagian",
      label: "Bagian",
      options: ["CCTV", "Internet", "Telepon"],
    },
    {
      name: "Status",
      label: "Status",
      options: ["Dikerjakan", "Selesai", "Tidak Dikerjakan"],
    },
  ];

  // Filter berdasarkan pencarian dan filter yang dipilih
  const filteredData = useMemo(() => {
    return dataPekerjaan.filter((pekerjaan) => {
      const searchMatch = Object.values(pekerjaan)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const filterMatch = Object.keys(filters).every((filterName) => {
        if (filters[filterName].length === 0) return true;
        return filters[filterName].includes(pekerjaan[filterName]);
      });

      return searchMatch && filterMatch;
    });
  }, [dataPekerjaan, search, filters]);

  // Badge untuk status
  const getSubmissionBadge = (status) => {
    switch (status.toLowerCase()) {
      case "selesai":
        return "bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium";
      case "dikerjakan":
        return "bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium";
      case "tidak dikerjakan":
        return "bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-medium";
    }
  };

  // Handlers untuk menambah, mengedit, dan menghapus data
  const handleTambah = () => navigate("/add-pekerjaan");
  const handleDelete = (item) => {
    if (
      window.confirm(`Yakin ingin menghapus pekerjaan: ${item.JenisPekerjaan}?`)
    ) {
      setDataPekerjaan((prev) => prev.filter((pk) => pk.No !== item.No));
    }
  };

  const handleEdit = (item) => {
    navigate("/edit-pekerjaan", { state: { mode: "edit", data: item } });
  };

  // Fungsi untuk mengubah state filter
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

  return (
    <MainLayout2>
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow">
        {/* Header dan Search */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <h2 className="font-bold text-lg sm:text-xl">Daftar Pekerjaan</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleTambah}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded shadow transition-transform"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden mb-4 relative">
          <input
            type="text"
            placeholder="Cari pekerjaan..."
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

        {/* Mobile View: Filter Sections */}
        <div className="sm:hidden mb-4">
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)} // Mengubah state filter
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
                  onClick={() => setIsFilterOpen(false)} // Menutup filter setelah diterapkan
                  className="px-4 py-1.5 text-xs rounded-lg bg-blue-500 text-white font-medium"
                >
                  Terapkan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile View: Cards */}
        <div className="space-y-3 sm:hidden">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.No}
                className="border rounded-lg p-3 shadow-sm flex flex-col gap-2 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    {item.JenisPekerjaan}
                  </h3>
                  <span className="text-sm text-gray-500">#{item.No}</span>
                </div>

                <p className="text-sm text-gray-600">
                  Tanggal:{" "}
                  <span className="font-medium">{item.HariTanggal}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Bagian: <span className="font-medium">{item.Bagian}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Petugas: <span className="font-medium">{item.Petugas}</span>
                </p>

                {/* Status with badge */}
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  Status:{" "}
                  <span className={getSubmissionBadge(item.Status)}>{item.Status}</span>
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>

                  {/* Edit button */}
                  {item.Status.toLowerCase() === "dikerjakan" && (
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-sm"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-gray-500 italic">
              Data Kosong Tidak Tersedia
            </p>
          )}
        </div>

        {/* Desktop View: Table */}
        <div id="printArea" className="hidden sm:block overflow-x-auto">
          <Table
            headers={headers}
            search={search}
            setSearch={setSearch}
            customFilters={customFilters} // Menambahkan filter di sini
          >
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRowPK
                  key={item.No}
                  item={item}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item)}
                />
              ))
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
          </Table>
        </div>
      </div>
    </MainLayout2>
  );
}
