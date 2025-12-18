const RightPanel = () => {
  return (
    <div className="hidden md:flex w-1/2 bg-indigo-600 text-white items-center justify-center p-8 lg:p-10 relative rounded-l-[2rem] transition-all">
      {/* Kontak */}
      <div className="absolute top-4 right-4 text-xs lg:text-sm text-white">
      </div>

      {/* Konten utama */}
      <div className="text-center">
        <img
          src="/Biro-Umum-Setda-Jabar.png" // pastikan ada di public/
          alt="Illustration"
          className="mx-auto w-full max-w-[250px] lg:max-w-sm mb-4"
        />

        <h1 className="text-xl lg:text-2xl font-bold">
          SANDITEL APPS
        </h1>

        <p className="mt-3 text-xs lg:text-sm text-gray-300">
          Teknologi cerdas untuk operasional yang tertata{" "}
          <br className="hidden lg:block" />
          Satu sistem. Banyak solusi.
        </p>
      </div>
    </div>
  );
};

export default RightPanel;
