import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout2 from "@/layouts/MainLayout2";
import DetailMaintenance from "@/components/LaporanPekerjaan/Maintenance/DetailMaintenance";

export default function DetailMaintenancePage() {
  const navigate = useNavigate();
  const { state } = useLocation(); // Mendapatkan data dari state yang dikirim melalui navigate

  // Menyimpan data default untuk testing, yang akan digunakan jika state tidak ada
  const maintenanceData = state?.maintenance || {
    nomorForm: "PM-NET-01:2025",
    tanggalPemeriksaan: "2025-08-27",
    timPelaksana: "Tim Jaringan Diskominfo",
    periodePelaksanaan: { mingguan: true },
    areaLokasi: { setdaA: true },
    pemeriksaanPerangkat: [{ komponen: "AC", pemeriksaan: "Kelistrikan", hasil: "ok", catatan: "OK" }],
    ringkasanPertemuan: "Semua berjalan normal.",
    rencanaTindakLanjut: "Monitor rutin.",
  };

  return (
    <MainLayout2>
      <DetailMaintenance
        data={maintenanceData}
        isAdmin={false} // Menentukan apakah ini tampilan admin atau pengguna
        AdminLayout={null}
        UserLayout={MainLayout2}
      />
    </MainLayout2>
  );
}
