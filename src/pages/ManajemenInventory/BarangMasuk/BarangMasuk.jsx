import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../layouts/MainLayout";
import Table from "../../../components/ManajemenInventory/DataBarang/Table";
import TableRowBM from "../../../components/ManajemenInventory/BarangMasuk/TableRowBM";
import { Plus, Printer, Pencil, Trash2 } from "lucide-react";
import PrintTable from "../../../components/Shared/PrintTable";

export default function BarangMasuk() {
  const navigate = useNavigate();

  const pageTitle = "Daftar Barang Masuk";

  // State
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    kategori: [],
    namaBarang: [],
  });

  // ✅ HAPUS DUMMY -> ambil dari BE
  const [barangMasuk, setBarangMasuk] = useState([]);
  const [loading, setLoading] = useState(false);

  const headers = [
    "No",
    "No Transaksi",
    "Tgl Masuk",
    "Kategori",
    "Nama Barang",
    "Jumlah Masuk",
    "Admin",
    "Aksi",
  ];

  // Token (samain seperti halaman lain)
  const token = localStorage.getItem("token");

  // ✅ FETCH dari BE
  useEffect(() => {
    const controller = new AbortController();

    const fetchBarangMasuk = async () => {
      if (!token) {
        console.error("Token is missing");
        setBarangMasuk([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          "https://jungly-lathery-justin.ngrok-free.dev/api/barang-masuk",
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

        // Kalau BE error, anggap data kosong (tapi tetap log buat debug)
        if (!res.ok) {
          console.error("BE error:", json);
          setBarangMasuk([]);
          return;
        }

        // BE bisa balikin: array langsung atau { data: [...] }
        const rows = Array.isArray(json) ? json : json?.data ?? [];

        // Normalisasi field biar struktur UI kamu tetap sama
        const normalized = (rows || []).map((it, idx) => ({
          no: it.no ?? it.id ?? idx + 1,
          noTransaksi: it.noTransaksi ?? it.no_transaksi ?? it.kode_transaksi ?? "",
          tglMasuk: it.tglMasuk ?? it.tgl_masuk ?? it.tanggal_masuk ?? "",
          kategori: it.kategori ?? it.category ?? "",
          namaBarang: it.namaBarang ?? it.nama_barang ?? "",
          jumlahMasuk: it.jumlahMasuk ?? it.jumlah_masuk ?? it.qty ?? "",
          admin: it.admin ?? it.created_by ?? it.user ?? "",
        }));

        setBarangMasuk(normalized);
      } catch (err) {
        if (err?.name !== "AbortError") console.error("Error fetching:", err);
        setBarangMasuk([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBarangMasuk();
    return () => controller.abort();
  }, [token]);

  // ✅ custom filter options diambil dari data BE (bukan dummy list)
  const kategoriOptions = useMemo(() => {
    return Array.from(
      new Set((barangMasuk || []).map((x) => x.kategori).filter(Boolean))
    );
  }, [barangMasuk]);

  const namaBarangOptions = useMemo(() => {
    return Array.from(
      new Set((barangMasuk || []).map((x) => x.namaBarang).filter(Boolean))
    );
  }, [barangMasuk]);

  // Definisikan custom filters untuk Table
  const customFilters = [
    {
      name: "kategori",
      label: "Kategori",
      options: kategoriOptions,
    },
    {
      name: "namaBarang",
      label: "Nama Barang",
      options: namaBarangOptions,
    },
  ];

  // Filter pencarian dan filter berdasarkan kategori
  const filteredData = useMemo(() => {
    let filtered = barangMasuk.filter((item) => {
      const searchMatch = Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      return searchMatch;
    });

    // Apply kategori filter
    if (filters.kategori.length > 0) {
      filtered = filtered.filter((item) =>
        filters.kategori.includes(item.kategori)
      );
    }

    // Apply namaBarang filter
    if (filters.namaBarang.length > 0) {
      filtered = filtered.filter((item) =>
        filters.namaBarang.includes(item.namaBarang)
      );
    }

    return filtered;
  }, [barangMasuk, search, filters]);

  // Handlers
  const handlePrint = () => window.print();

  const handleDelete = (no) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus data ini?");
    if (confirmDelete) {
      setBarangMasuk((prev) => prev.filter((item) => item.no !== no));
    }
  };

  // ✅ FIX TYPO handleFilterChange (yang sebelumnya bikin error)
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
              onClick={() => navigate("/add-barang-masuk")}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition-transform hover:scale-105"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah</span>
            </button>
          </div>
        </div>

        {/* Search untuk Mobile */}
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
                  <h3 className="font-semibold text-gray-800">
                    {item.namaBarang}
                  </h3>
                  <span className="text-sm text-gray-500">#{item.no}</span>
                </div>

                <p className="text-sm text-gray-600">
                  No Transaksi:{" "}
                  <span className="font-medium">{item.noTransaksi}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Tgl Masuk: <span className="font-medium">{item.tglMasuk}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Kategori: <span className="font-medium">{item.kategori}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Jumlah: <span className="font-medium">{item.jumlahMasuk}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Admin: <span className="font-medium">{item.admin}</span>
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/edit-barang-masuk/${item.no}`)}
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
                <TableRowBM
                  key={item.no}
                  item={item}
                  onEdit={() => navigate(`/edit-barang-masuk/${item.no}`)}
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
        printId="print-barang-masuk"
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
            label: "Tgl Masuk",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.tglMasuk,
          },
          {
            label: "Kategori",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.kategori,
          },
          {
            label: "Nama Barang",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.namaBarang,
          },
          {
            label: "Jumlah Masuk",
            headerClassName: "text-center w-24",
            cellClassName: "text-center",
            render: (row) => row.jumlahMasuk,
          },
          {
            label: "Admin",
            headerClassName: "text-left",
            cellClassName: "text-left",
            render: (row) => row.admin,
          },
        ]}
      />
    </MainLayout>
  );
}
