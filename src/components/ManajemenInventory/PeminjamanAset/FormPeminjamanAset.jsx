import { useState } from "react";

export default function FormPeminjamanAset({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    aset: "",
    peminjam: "",
    bagian: "",       // ✅ Tambahan field Bagian
    tanggalPinjam: "",
    tanggalKembali: "",
    jumlah: "",
    sisaStok: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      aset: "",
      peminjam: "",
      bagian: "",       // ✅ Reset juga
      tanggalPinjam: "",
      tanggalKembali: "",
      jumlah: "",
      sisaStok: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-2xl"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-6">
        Form Peminjaman Aset
      </h2>

      {/* Nama Aset */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-sm sm:text-base">
          Nama Aset
        </label>
        <input
          type="text"
          name="aset"
          value={formData.aset}
          onChange={handleChange}
          placeholder="Nama aset..."
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
        />
      </div>

      {/* Peminjam */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-sm sm:text-base">
          Peminjam
        </label>
        <input
          type="text"
          name="peminjam"
          value={formData.peminjam}
          onChange={handleChange}
          placeholder="Nama peminjam..."
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
        />
      </div>

      {/* ✅ Bagian */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-sm sm:text-base">
          Bagian
        </label>
        <input
          type="text"
          name="bagian"
          value={formData.bagian}
          onChange={handleChange}
          placeholder="Bagian / Divisi..."
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
        />
      </div>

      {/* Tanggal Pinjam */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-sm sm:text-base">
          Tanggal Pinjam
        </label>
        <input
          type="date"
          name="tanggalPinjam"
          value={formData.tanggalPinjam}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
        />
      </div>

      {/* Tanggal Kembali */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-sm sm:text-base">
          Tanggal Kembali
        </label>
        <input
          type="date"
          name="tanggalKembali"
          value={formData.tanggalKembali}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
        />
      </div>

      {/* Jumlah */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-sm sm:text-base">
          Jumlah
        </label>
        <input
          type="number"
          name="jumlah"
          value={formData.jumlah}
          onChange={handleChange}
          placeholder="Jumlah aset dipinjam..."
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
        />
      </div>

      {/* Sisa Stok */}
      <div className="mb-6">
        <label className="block font-medium mb-1 text-sm sm:text-base">
          Sisa Stok
        </label>
        <input
          type="number"
          name="sisaStok"
          value={formData.sisaStok}
          onChange={handleChange}
          placeholder="Sisa stok tersedia..."
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
        />
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
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
