import { useLocation, useNavigate } from "react-router-dom";
import MainLayout2 from "../../../layouts/MainLayout2";
import FormEditMaintenance2 from "@/components/LaporanPekerjaan/Maintenance/FormEditMaintenance2";

// Fungsi untuk mengonversi FormData menjadi objek biasa
const formDataToObject = (formData) => 
  Object.fromEntries(formData.entries());

export default function EditMaintenance2() {
  const { state } = useLocation(); // Ambil data state dari halaman sebelumnya
  const navigate = useNavigate();

  // Ambil data sebelumnya dari state, jika ada
  const previousData = state?.data || {};

  // Fungsi untuk mengirim data ke halaman berikutnya
  const handleSubmit = (payload) => {
    const step2Data = formDataToObject(payload); // Mengubah FormData menjadi objek biasa

    // Gabungkan data dari step 1 dan step 2
    const merged = {
      ...previousData, // Data dari step 1
      ...step2Data,    // Data dari step 2 (pemeriksaanLayananVirtualisasi & pemeriksaanKeamanan)
    };

    console.log("Data hasil edit maintenance (step 1 + 2):", merged);

    // Lanjutkan ke halaman berikutnya dengan data gabungan
    navigate("/edit-maintenance3", { state: { data: merged } });
  };

  return (
    <MainLayout2>
      <FormEditMaintenance2
        initialData={previousData} // Kirim data awal ke form
        onSubmit={handleSubmit}     // Kirim data ke halaman berikutnya saat submit
        onCancel={() => navigate(-1)} // Kembali ke halaman sebelumnya
      />
    </MainLayout2>
  );
}
