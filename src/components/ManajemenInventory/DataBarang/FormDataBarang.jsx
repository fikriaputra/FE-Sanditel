import { useState, useEffect } from "react";

export default function FormDataBarang({ onSubmit, onCancel, initialData, hideReset }) {
  const [formData, setFormData] = useState({
    idBarang: "B000010",
    namaBarang: "",
    jenisBarang: "",
    satuanBarang: "",
    stok: "",
  });

  // Isi form jika ada data awal (edit)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};


  const handleReset = () => {
    if (initialData) {
      setFormData(initialData); // reset ke data awal
    } else {
      setFormData({
        idBarang: "B000008",
        namaBarang: "",
        jenisBarang: "",
        satuanBarang: "",
        stok: "",
      });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = "5|DcKSYbWNiuy3b3FMnUbZGvL5ibgkAz8L5EKGg4sye58d8d70";

  const payload = {
    idBarang: formData.idBarang,
    namaBarang: formData.namaBarang,
    jenisBarang: formData.jenisBarang,
    satuanBarang: formData.satuanBarang,
    stok: Number(formData.stok),
  };

  try {
    const res = await fetch("https://jungly-lathery-justin.ngrok-free.dev/api/data-barang", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw data;

    onSubmit?.(data);
  } catch (err) {
    console.error("POST gagal:", err);
    alert(err?.message || "Gagal menyimpan data");
  }
};



  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-md sm:max-w-2xl mx-auto"
    >
      <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
        {initialData ? "Form Edit Barang" : "Form Tambah Barang"}
      </h2>

      {/* ID Barang */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-sm sm:text-base">ID Barang</label>
        <input
          type="text"
          name="idBarang"
          value={formData.idBarang}
          readOnly
          className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500 text-sm sm:text-base"
        />
      </div>

      {/* Nama Barang */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-sm sm:text-base">Nama Barang</label>
        <input
          type="text"
          name="namaBarang"
          value={formData.namaBarang}
          onChange={handleChange}
          placeholder="Nama Barang"
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
        />
      </div>

      {/* Jenis Barang */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-sm sm:text-base">Jenis Barang</label>
        <select
          name="jenisBarang"
          value={formData.jenisBarang}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
        >
          <option value="">-- Pilih Jenis Barang --</option>
          <option value="Alat">Alat</option>
          <option value="Elektronik">Elektronik</option>
          <option value="Perlengkapan Kantor">Perlengkapan Kantor</option>
        </select>
      </div>

      {/* Satuan Barang */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-sm sm:text-base">Satuan Barang</label>
        <select
          name="satuanBarang"
          value={formData.satuanBarang}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
        >
          <option value="">-- Pilih Satuan --</option>
          <option value="Unit">Unit</option>
          <option value="Pcs">Pcs</option>
          <option value="Box">Box</option>
        </select>
      </div>

      {/* Stok */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-sm sm:text-base">Stok</label>
        <input
          type="number"
          name="stok"
          value={formData.stok}
          onChange={handleChange}
          placeholder="Masukkan jumlah stok"
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
        />
      </div>

      {/* Tombol */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
        {!hideReset && (
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Reset
          </button>
        )}

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
            Simpan
          </button>
        </div>
      </div>
    </form>
  );
}
