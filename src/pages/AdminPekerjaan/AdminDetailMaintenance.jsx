import React from "react";
import MainLayoutAdmin from "../../layouts/MainLayoutAdmin";  // Pastikan ini sudah benar
import DetailMaintenance from "@/components/LaporanPekerjaan/Maintenance/DetailMaintenance";

export default function AdminDetailMaintenance() {
  const maintenanceData = {
    nomorForm: "PM-NET-01:2025",
    tanggalPemeriksaan: "2025-08-27",
    timPelaksana: "Tim Jaringan Diskominfo",
    periodePelaksanaan: { mingguan: true },
    areaLokasi: { setdaA: true },
    pemeriksaanPerangkat: [
      { komponen: "AC", pemeriksaan: "Kelistrikan", hasil: "ok", catatan: "OK" },
    ],
    ringkasanPertemuan: "Semua berjalan normal.",
    rencanaTindakLanjut: "Monitor rutin.",
  };

  return (
    <MainLayoutAdmin>
      <DetailMaintenance data={maintenanceData} isAdmin={true} AdminLayout={MainLayoutAdmin} UserLayout={null} />
    </MainLayoutAdmin>
  );
}
