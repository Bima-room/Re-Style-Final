document.addEventListener("DOMContentLoaded", function () {
  const selectTipe = document.getElementById("filter-tipe");
  const selectWarna = document.getElementById("filter-warna");
  const selectBahan = document.getElementById("filter-bahan");
  const selectCelana = document.getElementById("filter-celana");
  const btnFilter = document.getElementById("btn-proses-filter");
  const hasilRekomendasiBox = document.getElementById("hasil-rekomendasi");
  const errorBanner = document.getElementById("filter-error-msg");

  // --- LOGIKA INTERAKTIF: OTOMATISASI DAN PEMBATASAN BAHAN KAIN ---
  if (selectTipe) {
    selectTipe.addEventListener("change", function () {
      const tipeTerpilih = selectTipe.value;
      if (tipeTerpilih === "jaket_denim") selectBahan.value = "denim";
      else if (tipeTerpilih === "sweater" || tipeTerpilih === "cardigan")
        selectBahan.value = "wool";
      else if (tipeTerpilih === "hoodie") selectBahan.value = "fleece";
      else if (
        tipeTerpilih === "kaos" ||
        tipeTerpilih === "blus" ||
        tipeTerpilih === "kemeja" ||
        tipeTerpilih === "blazer"
      )
        selectBahan.value = "katun";
    });
  }

  // --- DATABASE KAMUS WARNA YANG SUDAH DIPERBANYAK (14 WARNA LENGKAP) ---
  const databaseWarna = {
    // Earth Tone & Neutral
    navy: {
      nama: "Biru Tua (Navy)",
      hex: "#0a2273",
      matchTxt: ["Abu-abu", "Krem", "Putih", "Burgundy"],
      matchHex: ["#aeb1b6", "#ffe4c4", "#ffffff", "#6b1d2f"],
    },
    krem: {
      nama: "Beige (Krem)",
      hex: "#decfa7",
      matchTxt: ["Hitam", "Cokelat Tua", "Olive Green", "Putih"],
      matchHex: ["#1c1c1c", "#3b2a26", "#4b5338", "#ffffff"],
    },
    cokelat: {
      nama: "Cokelat (Brown)",
      hex: "#3b2a26",
      matchTxt: ["Milk White", "Dusty Pink", "Beige", "Olive Green"],
      matchHex: ["#faf6ee", "#e1b3b3", "#decfa7", "#4b5338"],
    },
    olive: {
      nama: "Olive Green",
      hex: "#4b5338",
      matchTxt: ["Putih Bersih", "Beige (Krem)", "Cokelat Tua", "Hitam"],
      matchHex: ["#ffffff", "#decfa7", "#3b2a26", "#1c1c1c"],
    },
    hitam: {
      nama: "Hitam (Black)",
      hex: "#1c1c1c",
      matchTxt: ["Putih Bersih", "Abu-abu", "Mustard Yellow", "Terracotta"],
      matchHex: ["#ffffff", "#aeb1b6", "#e5a93b", "#c45a3a"],
    },
    abu: {
      nama: "Abu-abu (Grey)",
      hex: "#aeb1b6",
      matchTxt: ["Hitam", "Navy", "Lilac", "Putih"],
      matchHex: ["#1c1c1c", "#0a2273", "#d1c4e9", "#ffffff"],
    },

    // Soft Pastel Tone
    kuning_pastel: {
      nama: "Kuning Pastel",
      hex: "#f9e5b9",
      matchTxt: ["Mint Soft", "Navy", "Putih Bersih", "Cokelat Tua"],
      matchHex: ["#cbd5d5", "#0a2273", "#ffffff", "#3b2a26"],
    },
    dusty_pink: {
      nama: "Dusty Pink",
      hex: "#e1b3b3",
      matchTxt: ["Putih Bersih", "Abu-abu", "Navy", "Beige (Krem)"],
      matchHex: ["#ffffff", "#aeb1b6", "#0a2273", "#decfa7"],
    },
    lilac: {
      nama: "Lilac (Ungu Muda)",
      hex: "#d1c4e9",
      matchTxt: ["Putih Bersih", "Hitam", "Denim Blue", "Abu-abu"],
      matchHex: ["#ffffff", "#1c1c1c", "#87aedb", "#aeb1b6"],
    },
    mint: {
      nama: "Mint Green",
      hex: "#c8e6c9",
      matchTxt: ["Putih Bersih", "Cokelat Tua", "Beige (Krem)", "Hitam"],
      matchHex: ["#ffffff", "#3b2a26", "#decfa7", "#1c1c1c"],
    },

    // Bold & Bright
    terracotta: {
      nama: "Terracotta (Bata)",
      hex: "#c45a3a",
      matchTxt: ["Hitam", "Beige (Krem)", "Putih Bersih", "Olive Green"],
      matchHex: ["#1c1c1c", "#decfa7", "#ffffff", "#4b5338"],
    },
    burgundy: {
      nama: "Burgundy (Marun)",
      hex: "#6b1d2f",
      matchTxt: ["Putih Bersih", "Hitam", "Beige (Krem)", "Abu-abu"],
      matchHex: ["#ffffff", "#1c1c1c", "#decfa7", "#aeb1b6"],
    },
    mustard: {
      nama: "Mustard Yellow",
      hex: "#e5a93b",
      matchTxt: ["Hitam", "Navy", "Olive Green", "Putih Bersih"],
      matchHex: ["#1c1c1c", "#0a2273", "#4b5338", "#ffffff"],
    },
    emerald: {
      nama: "Emerald Green",
      hex: "#046340",
      matchTxt: ["Putih Bersih", "Beige (Krem)", "Hitam", "Krem Soft"],
      matchHex: ["#ffffff", "#decfa7", "#1c1c1c", "#ffe4c4"],
    },

    // Fallback global jika user tidak memilih warna
    semua: {
      nama: "Warna Bebas",
      hex: "#777777",
      matchTxt: ["Hitam", "Putih Bersih"],
      matchHex: ["#1c1c1c", "#ffffff"],
    },
  };

  // Database gambar celana ini di bawah databaseWarna
const databaseGambarCelana = {
  "baggy_grey": "assets/celana-baggy-grey.png",
  "cargo_white": "assets/celana-cargo-white.png",
  "jeans_blue": "assets/celana-jeans-light-blue.png",
  "kain_beige": "assets/celana-kain-beige.png",
  "jeans_black": "assets/celana-jeans-black.png",
  "slacks_grey": "assets/celana-slacks-grey.png",
  "cargo_green": "assets/celana-cargo-green.png",
  "jeans_sobek": "assets/celana-jeans-sobek.png",
  "semua": "assets/celana-jeans-black.png" // Gambar default jika user tidak milih celana spesifik
};

  // --- LOGIKA UTAMA PROSES FILTER ---
  if (btnFilter) {
    btnFilter.addEventListener("click", function () {
      const tipe = selectTipe.value;
      const warna = selectWarna.value;
      const bahan = selectBahan.value;

      // Validasi: Minimal harus memilih 2 kategori
      let jumlahKategoriTerpilih = 0;
      if (tipe !== "semua") jumlahKategoriTerpilih++;
      if (warna !== "semua") jumlahKategoriTerpilih++;
      if (bahan !== "semua") jumlahKategoriTerpilih++;

      if (jumlahKategoriTerpilih < 2) {
        errorBanner.innerText =
          "⚠️ Mohon tentukan minimal 2 kategori filter agar sistem RE:STYLE bisa mencarikan paduan gaya yang akurat!";
        errorBanner.classList.remove("d-none");
        hasilRekomendasiBox.classList.add("d-none");
        return;
      }

      errorBanner.classList.add("d-none");

      // Tangkap Element Output HTML
      const resNama = document.getElementById("rekomendasi-nama-baju");
      const resBawahan = document.getElementById("rekomendasi-bawahan");
      const resAksesoris = document.getElementById("rekomendasi-aksesoris");
      const resTeks = document.getElementById("rekomendasi-teks-panduan");
      const resGambar = document.getElementById("rekomendasi-gambar-img");
      const resGambarAtasan = document.getElementById("rekomendasi-atasan-img");
const resGambarBawahan = document.getElementById("rekomendasi-bawahan-img");

      const bulletWarnaUtama = document.getElementById(
        "filter-warna-terpilih-bullet"
      );
      const namaWarnaUtama = document.getElementById(
        "filter-warna-terpilih-nama"
      );
      const containerBadgeKombinasi = document.getElementById(
        "rekomendasi-warna-badges"
      );

      const celanaTerpilih = selectCelana ? selectCelana.value : "semua";

      // STEP A: PROSES LOGIKA WARNA (Dinami & Akurat)
      const dataWarnaAktif = databaseWarna[warna] || databaseWarna["semua"];
      bulletWarnaUtama.style.backgroundColor = dataWarnaAktif.hex;
      namaWarnaUtama.innerText = dataWarnaAktif.nama;

      // Bersihkan dan Cetak Badge Rekomendasi Warna Baru Berdasarkan Filter Warna
      containerBadgeKombinasi.innerHTML = "";
      dataWarnaAktif.matchTxt.forEach((namaWarnaPasangan, index) => {
        const hexPasangan = dataWarnaAktif.matchHex[index];
        // Atur warna teks badge (hitam/putih) agar kontras dengan warna background badgenya
        const warnaTeks =
          hexPasangan === "#ffffff" ||
          hexPasangan === "#faf6ee" ||
          hexPasangan === "#ffe4c4" ||
          hexPasangan === "#aeb1b6"
            ? "#111111"
            : "#ffffff";

        containerBadgeKombinasi.innerHTML += `<span class="badge" style="background-color: ${hexPasangan}; color: ${warnaTeks}; border: 1px solid #ccc; margin-right: 6px; padding: 4px 10px; border-radius: 4px; font-size: 13px; font-weight:600;">${namaWarnaPasangan}</span>`;
      });

      // STEP B: PROSES LOGIKA TIPE PAKAIAN (Menentukan Template Fashion)
      // Menyisipkan nama warna pilihan secara dinamis ke dalam teks panduan gaya
      const txtWarna = dataWarnaAktif.nama;

      if (tipe === "sweater") {
        resNama.innerText = `Gaya Cozy Layering (Sweater ${txtWarna})`;
        resAksesoris.innerText = "Sling Bag Kulit Lokal & Sepatu Sneakers Putih";
        resTeks.innerText = `Pakaian berwarna ${txtWarna} sangat bagus dipadukan dengan inner kemeja putih di dalam sweater. Keluarkan bagian kerah kemeja untuk menciptakan kesan preppy look ala mahasiswa yang berkelas.`;
        resGambarAtasan.src = "assets/sweater-combo.png";
      } else if (tipe === "kemeja") {
        resNama.innerText = `Gaya Smart Casual (Kemeja ${txtWarna})`;
        resAksesoris.innerText = "Jam Tangan Kulit Minimalis & Sepatu Loafers";
        resTeks.innerText = `Kemeja berwarna ${txtWarna} ini sangat ideal untuk presentasi kuliah. Biarkan kancing paling atas terbuka dan gulung lengan hingga 3/4 lengan secara rapi agar tetap kasual.`;
        resGambarAtasan.src = "assets/kemeja-combo.png";
      } else if (tipe === "kaos") {
        resNama.innerText = `Gaya Minimalis Streetwear (Kaos ${txtWarna})`;
        resAksesoris.innerText = "Topi Beanie Rajut, Totebag Kanvas, & Kalung Rantai Tipis";
        resTeks.innerText = `Gaya santai sehari-hari. Selipkan bagian bawah kaos ${txtWarna} milikmu ke dalam celana (teknik tuck-in) untuk memberikan ilusi tubuh yang lebih jenjang dan rapi.`;
        resGambarAtasan.src = "assets/kaos-combo.png";
      } else if (tipe === "jaket_denim") {
        resNama.innerText = "Gaya Urban Explorer (Jaket Denim Core)";
        resAksesoris.innerText = "Kacamata Hitam / Jam Tangan Sporty";
        resTeks.innerText = `Menggunakan Jaket Denim dengan kombinasi dalaman berwarna ${txtWarna} memberikan kontras struktur pakaian yang tegas, maskulin, dan sangat ikonik.`;
        resGambarAtasan.src = "assets/denim-combo.png";
      } else if (tipe === "hoodie") {
        resNama.innerText = `Gaya Athleisure (Oversized Hoodie ${txtWarna})`;
        resAksesoris.innerText = "Topi Snapback & High-top Sneakers";
        resTeks.innerText = `Mengutamakan kenyamanan maksimal. Hoodie berwarna ${txtWarna} ini sangat aman diseimbangkan dengan celana yang nyaman untuk hangout santai malam hari.`;
        resGambarAtasan.src = "assets/hoodie-combo.png";
      } else if (tipe === "blus") {
        resNama.innerText = `Gaya Feminin Anggun (Blouse ${txtWarna})`;
        resAksesoris.innerText = "Shoulder Bag Kulit & Kalung Layer Minimalis";
        resTeks.innerText = `Karakter kain blus warna ${txtWarna} yang jatuh memberikan siluet anggun. Paduan celana yang soft akan menonjolkan aura yang elegan dan kalem.`;
        resGambarAtasan.src = "assets/blus-combo.png";
      } else if (tipe === "cardigan") {
        resNama.innerText = `Gaya Aesthetic Warmth (Cardigan ${txtWarna})`;
        resAksesoris.innerText = "Sling Bag Canvas & Kalung Mutiara Kecil";
        resTeks.innerText = `Gunakan dalaman tanktop atau kaos polos dengan warna kontras dari rekomendasi palet di atas agar tekstur rajutan dari cardigan ${txtWarna} kamu terlihat menonjol.`;
        resGambarAtasan.src = "assets/cardigan-combo.png";
      } else if (tipe === "blazer") {
        resNama.innerText = `Gaya Korean Smart-Streetwear (Blazer ${txtWarna})`;
        resAksesoris.innerText = "Tote Bag Canvas, Kacamata Frame Transparan, & Sneakers Putih";
        resTeks.innerText = `Blazer berwarna ${txtWarna} tidak akan terlihat kaku jika bagian dalamnya dipadukan dengan kaos basic kasual serta sepatu canvas santai untuk look k-style modern.`;
        resGambarAtasan.src = "assets/blazer-combo.png";
      } else {
        resNama.innerText = `Gaya Padu Padan Eksperimen (${txtWarna})`;
        resAksesoris.innerText = "Gunakan aksesori sederhana sesuai kenyamanan";
        resTeks.innerText = `Kombinasi bahan ${bahan} dengan warna dasar ${txtWarna} memancarkan impresi berpakaian yang matang dan aman untuk bepergian santai.`;
        resGambarAtasan.src = "assets/hero-clothes.jpg"; 
      }


      // STEP C: LOGIKA TIPE CELANA (HANYA UNTUK MENGATUR TEKS BAWAHAN & GAMBAR CELANA)
      let namaCelana = "";
      
      if (celanaTerpilih === "baggy_grey") namaCelana = "Celana Baggy Abu-abu";
      else if (celanaTerpilih === "cargo_white") namaCelana = "Celana Cargo Putih";
      else if (celanaTerpilih === "jeans_blue") namaCelana = "Jeans Biru Terang";
      else if (celanaTerpilih === "kain_beige") namaCelana = "Celana Kain Krem (Beige)";
      else if (celanaTerpilih === "jeans_black") namaCelana = "Jeans Hitam Longgar";
      else if (celanaTerpilih === "slacks_grey") namaCelana = "Celana Bahan Abu-abu";
      else if (celanaTerpilih === "cargo_green") namaCelana = "Celana Cargo Hijau Army";
      else if (celanaTerpilih === "jeans_sobek") namaCelana = "Jeans Sobek (Ripped Jeans)";
      else namaCelana = "Pilih bawahan warna netral";

      resBawahan.innerText = namaCelana;
      resGambarBawahan.src = databaseGambarCelana[celanaTerpilih] || "assets/celana-jeans-black.png";

      // Tampilkan Hasil & Efek Scroll Mulus
      hasilRekomendasiBox.classList.remove("d-none");
      hasilRekomendasiBox.scrollIntoView({ behavior: "smooth" });
    });
  }
});
