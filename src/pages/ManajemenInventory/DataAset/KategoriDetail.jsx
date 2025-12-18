// src/pages/KategoriDetail.jsx
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../layouts/MainLayout";
import Table from "../../../components/ManajemenInventory/DataBarang/Table";
import TableRowKD from "../../../components/ManajemenInventory/DataAset/TableRowKD";
import { Button } from "@/components/ui/button";

export default function KategoriDetail() {
  const navigate = useNavigate();
  const { kategori } = useParams();

  // Dummy data aset
  const dataAset = [
    {
      id: 1,
      nama: "Access Point unifi / ac-lr",
      merk: "78:8A:20:8C:3D:15",
      kategori: "Access Point",
      status: "Ok",
      jumlah: "7",
    },
    {
      id: 2,
      nama: "Router Huawei / hw-lr",
      merk: "78:8A:20:8C:3D:15",
      kategori: "Access Point",
      status: "Ok",
      jumlah: "5",
    },
    {
      id: 3,
      nama: "Switch Indihome / sw-lr",
      merk: "78:8A:20:8C:3D:15",
      kategori: "Access Point",
      status: "Ok",
      jumlah: "10",
    },
  ];

  const handlePinjam = (item) => {
    alert(`Meminjam aset: ${item.nama}`);
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="bg-white shadow rounded-xl p-6">
          {/* Judul */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Detail Kategori: {kategori || "Access Point"}
            </h2>
          </div>

          {/* ✅ Card View (Mobile Only) */}
          <div className="sm:hidden space-y-3">
            {dataAset.map((item, index) => (
              <div
                key={item.id}
                className="border rounded-lg p-3 shadow-sm bg-gray-50"
              >
                {/* Header: Nama + Nomor urut */}
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{item.nama}</h3>
                  <span className="text-xs font-bold text-gray-500">
                    #{index + 1}
                  </span>
                </div>

                {/* Detail info */}
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    Merk: <span className="font-medium">{item.merk}</span>
                  </p>
                  <p>
                    Kategori: <span className="font-medium">{item.kategori}</span>
                  </p>
                  <p>
                    Status:{" "}
                    <span className="font-medium text-green-600">{item.status}</span>
                  </p>
                  <p>
                    Jumlah: <span className="font-medium">{item.jumlah}</span>
                  </p>
                </div>

                {/* Tombol Pinjam */}
                <div className="mt-3">
                  <Button
                    onClick={() => handlePinjam(item)}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1"
                  >
                    Pinjam
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Table View (Desktop Only) - 🔹 Tanpa Filter */}
          <div className="hidden sm:block overflow-x-auto">
            <Table
              headers={[
                "No",
                "Nama Asset",
                "Merk",
                "Kategori",
                "Status",
                "Jumlah",
                "Aksi",
              ]}
              pagination={false}
              showFilter={false} // 🔹 Menyembunyikan filter
            >
              {dataAset.map((item, index) => (
                <TableRowKD
                  key={item.id}
                  item={item}
                  index={index}
                  onPinjam={handlePinjam}
                  noLink
                />
              ))}
            </Table>
          </div>

          {/* Footer jumlah aset */}
          <div className="mt-4 text-sm text-gray-600">
            Jumlah Asset: {dataAset.length}
          </div>

          {/* Tombol kembali */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}