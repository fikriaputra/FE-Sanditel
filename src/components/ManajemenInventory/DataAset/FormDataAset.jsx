// src/components/DataAset/FormDataAset.jsx
import { useState } from "react";

export default function FormDataAset({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    assetName: "",
    brandCode: "",
    category: "",
    status: "",
    barcodeUpdateLog: "",
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
      assetName: "",
      brandCode: "",
      category: "",
      status: "",
      barcodeUpdateLog: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-2xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Form Tambah Data Aset
      </h2>

      {/* Asset Name */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Nama Aset</label>
        <input
          type="text"
          name="assetName"
          value={formData.assetName}
          onChange={handleChange}
          placeholder="Masukkan nama aset"
          className="w-full border rounded-lg px-3 py-2 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Brand/Code */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Merk/Kode</label>
        <input
          type="text"
          name="brandCode"
          value={formData.brandCode}
          onChange={handleChange}
          placeholder="Masukkan brand atau kode"
          className="w-full border rounded-lg px-3 py-2 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Kategori</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">-- Pilih Kategori --</option>
          <option value="Electronics">Elektronik</option>
          <option value="Furniture">Furnitur</option>
        </select>
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">-- Pilih Status --</option>
          <option value="Active">Aktif</option>
          <option value="Inactive">Tidak Aktif</option>
        </select>
      </div>

      {/* Barcode Update Log */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Log Pembaruan Barcode</label>
        <input
          type="date"
          name="barcodeUpdateLog"
          value={formData.barcodeUpdateLog}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto px-4 py-2 bg-gray-100 rounded-lg 
                     hover:bg-gray-200 transition"
        >
          Reset
        </button>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 
                       rounded-lg hover:bg-gray-400 transition"
          >
            Kembali
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white 
                       rounded-lg hover:bg-indigo-700 transition"
          >
            Simpan
          </button>
        </div>
      </div>
    </form>
  );
}
