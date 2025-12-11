// src/pages/DataAset.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../layouts/MainLayout";
import Table from "../../../components/ManajemenInventory/DataBarang/Table";
import TableRowDA from "../../../components/ManajemenInventory/DataAset/TableRowDA";
import { Filter, Barcode, Plus, Pencil, Trash2, QrCode } from "lucide-react";

export default function DataAset() {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([
    { number: 1, name: "Laptop Dell", brandCode: "Dell-LT-001", category: "Elektronik", status: "Aktif", barcodeLog: "2025-08-01" },
    { number: 2, name: "Projector Epson", brandCode: "Epson-PR-002", category: "Elektronik", status: "Tidak Aktif", barcodeLog: "2025-07-25" },
    { number: 3, name: "Kursi Kantor Ergo", brandCode: "Ergo-CH-003", category: "Furnitur", status: "Aktif", barcodeLog: "2025-07-20" },
    { number: 4, name: "Meja Rapat", brandCode: "IKEA-DS-004", category: "Furnitur", status: "Aktif", barcodeLog: "2025-08-02" },
    { number: 5, name: "Printer HP", brandCode: "HP-PR-005", category: "Elektronik", status: "Aktif", barcodeLog: "2025-07-15" },
    { number: 6, name: "Scanner Canon", brandCode: "Canon-SC-006", category: "Elektronik", status: "Tidak Aktif", barcodeLog: "2025-07-10" },
    { number: 7, name: "Meja Konferensi", brandCode: "IKEA-TB-007", category: "Furnitur", status: "Aktif", barcodeLog: "2025-08-05" },
    { number: 8, name: "Papan Tulis", brandCode: "WB-008", category: "Furnitur", status: "Aktif", barcodeLog: "2025-08-03" },
    { number: 9, name: "AC", brandCode: "LG-AC-009", category: "Elektronik", status: "Tidak Aktif", barcodeLog: "2025-07-30" },
    { number: 10, name: "Kamera CCTV", brandCode: "Hikvision-CC-010", category: "Elektronik", status: "Aktif", barcodeLog: "2025-08-04" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortCategory] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: [],
    status: [],
  });

  // Definisikan custom filters
  const customFilters = [
    {
      name: "category",
      label: "Kategori",
      options: ["Elektronik", "Furnitur"],
    },
    {
      name: "status",
      label: "Status",
      options: ["Aktif", "Tidak Aktif"],
    },
  ];

  const getStatusBadge = (status) =>
    status === "Aktif"
      ? "bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
      : "bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold";

  // Filter & Search
  const filteredAssets = useMemo(() => {
    let filtered = assets.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brandCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply sortCategory (tombol Sortir Kategori - fungsi berbeda)
    if (sortCategory) {
      filtered = filtered.filter((item) => item.category === sortCategory);
    }

    // Apply category filter (dari dropdown filter)
    if (filters.category.length > 0) {
      filtered = filtered.filter((item) => filters.category.includes(item.category));
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter((item) => filters.status.includes(item.status));
    }

    return filtered;
  }, [assets, searchTerm, sortCategory, filters]);

  // Fungsi untuk mengubah filter
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

  // Hapus aset dari state
  const handleDelete = (number) => {
    if (window.confirm("Yakin ingin menghapus aset ini?")) {
      setAssets((prev) => prev.filter((item) => item.number !== number));
    }
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <h2 className="font-bold text-lg">Daftar Data Aset</h2>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            {/* Add Asset */}
            <button
              onClick={() => navigate("/add-data-aset")}
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded shadow transition w-10 h-10 sm:w-auto sm:h-auto"
              title="Tambah Aset"
            >
              <Plus size={18} />
              <span className="hidden sm:inline ml-1">Tambah</span>
            </button>

            {/* Sort - Tombol ini tetap untuk sortir kategori (fungsi berbeda) */}
            <button
              onClick={() => navigate("/kategori")}
              className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded shadow transition w-10 h-10 sm:w-auto sm:h-auto"
              title="Sortir berdasarkan kategori"
            >
              <Filter size={18} />
              <span className="hidden sm:inline ml-1">Sortir Kategori</span>
            </button>

            {/* Scan Barcode */}
            <button
              onClick={() => navigate("/stok-opname")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded shadow transition w-10 h-10 sm:w-auto sm:h-auto"
              title="Scan Barcode"
            >
              <Barcode size={18} />
              <span className="hidden sm:inline ml-1">Scan Barcode</span>
            </button>
          </div>
        </div>

        {/* Search Bar Mobile */}
        <div className="sm:hidden mb-4 relative">
          <input
            type="text"
            placeholder="Cari aset..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Filter Mobile */}
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
                    onClick={() => setIsFilterOpen(false)}
                    className="px-4 py-1.5 text-xs rounded-lg bg-blue-500 text-white font-medium"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((item) => (
              <div
                key={item.number}
                className="border rounded-lg p-3 shadow-sm bg-gray-50 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <span className={getStatusBadge(item.status)}>{item.status}</span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Merk/Kode:</span> {item.brandCode}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Kategori:</span> {item.category}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Barcode Log:</span> {item.barcodeLog}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/edit-data-aset/${item.number}`)}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-sm"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() =>
                      alert(`Cek barcode untuk ${item.name} - Kode: ${item.brandCode}`)
                    }
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm"
                  >
                    <QrCode size={14} /> Barcode
                  </button>
                  <button
                    onClick={() => handleDelete(item.number)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-gray-500 italic">
              Data Kosong Tidak Tersedia
            </p>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <Table
            headers={[
              "No",
              "Nama Aset",
              "Merk/Kode",
              "Kategori",
              "Status",
              "Log Pembaruan Barcode",
              "Aksi",
            ]}
            customFilters={customFilters}
          >
            {filteredAssets.length > 0 ? (
              filteredAssets.map((item) => (
                <TableRowDA
                  key={item.number}
                  item={item}
                  onEdit={() => navigate(`/edit-data-aset/${item.number}`)}
                  onDelete={() => handleDelete(item.number)}
                  onCheckBarcode={() =>
                    alert(`Cek barcode untuk ${item.name} - Kode: ${item.brandCode}`)
                  }
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500 italic">
                  Data Kosong Tidak Tersedia
                </td>
              </tr>
            )}
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}