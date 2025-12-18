// src/pages/ManajemenInventory/PeminjamanAset/PeminjamanAset.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, Plus, CopyPlus } from "lucide-react";

import MainLayout from "../../../layouts/MainLayout";
import Table from "../../../components/ManajemenInventory/DataBarang/Table";
import PrintTable from "../../../components/Shared/PrintTable";

export default function PeminjamanAset() {
  const navigate = useNavigate();

  const pageTitle = "Data Peminjaman Aset";

  // State
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    aset: [],
    bagian: [],
  });

  const [peminjamanAset] = useState([
    {
      number: 1,
      aset: "TL-SG1024D / TP-LINK",
      peminjam: "Biro Bia",
      bagian: "BKD",
      tglPinjam: "10-07-2025",
      tglKembali: "31-07-2025",
      jumlah: 1,
      sisaStok: 0,
    },
    {
      number: 2,
      aset: "Dell Laptop Latitude 3420",
      peminjam: "Budi",
      bagian: "Bagian IT",
      tglPinjam: "12-07-2025",
      tglKembali: "25-07-2025",
      jumlah: 2,
      sisaStok: 3,
    },
    {
      number: 3,
      aset: "Proyektor Epson X500",
      peminjam: "Sinta",
      bagian: "Biro Umum",
      tglPinjam: "15-07-2025",
      tglKembali: "30-07-2025",
      jumlah: 1,
      sisaStok: 1,
    },
    {
      number: 4,
      aset: "Kursi Kantor Ergonomic",
      peminjam: "Andi",
      bagian: "Divisi HRD",
      tglPinjam: "18-07-2025",
      tglKembali: "01-08-2025",
      jumlah: 5,
      sisaStok: 10,
    },
    {
      number: 5,
      aset: "Meja Rapat Kayu Jati",
      peminjam: "Rina",
      bagian: "Divisi Keuangan",
      tglPinjam: "20-07-2025",
      tglKembali: "05-08-2025",
      jumlah: 3,
      sisaStok: 2,
    },
    {
      number: 6,
      aset: "Printer Laser HP MFP",
      peminjam: "Dewi",
      bagian: "Divisi Pemasaran",
      tglPinjam: "22-07-2025",
      tglKembali: "06-08-2025",
      jumlah: 1,
      sisaStok: 4,
    },
    {
      number: 7,
      aset: "Whiteboard Magnetik",
      peminjam: "Agus",
      bagian: "Divisi Riset",
      tglPinjam: "25-07-2025",
      tglKembali: "10-08-2025",
      jumlah: 2,
      sisaStok: 3,
    },
  ]);

  const headers = [
    "No",
    "Nama Aset",
    "Peminjam",
    "Bagian",
    "Tanggal Pinjam",
    "Tanggal Kembali",
    "Jumlah",
    "Sisa Stok",
    "Aksi",
  ];

  // Definisikan custom filters untuk Table
  const customFilters = [
    {
      name: "aset",
      label: "Nama Aset",
      options: [
        "TL-SG1024D / TP-LINK",
        "Dell Laptop Latitude 3420",
        "Proyektor Epson X500",
      ],
    },
    {
      name: "bagian",
      label: "Bagian",
      options: [
        "Bagian IT",
        "Biro Umum",
        "Divisi HRD",
      ],
    },
  ];

  // Filter pencarian dan filter berdasarkan kategori
  const filteredData = useMemo(() => {
    let filtered = peminjamanAset.filter((item) => {
      const searchMatch = Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      return searchMatch;
    });

    // Apply aset filter
    if (filters.aset.length > 0) {
      filtered = filtered.filter((item) => filters.aset.includes(item.aset));
    }

    // Apply bagian filter
    if (filters.bagian.length > 0) {
      filtered = filtered.filter((item) => filters.bagian.includes(item.bagian));
    }

    return filtered;
  }, [peminjamanAset, search, filters]);

  // Handlers
  const handleTambah = () => navigate("/add-peminjaman-aset");
  const handleTambahMultiple = () => navigate("/peminjaman-multiple");
  const handlePrint = () => window.print();
  const handleKembalikan = (index) => {
    alert(`Aset dengan nomor ${peminjamanAset[index].number} dikembalikan`);
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
      <div className="bg-white rounded-lg shadow p-4">
        {/* Header Halaman */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <h2 className="text-xl font-bold">{pageTitle}</h2>

          {/* Tombol Aksi */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm transition-colors justify-center"
              title="Print Data"
            >
              <Printer size={18} />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            <button
              onClick={handleTambah}
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded shadow transition w-10 h-10 sm:w-auto sm:h-auto"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah</span>
            </button>

            <button
              onClick={handleTambahMultiple}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded shadow transition w-10 h-10 sm:w-auto sm:h-auto"
            >
              <CopyPlus size={18} />
              <span className="hidden sm:inline">Peminjaman Multiple</span>
            </button>
          </div>
        </div>

        {/* Search (Mobile) */}
        <div className="sm:hidden mb-4 relative">
          <input
            type="text"
            placeholder="Cari aset..."
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

        {/* Card View (Mobile) */}
        <div className="block sm:hidden space-y-3">
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
              <div
                key={idx}
                className="border rounded-lg shadow-sm p-3 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-bold text-gray-800">{item.aset}</div>
                  <span className="text-sm text-gray-500">#{item.number}</span>
                </div>

                <div className="text-sm text-gray-600">
                  Peminjam: {item.peminjam}
                </div>
                <div className="text-sm text-gray-600">Bagian: {item.bagian}</div>
                <div className="text-sm text-gray-600">
                  Tgl Pinjam: {item.tglPinjam}
                </div>
                <div className="text-sm text-gray-600">
                  Tgl Kembali: {item.tglKembali}
                </div>
                <div className="text-sm text-gray-600">Jumlah: {item.jumlah}</div>
                <div className="text-sm text-gray-600">
                  Sisa Stok:{" "}
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      item.sisaStok > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.sisaStok}
                  </span>
                </div>

                <div className="mt-2">
                  <button
                    onClick={() => handleKembalikan(idx)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded shadow text-sm"
                  >
                    Kembalikan
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

        {/* Table View (Desktop) */}
        <div className="hidden sm:block overflow-x-auto">
          <Table
            headers={headers}
            search={search}
            setSearch={setSearch}
            customFilters={customFilters}
          >
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-sm font-semibold text-gray-800">
                    {item.number}
                  </td>
                  <td className="p-3 text-sm text-gray-600 font-medium">
                    {item.aset}
                  </td>
                  <td className="p-3 text-sm text-gray-600 font-medium">
                    {item.peminjam}
                  </td>
                  <td className="p-3 text-sm text-gray-600 font-medium">
                    {item.bagian}
                  </td>
                  <td className="p-3 text-sm text-gray-600 font-medium whitespace-nowrap">
                    {item.tglPinjam}
                  </td>
                  <td className="p-3 text-sm text-gray-600 font-medium whitespace-nowrap">
                    {item.tglKembali}
                  </td>
                  <td className="p-3 text-sm text-gray-600 font-medium">
                    {item.jumlah}
                  </td>
                  <td className="p-3 text-sm text-gray-600 font-medium">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        item.sisaStok > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.sisaStok}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleKembalikan(idx)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow text-sm"
                    >
                      Kembalikan
                    </button>
                  </td>
                </tr>
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

      {/* CETAK: pakai komponen PrintTable */}
      <PrintTable
        printId="print-peminjaman-aset"
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
            label: "Nama Aset",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.aset,
          },
          {
            label: "Peminjam",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.peminjam,
          },
          {
            label: "Bagian",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.bagian,
          },
          {
            label: "Tanggal Pinjam",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.tglPinjam,
          },
          {
            label: "Tanggal Kembali",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.tglKembali,
          },
          {
            label: "Jumlah",
            headerClassName: "text-center w-16",
            cellClassName: "text-center",
            render: (row) => row.jumlah,
          },
          {
            label: "Sisa Stok",
            headerClassName: "text-center w-16",
            cellClassName: "text-center",
            render: (row) => row.sisaStok,
          },
        ]}
      />
    </MainLayout>
  );
}