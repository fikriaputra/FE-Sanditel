import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// 🔹 Data dummy lengkap (bisa kamu ganti nanti dengan data dari backend)
const dummyMaintenance = {
  nomorForm: "PM-NET-__ : __",
  tanggalPemeriksaan: "2025-08-27",
  timPelaksana: "Budi",
  periodePelaksanaan: {
    mingguan: true,
    bulanan: false,
    triwulanan: false,
    tahunan: false,
  },
  areaLokasi: {
    setdaA: true,
    setdaB: false,
    gedungSate: false,
    lainnya: false,
    lainnyaText: "",
  },
  // Step 1
  pemeriksaanPerangkat: [
    {
      komponen: "AC",
      pemeriksaan: "Kelistrikan, Suhu, Kebocoran",
      hasil: "ok",
      catatan: "blablabla",
    },
    {
      komponen: "Rack / Wallmount",
      pemeriksaan: "Rack Terkunci",
      hasil: "ok",
      catatan: "blablabla",
    },
    {
      komponen: "Kelistrikan",
      pemeriksaan: "Tidak ada kabel short (Tercium bau kabel terbakar)",
      hasil: "Tidak",
      catatan: "blablabla",
    },
    {
      komponen: "Switch Core",
      pemeriksaan: "Suhu perangkat, konfigurasi dan log perangkat",
      hasil: "ok",
      catatan: "blablabla",
    },
    {
      komponen: "Switch Access + PoE",
      pemeriksaan: "Suhu perangkat, konfigurasi dan log perangkat",
      hasil: "Tidak",
      catatan: "blablabla",
    },
    {
      komponen: "Perangkat ISP 1&2",
      pemeriksaan: "Last state perangkat (Nyala / Mati)",
      hasil: "ok",
      catatan: "blablabla",
    },
  ],
  // Step 2
  layananVirtualisasi: [
    {
      layanan: "DHCP Kea",
      komponen: "Lease sinkron, failover aktif",
      hasil: "tidak",
      catatan: "blablabla",
    },
    {
      layanan: "Pi-hole",
      komponen: "DNS filtering aktif, blokir berjalan",
      hasil: "ok",
      catatan: "blablabla",
    },
    {
      layanan: "Zabbix Monitoring",
      komponen: "Semua host terpantau, tidak ada alert merah",
      hasil: "ok",
      catatan: "blablabla",
    },
    {
      layanan: "NetBox",
      komponen: "Database & integrasi API normal",
      hasil: "ok",
      catatan: "blablabla",
    },
    {
      layanan: "Proxmox Cluster",
      komponen: "Semua node online, sync storage normal",
      hasil: "ok",
      catatan: "blablabla",
    },
    {
      layanan: "Backup Storage",
      komponen: "Snapshot tersedia & dapat di-restore",
      hasil: "ok",
      catatan: "blablabla",
    },
  ],
  keamanan: [
    {
      item: "Firewall / ACL",
      pemeriksaan:
        "Rule sesuai kebijakan, tidak ada akses antar VLAN unauthorized",
      hasil: "ok",
      catatan: "blablabla",
    },
    {
      item: "Update Sistem",
      pemeriksaan: "Patch keamanan terbaru terpasang",
      hasil: "tidak",
      catatan: "blablabla",
    },
    {
      item: "Login Audit",
      pemeriksaan: "Tidak ada login mencurigakan",
      hasil: "ok",
      catatan: "blablabla",
    },
    {
      item: "Password Policy",
      pemeriksaan: "Kebijakan rotasi password diterapkan",
      hasil: "ok",
      catatan: "blablabla",
    },
    {
      item: "Backup Offsite",
      pemeriksaan: "Backup mingguan berhasil dikirim",
      hasil: "ok",
      catatan: "blablabla",
    },
  ],
  // Step 3
  aksesJaringan: [
    {
      area: "Wireless (AP)",
      parameter: "Koneksi stabil, signal > -65dBm",
      hasil: "ok",
      catatan: "blablabla",
    },
    {
      area: "CCTV (VLAN 1020)",
      parameter: "Semua kamera online, NVR merekam",
      hasil: "tidak",
      catatan: "blablabla",
    },
    {
      area: "VoIP (VLAN 1030)",
      parameter: "Test call sukses antar extension",
      hasil: "ok",
      catatan: "blablabla",
    },
    {
      area: "Internet / ISP 1 & 2",
      parameter: "Load balance aktif, latency < 50ms",
      hasil: "ok",
      catatan: "blablabla",
    },
  ],
  statusUmum: {
    normal: true,
    adaTemuan: false,
    butuhTindakLanjut: false,
  },
  ringkasanPertemuan: "blablabla",
  rencanaTindakLanjut: "blablabla",
  tanggal: "2025-08-27",
};

