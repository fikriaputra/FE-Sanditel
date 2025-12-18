// src/pages/ManajemenInventory/BarangKeluar/BarangKeluar.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Printer, Pencil, Trash2 } from "lucide-react";

import MainLayout from "../../../layouts/MainLayout";
import Table from "../../../components/ManajemenInventory/DataBarang/Table";
import TableRowBK from "../../../components/ManajemenInventory/BarangKeluar/TableRowBK";
import PrintTable from "../../../components/Shared/PrintTable";

export default function BarangKeluar() {
  const navigate = useNavigate();

  const pageTitle = "Daftar Barang Keluar";

  // State
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    namaBarang: [],
    bagian: [],
  });

  // ✅ HAPUS DUMMY -> ambil dari BE
  const [barangKeluar, setBarangKeluar] = useState([]);
  const [loading, setLoading] = useState(false);

  const headers = [
    "No",
    "No Transaksi",
    "Tgl Keluar",
    "Nama Barang",
    "Penerima",
    "Bagian",
    "Total Keluar",
    "Petugas",
    "Aksi",
  ];

  // Token (samain seperti halaman lain)
  const token = localStorage.getItem("token");

  // ✅ FETCH dari BE
  useEffect(() => {
    const controller = new AbortController();

    const fetchBarangKeluar = async () => {
      if (!token) {
        console.error("Token is missing");
        setBarangKeluar([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          "https://jungly-lathery-justin.ngrok-free.dev/api/barang-keluar",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          console.error("BE error:", json);
          setBarangKeluar([]);
          return;
        }

        // BE bisa balikin: array langsung atau { data: [...] }
        const rows = Array.isArray(json) ? json : json?.data ?? [];

        // Normalisasi field biar struktur UI kamu tetap sama
        const normalized = (rows || []).map((it, idx) => {
          const qty =
            it.totalKeluar ??
            it.jumlahKeluar ??
            it.jumlah_keluar ??
            it.total_keluar ??
            it.qty ??
            "";

          const unit =
            it.satuan ??
            it.satuan_barang ??
            it.unit ??
            it.barang?.satuan ??
            it.barang?.satuan_barang ??
            "";

          return {
            no: it.no ?? it.id ?? idx + 1,
            noTransaksi:
              it.noTransaksi ?? it.no_transaksi ?? it.kode_transaksi ?? "",
            tglKeluar:
              it.tglKeluar ?? it.tgl_keluar ?? it.tanggal_keluar ?? "",
            namaBarang:
              it.namaBarang ??
              it.nama_barang ??
              it.barang?.nama_barang ??
              it.barang?.namaBarang ??
              "",
            penerima:
              it.penerima ??
              it.recipient ??
              it.nama_penerima ??
              it.penerima_barang ??
              "",
            bagian: it.bagian ?? it.divisi ?? it.departemen ?? "",
            totalKeluar:
              it.totalKeluar ??
              (qty && unit ? `${qty} ${unit}` : qty ? String(qty) : ""),
            petugas:
              it.petugas ?? it.admin ?? it.user ?? it.created_by ?? "",
          };
        });

        setBarangKeluar(normalized);
      } catch (err) {
        if (err?.name !== "AbortError") console.error("Error fetching:", err);
        setBarangKeluar([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBarangKeluar();
    return () => controller.abort();
  }, [token]);

  // ✅ custom filter options diambil dari data BE (bukan dummy list)
  const namaBarangOptions = useMemo(() => {
    return Array.from(
      new Set((barangKeluar || []).map((x) => x.namaBarang).filter(Boolean))
    );
  }, [barangKeluar]);

  const bagianOptions = useMemo(() => {
    return Array.from(
      new Set((barangKeluar || []).map((x) => x.bagian).filter(Boolean))
    );
  }, [barangKeluar]);

  // Definisikan custom filters untuk Table
  const customFilters = [
    {
      name: "namaBarang",
      label: "Nama Barang",
      options: namaBarangOptions,
    },
    {
      name: "bagian",
      label: "Bagian",
      options: bagianOptions,
    },
  ];

  // Filter pencarian dan filter berdasarkan kategori
  const filteredData = useMemo(() => {
    let filtered = barangKeluar.filter((item) => {
      const searchMatch = Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      return searchMatch;
    });

    // Apply namaBarang filter
    if (filters.namaBarang.length > 0) {
      filtered = filtered.filter((item) =>
        filters.namaBarang.includes(item.namaBarang)
      );
    }

    // Apply bagian filter
    if (filters.bagian.length > 0) {
      filtered = filtered.filter((item) => filters.bagian.includes(item.bagian));
    }

    return filtered;
  }, [barangKeluar, search, filters]);

  // Handlers
  const handlePrint = () => window.print();

  const handleDelete = (no) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus data ini?");
    if (confirmDelete) {
      setBarangKeluar((prev) => prev.filter((item) => item.no !== no));
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
      <div className="bg-white rounded-lg shadow p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <h2 className="font-bold text-lg sm:text-xl">{pageTitle}</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm transition-colors justify-center"
              title="Print Data"
            >
              <Printer size={18} />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={() => navigate("/add-barang-keluar")}
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
                <div className="mb-2 text-sm font-semibold text-gray-700">
                  Filter
                </div>
                {customFilters.map((filter) => (
                  <div
                    key={filter.name}
                    className="border border-gray-200 rounded-lg p-3 mb-3"
                  >
                    <div className="text-xs font-semibold text-gray-700 mb-2">
                      {filter.label}
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {(filter.options || []).map((opt) => (
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
        <div className="sm:hidden space-y-3">
          {loading ? (
            <p className="text-center py-4 text-gray-500 italic">Loading...</p>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.no}
                className="border rounded-lg p-3 shadow-sm bg-gray-50 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{item.namaBarang}</h3>
                  <span className="text-sm text-gray-500">#{item.no}</span>
                </div>

                <p className="text-sm text-gray-600">
                  No Transaksi: <span className="font-medium">{item.noTransaksi}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Tgl Keluar: <span className="font-medium">{item.tglKeluar}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Penerima: <span className="font-medium">{item.penerima}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Bagian: <span className="font-medium">{item.bagian}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Total Keluar: <span className="font-medium">{item.totalKeluar}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Petugas: <span className="font-medium">{item.petugas}</span>
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/edit-barang-keluar/${item.no}`)}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-sm"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.no)}
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

        {/* Table (Desktop) */}
        <div className="hidden sm:block overflow-x-auto">
          <Table
            headers={headers}
            search={search}
            setSearch={setSearch}
            customFilters={customFilters}
          >
            {loading ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-4 text-gray-500 italic"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRowBK
                  key={item.no}
                  item={item}
                  onEdit={() => navigate(`/edit-barang-keluar/${item.no}`)}
                  onDelete={() => handleDelete(item.no)}
                  editIcon={<Pencil size={16} />}
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

      {/* Tabel khusus CETAK */}
      <PrintTable
        printId="print-barang-keluar"
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
            label: "No Transaksi",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.noTransaksi,
          },
          {
            label: "Tgl Keluar",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.tglKeluar,
          },
          {
            label: "Nama Barang",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.namaBarang,
          },
          {
            label: "Penerima",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.penerima,
          },
          {
            label: "Bagian",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.bagian,
          },
          {
            label: "Total Keluar",
            headerClassName: "text-center w-24",
            cellClassName: "text-center",
            render: (row) => row.totalKeluar,
          },
          {
            label: "Petugas",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.petugas,
          },
        ]}
      />
    </MainLayout>
  );
}
