import { useState, useEffect } from "react";

// 🔹 Cache di memory (nilai hanya reset jika halaman di-refresh)
let cachedEditMaintenance3 = null;

export default function FormEditMaintenance3({ onSubmit, onCancel, initialData }) {
  const initialState = {
    aksesJaringan: [
      { area: "Wireless (AP)", parameter: "Koneksi stabil, signal > -65dBm", hasil: "", catatan: "" },
      { area: "CCTV (VLAN 1020)", parameter: "Semua kamera online, NVR merekam", hasil: "", catatan: "" },
      { area: "VoIP (VLAN 1030)", parameter: "Test call sukses antar extension", hasil: "", catatan: "" },
      { area: "Internet / ISP 1 & 2", parameter: "Load balance aktif, latency < 50ms", hasil: "", catatan: "" },
    ],
    statusUmum: {
      normal: false,
      adaTemuan: false,
      butuhTindakLanjut: false,
    },
    ringkasanPertemuan: "",
    rencanaTindakLanjut: "",
    tanggal: "",
  };

  // Menggunakan state untuk form data dan mengambil data dari cache jika ada
  const [formData, setFormData] = useState(() => cachedEditMaintenance3 || initialData || initialState);

  // 🔹 Meng-update formData ketika initialData berubah
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        aksesJaringan: initialData.aksesJaringan || prev.aksesJaringan,
        statusUmum: initialData.statusUmum || prev.statusUmum,
      }));
    }
  }, [initialData]);

  // 🔹 Simpan data ke dalam cache setiap kali formData berubah
  useEffect(() => {
    cachedEditMaintenance3 = formData; // Simpan ke cache
  }, [formData]);

  // 🔹 Handler untuk input perubahan hasil dan catatan pada akses jaringan
  const handleAksesHasilChange = (index, value) => {
    const updated = [...formData.aksesJaringan];
    updated[index].hasil = value;
    setFormData(prev => ({ ...prev, aksesJaringan: updated }));
  };

  const handleAksesCatatanChange = (index, e) => {
    const { value } = e.target;
    const updated = [...formData.aksesJaringan];
    updated[index].catatan = value;
    setFormData(prev => ({ ...prev, aksesJaringan: updated }));
  };

  // 🔹 Handler untuk perubahan status umum
  const handleStatusChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      statusUmum: {
        ...prev.statusUmum,
        [name]: checked,
      },
    }));
  };

  // 🔹 Handler untuk perubahan teks dan tanggal
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 Fungsi reset data form
  const handleReset = () => {
    setFormData(initialData || initialState);
    cachedEditMaintenance3 = initialData || initialState; // Reset cache juga
  };

  // 🔹 Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("pemeriksaanAksesJaringan", JSON.stringify(formData.aksesJaringan));
    payload.append("statusUmum", JSON.stringify(formData.statusUmum));
    payload.append("ringkasanPertemuan", formData.ringkasanPertemuan);
    payload.append("rencanaTindakLanjut", formData.rencanaTindakLanjut);
    payload.append("tanggal", formData.tanggal);

    // Kirim data ke onSubmit
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-md sm:max-w-2xl mx-auto"
    >
      <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
        Form Edit Akses Jaringan &amp; Kesimpulan
      </h2>

      {/* Pemeriksaan Akses Jaringan */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm sm:text-base font-medium">Pemeriksaan Akses Jaringan &amp; Layanan</h3>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 sm:px-3 py-2 text-left font-medium">Area</th>
                <th className="border px-2 sm:px-3 py-2 text-left font-medium">Parameter</th>
                <th className="border px-2 sm:px-3 py-2 text-center font-medium">Hasil</th>
                <th className="border px-2 sm:px-3 py-2 text-left font-medium">Tindakan/Catatan</th>
              </tr>
            </thead>
            <tbody>
              {formData.aksesJaringan.map((row, index) => (
                <tr key={row.area}>
                  <td className="border px-2 sm:px-3 py-2 align-top">{row.area}</td>
                  <td className="border px-2 sm:px-3 py-2 align-top">{row.parameter}</td>
                  <td className="border px-2 sm:px-3 py-2 align-top text-center">
                    <div className="flex items-center justify-center gap-3 sm:gap-4">
                      <label className="inline-flex items-center gap-1 text-sm sm:text-base">
                        <input
                          type="radio"
                          name={`akses-hasil-${index}`}
                          value="ok"
                          checked={row.hasil === "ok"}
                          onChange={() => handleAksesHasilChange(index, "ok")}
                        />
                        <span>Ok</span>
                      </label>
                      <label className="inline-flex items-center gap-1 text-sm sm:text-base">
                        <input
                          type="radio"
                          name={`akses-hasil-${index}`}
                          value="tidak"
                          checked={row.hasil === "tidak"}
                          onChange={() => handleAksesHasilChange(index, "tidak")}
                        />
                        <span>Tidak</span>
                      </label>
                    </div>
                  </td>
                  <td className="border px-2 sm:px-3 py-2 align-top">
                    <input
                      type="text"
                      placeholder=""
                      value={row.catatan}
                      onChange={(e) => handleAksesCatatanChange(index, e)}
                      className="w-full border rounded-lg px-2 py-1 text-sm sm:text-base"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Umum */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm sm:text-base font-medium">Status Umum</h3>
        <div className="flex flex-wrap gap-3 border rounded-lg px-3 py-2">
          <label className="flex items-center gap-2 text-sm sm:text-base">
            <input
              type="checkbox"
              name="normal"
              checked={formData.statusUmum.normal}
              onChange={handleStatusChange}
            />
            <span>Normal</span>
          </label>
          <label className="flex items-center gap-2 text-sm sm:text-base">
            <input
              type="checkbox"
              name="adaTemuan"
              checked={formData.statusUmum.adaTemuan}
              onChange={handleStatusChange}
            />
            <span>Ada Temuan</span>
          </label>
          <label className="flex items-center gap-2 text-sm sm:text-base">
            <input
              type="checkbox"
              name="butuhTindakLanjut"
              checked={formData.statusUmum.butuhTindakLanjut}
              onChange={handleStatusChange}
            />
            <span>Butuh Tindakan Lanjut</span>
          </label>
        </div>
      </div>

      {/* Ringkasan Pertemuan */}
      <div>
        <label className="block text-sm sm:text-base font-medium mb-1">Ringkasan Pertemuan:</label>
        <textarea
          name="ringkasanPertemuan"
          value={formData.ringkasanPertemuan}
          onChange={handleTextChange}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
          placeholder=""
        />
      </div>

      {/* Rencana Tindak Lanjut */}
      <div>
        <label className="block text-sm sm:text-base font-medium mb-1">Rencana Tindak Lanjut:</label>
        <textarea
          name="rencanaTindakLanjut"
          value={formData.rencanaTindakLanjut}
          onChange={handleTextChange}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
          placeholder=""
        />
      </div>

      {/* Tanggal */}
      <div>
        <label className="block text-sm sm:text-base font-medium mb-1">Tanggal</label>
        <input
          type="date"
          name="tanggal"
          value={formData.tanggal}
          onChange={handleTextChange}
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
        />
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
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
            Simpan Perubahan
          </button>
        </div>
      </div>
    </form>
  );
}
