import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../layouts/MainLayout";
import Table from "../../../components/ManajemenInventory/DataBarang/Table";
import TableRowDB from "../../../components/ManajemenInventory/DataBarang/TableRowDB";
import { Printer, Plus, Pencil, Trash2 } from "lucide-react";
import PrintTable from "../../../components/Shared/PrintTable";
import "../../../index.css";

export default function DataBarang() {
  const navigate = useNavigate();

  const pageTitle = "Daftar Data Barang";

  // State
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    JenisBarang: [],
    Satuan: [],
  });

  const [dataBarang, setDataBarang] = useState([]);

  // Retrieve token (for example, from localStorage)
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

  // Fetch data from API when the component mounts
  useEffect(() => {
    if (token) {
      fetch("https://jungly-lathery-justin.ngrok-free.dev/api/data-barang", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Only use the relevant data (excluding created_at and updated_at)
          const filteredData = data.map((item) => ({
            id: item.id,
            kode_barang: item.kode_barang,
            nama_barang: item.nama_barang,
            jenis_barang: item.jenis_barang,
            stok: item.stok,
            satuan: item.satuan,
          }));
          setDataBarang(filteredData);
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      console.error("Token is missing");
    }
  }, [token]);

  const headers = ["No", "Id Barang","Nama Barang", "Jenis Barang", "Stok", "Satuan", "Aksi"];

  // Definisikan custom filters untuk Table
  const customFilters = [
    {
      name: "JenisBarang",
      label: "Jenis Barang",
      options: ["Elektronik", "Perlengkapan Kantor"],
    },
    {
      name: "Satuan",
      label: "Satuan",
      options: ["Unit", "Pcs"],
    },
  ];

  // Filter pencarian dan filter berdasarkan kategori
  const filteredData = useMemo(() => {
    let filtered = dataBarang.filter((barang) => {
      const searchMatch = Object.values(barang)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      return searchMatch;
    });

    // Apply JenisBarang filter
    if (filters.JenisBarang.length > 0) {
      filtered = filtered.filter((item) => filters.JenisBarang.includes(item.JenisBarang));
    }

    // Apply Satuan filter
    if (filters.Satuan.length > 0) {
      filtered = filtered.filter((item) => filters.Satuan.includes(item.Satuan));
    }

    return filtered;
  }, [dataBarang, search, filters]);

  // Handlers
  const handleTambah = () => navigate("/add-data-barang");
  const handlePrint = () => window.print();
  const handleEdit = (item) => navigate(`/edit-data-barang/${item.Number}`);
  const handleDelete = (item) => {
    if (window.confirm(`Yakin ingin menghapus ${item.NamaBarang}?`)) {
      setDataBarang((prev) =>
        prev.filter((barang) => barang.Number !== item.Number)
      );
    }
  };

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

  return (
    <MainLayout>
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <h2 className="font-bold text-lg sm:text-xl">{pageTitle}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Tombol Cetak */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm transition-colors justify-center"
            >
              <Printer size={18} />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            {/* Tombol Tambah */}
            <button
              onClick={handleTambah}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded shadow transition-transform hover:scale-105"
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

        {/* Card Mobile */}
        <div className="space-y-3 sm:hidden">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.Number}
                className="border rounded-lg p-3 shadow-sm flex flex-col gap-2 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    {item.NamaBarang}
                  </h3>
                  <span className="text-sm text-gray-500">#{item.Number}</span>
                </div>

                <p className="text-sm text-gray-600">
                  Jenis:{" "}
                  <span className="font-medium">{item.JenisBarang}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Stok:{" "}
                  <span className="font-medium">{item.Stok}</span>{" "}
                  {item.Satuan}
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-sm"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
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

        {/* Tabel Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <Table 
            headers={headers} 
            search={search} 
            setSearch={setSearch}
            customFilters={customFilters}
          >
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRowDB
                  key={item.Number}
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

      {/* Tabel khusus CETAK: pakai komponen PrintTable */}
      <PrintTable
        printId="print-data-barang"
        title={pageTitle}
        data={filteredData}
        emptyMessage="Data Kosong Tidak Tersedia"
        columns={[
          {
            label: "No",
            headerClassName: "text-center w-12",
            cellClassName: "text-center",
            render: (row, index) => index + 1,
          },
          {
            label: "Nama Barang",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.NamaBarang,
          },
          {
            label: "Jenis Barang",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.JenisBarang,
          },
          {
            label: "Stok",
            headerClassName: "text-center w-16",
            cellClassName: "text-center",
            render: (row) => row.Stok,
          },
          {
            label: "Satuan",
            headerClassName: "text-center w-20",
            cellClassName: "text-center",
            render: (row) => row.Satuan,
          },
        ]}
      />
    </MainLayout>
  );
}