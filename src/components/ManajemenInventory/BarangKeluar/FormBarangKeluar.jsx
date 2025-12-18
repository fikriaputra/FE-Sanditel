// src/components/FormBarangKeluar.jsx
import { useState, useEffect } from "react";

export default function FormBarangKeluar({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      noTransaksi: "T-BK-2508010001",
      tglKeluar: "",
      namaBarang: "",
      namaPenerima: "",
      bagian: "",
      totalKeluar: "",
      petugas: "",
    }
  );

  // kalau edit, biar form keisi
  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(
      initialData || {
        noTransaksi: "T-BK-2508010001",
        tglKeluar: "",
        namaBarang: "",
        namaPenerima: "",
        bagian: "",
        totalKeluar: "",
        petugas: "",
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // body sesuai yang kamu minta
  const requestBody = {
  tglKeluar: formData.tglKeluar,
  barang_id: Number(formData.barangId),   // <- dari dropdown barang
  namaPenerima: formData.namaPenerima,
  bagian: formData.bagian,
  totalKeluar: Number(formData.totalKeluar),
  petugas: formData.petugas,
};


    const token = localStorage.getItem("token"); // rekomendasi: simpan token login di sini

    try {
      const res = await fetch(
        "https://jungly-lathery-justin.ngrok-free.dev/api/barang-keluar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          json?.message ||
          (json?.errors
            ? Object.values(json.errors).flat().join(", ")
            : `Gagal menyimpan (HTTP ${res.status})`);
        alert(msg);
        return;
      }

      alert("Barang keluar berhasil disimpan!");
      onSubmit?.(json); // supaya parent bisa refresh tabel / close modal
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan / CORS. Coba lagi.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto space-y-4"
    >
      <h2 className="text-xl sm:text-2xl font-bold">
        Form Tambah Barang Keluar
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">No Transaksi</label>
          <input
            type="text"
            name="noTransaksi"
            value={formData.noTransaksi}
            disabled
            className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Keluar</label>
          <input
            type="date"
            name="tglKeluar"
            value={formData.tglKeluar}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nama Barang</label>
          <input
            type="text"
            name="namaBarang"
            value={formData.namaBarang}
            onChange={handleChange}
            placeholder="Masukkan nama barang"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nama Penerima</label>
          <input
            type="text"
            name="namaPenerima"
            value={formData.namaPenerima}
            onChange={handleChange}
            placeholder="Masukkan nama penerima"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bagian</label>
          <input
            type="text"
            name="bagian"
            value={formData.bagian}
            onChange={handleChange}
            placeholder="Masukkan bagian penerima"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Total Keluar</label>
          <input
            type="number"
            name="totalKeluar"
            value={formData.totalKeluar}
            onChange={handleChange}
            placeholder="Masukkan jumlah barang keluar"
            className="w-full border rounded-lg px-3 py-2"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Petugas</label>
          <input
            type="text"
            name="petugas"
            value={formData.petugas}
            onChange={handleChange}
            placeholder="Masukkan nama petugas"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          Reset
        </button>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Kembali
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Kirim
          </button>
        </div>
      </div>
    </form>
  );
}