// 🔹 Badge kecil untuk status
function Badge({ children, variant = "default" }) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
  const variants = {
    default: "bg-gray-200 text-gray-800",
    ok: "bg-green-100 text-green-700",
    tidak: "bg-red-100 text-red-700",
    info: "bg-indigo-100 text-indigo-700",
  };
  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
}

function HasilBadge({ value }) {
  if (!value) return <Badge>-</Badge>;
  const lower = String(value).toLowerCase();
  if (lower === "ok") return <Badge variant="ok">Ok</Badge>;
  if (lower === "tidak") return <Badge variant="tidak">Tidak</Badge>;
  return <Badge>{value}</Badge>;
}

export default function DetailMaintenance() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const data = {
    ...dummyMaintenance,
    ...(state?.maintenance || {}),
  };

  const periode = data.periodePelaksanaan || {};
  const areaLokasi = data.areaLokasi || {};
  const statusUmum = data.statusUmum || {};

  const periodeLabels = [
    { key: "mingguan", label: "Mingguan" },
    { key: "bulanan", label: "Bulanan" },
    { key: "triwulanan", label: "Triwulanan" },
    { key: "tahunan", label: "Tahunan" },
  ]
    .filter((p) => periode[p.key])
    .map((p) => p.label);

  const areaLabels = [
    areaLokasi.setdaA && "Gedung Setda A",
    areaLokasi.setdaB && "Gedung Setda B",
    areaLokasi.gedungSate && "Gedung Sate",
    areaLokasi.lainnya && (areaLokasi.lainnyaText || "Lainnya"),
  ].filter(Boolean);

  const statusUmumLabels = [
    statusUmum.normal && "Normal",
    statusUmum.adaTemuan && "Ada Temuan",
    statusUmum.butuhTindakLanjut && "Butuh Tindak Lanjut",
  ].filter(Boolean);

  const handleBack = () => navigate(-1);

  return (
    <div className="p-4 sm:p-6">
      {/* Tombol kembali di atas kartu, rata kiri */}
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm sm:text-base shadow-sm"
      >
        Kembali
      </button>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        {/* Header judul saja */}
        <div className="mb-4">
          <h1 className="text-lg sm:text-2xl font-bold">
            Detail Maintenance Jaringan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Rekap lengkap hasil Preventive Maintenance Jaringan.
          </p>
        </div>

        {/* Semua konten yang bisa di-print */}
        <div id="printArea" className="space-y-8">
          {/* 🔹 Informasi Kegiatan */}
          <section className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">
              Informasi Kegiatan
            </h3>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Nomor Form</p>
                <p className="font-medium">
                  {data.nomorForm || data.nomor_form || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Tim Pelaksana</p>
                <p className="font-medium">{data.timPelaksana || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500">Hari & Tanggal</p>
                <p className="font-medium">
                  {data.tanggalPemeriksaan || data.tanggal || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Area</p>
                <p className="font-medium">
                  {areaLabels.length > 0
                    ? areaLabels.join(", ")
                    : data.area || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Periode</p>
                {periodeLabels.length ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {periodeLabels.map((p) => (
                      <Badge key={p} variant="info">
                        {p}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="font-medium">{data.periode || "-"}</p>
                )}
              </div>
            </div>
          </section>

          {/* 🔹 Pemeriksaan Layanan & Virtualisasi */}
          <section className="space-y-3">
            <h3 className="text-sm sm:text-base font-semibold">
              Pemeriksaan Layanan & Virtualisasi
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border text-sm sm:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 sm:px-3 py-2 text-left font-medium">
                      Layanan / VM
                    </th>
                    <th className="border px-2 sm:px-3 py-2 text-left font-medium">
                      Komponen
                    </th>
                    <th className="border px-2 sm:px-3 py-2 text-center font-medium">
                      Hasil
                    </th>
                    <th className="border px-2 sm:px-3 py-2 text-left font-medium">
                      Tindakan/Catatan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(data.layananVirtualisasi || []).map((row) => (
                    <tr key={row.layanan}>
                      <td className="border px-2 sm:px-3 py-2 align-top">
                        {row.layanan}
                      </td>
                      <td className="border px-2 sm:px-3 py-2 align-top">
                        {row.komponen}
                      </td>
                      <td className="border px-2 sm:px-3 py-2 align-top text-center">
                        <HasilBadge value={row.hasil} />
                      </td>
                      <td className="border px-2 sm:px-3 py-2 align-top">
                        {row.catatan || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 🔹 Pemeriksaan Keamanan */}
          <section className="space-y-3">
            <h3 className="text-sm sm:text-base font-semibold">
              Pemeriksaan Keamanan
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border text-sm sm:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 sm:px-3 py-2 text-left font-medium">
                      Item
                    </th>
                    <th className="border px-2 sm:px-3 py-2 text-left font-medium">
                      Pemeriksaan
                    </th>
                    <th className="border px-2 sm:px-3 py-2 text-center font-medium">
                      Hasil
                    </th>
                    <th className="border px-2 sm:px-3 py-2 text-left font-medium">
                      Tindakan/Catatan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(data.keamanan || []).map((row) => (
                    <tr key={row.item}>
                      <td className="border px-2 sm:px-3 py-2 align-top">
                        {row.item}
                      </td>
                      <td className="border px-2 sm:px-3 py-2 align-top">
                        {row.pemeriksaan}
                      </td>
                      <td className="border px-2 sm:px-3 py-2 align-top text-center">
                        <HasilBadge value={row.hasil} />
                      </td>
                      <td className="border px-2 sm:px-3 py-2 align-top">
                        {row.catatan || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 🔹 Pemeriksaan Akses Jaringan & Layanan */}
          <section className="space-y-3">
            <h3 className="text-sm sm:text-base font-semibold">
              Pemeriksaan Akses Jaringan & Layanan
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border text-sm sm:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 sm:px-3 py-2 text-left font-medium">
                      Area
                    </th>
                    <th className="border px-2 sm:px-3 py-2 text-left font-medium">
                      Parameter
                    </th>
                    <th className="border px-2 sm:px-3 py-2 text-center font-medium">
                      Hasil
                    </th>
                    <th className="border px-2 sm:px-3 py-2 text-left font-medium">
                      Tindakan/Catatan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(data.aksesJaringan || []).map((row) => (
                    <tr key={row.area}>
                      <td className="border px-2 sm:px-3 py-2 align-top">
                        {row.area}
                      </td>
                      <td className="border px-2 sm:px-3 py-2 align-top">
                        {row.parameter}
                      </td>
                      <td className="border px-2 sm:px-3 py-2 align-top text-center">
                        <HasilBadge value={row.hasil} />
                      </td>
                      <td className="border px-2 sm:px-3 py-2 align-top">
                        {row.catatan || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 🔹 Kesimpulan & Rekomendasi */}
          <section className="space-y-4">
            <h3 className="text-sm sm:text-base font-semibold">
              Kesimpulan & Rekomendasi
            </h3>

            <div className="space-y-3 text-sm sm:text-base">
              <div>
                <p className="font-medium mb-1">Status Umum</p>
                {statusUmumLabels.length ? (
                  <div className="flex flex-wrap gap-2">
                    {statusUmumLabels.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">-</p>
                )}
              </div>

              <div>
                <p className="font-medium mb-1">Ringkasan Pertemuan</p>
                <p className="border rounded-lg px-3 py-2 bg-gray-50 whitespace-pre-line">
                  {data.ringkasanPertemuan || "-"}
                </p>
              </div>

              <div>
                <p className="font-medium mb-1">Rencana Tindak Lanjut</p>
                <p className="border rounded-lg px-3 py-2 bg-gray-50 whitespace-pre-line">
                  {data.rencanaTindakLanjut || "-"}
                </p>
              </div>

              <div>
                <p className="font-medium mb-1">Tanggal</p>
                <p className="border rounded-lg px-3 py-2 bg-gray-50 inline-block">
                  {data.tanggal || "-"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
