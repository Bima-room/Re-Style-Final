document.addEventListener("DOMContentLoaded", function () {
  // 1. Panggil dan Masukkan Navbar
  const navbarContainer = document.getElementById("navbar-component");
  if (navbarContainer) {
    fetch("navbar.html")
      .then((response) => response.text())
      .then((data) => {
        // Suntikkan HTML navbar ke dalam wadah
        navbarContainer.innerHTML = data;

        // PENTING: Jalankan fungsi-fungsi ini TEPAT SETELAH HTML navbar terpasang utuh
        tandaiMenuAktif();
        inisialisasiHamburger();
      })
      .catch((err) => console.log("Gagal memuat navbar:", err));
  }

  // 2. Panggil dan Masukkan Footer
  const footerContainer = document.getElementById("footer-component");
  if (footerContainer) {
    fetch("footer.html")
      .then((response) => response.text())
      .then((data) => {
        footerContainer.innerHTML = data;
      })
      .catch((err) => console.log("Gagal memuat footer:", err));
  }
});

// LOGIKA HAMBURGER MENU MOBILE
function inisialisasiHamburger() {
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navLinksContainer = document.getElementById("nav-links-container");

  // Logika pengecekan (debugging) untuk memastikan elemennya ketemu
  if (!hamburgerBtn || !navLinksContainer) {
    console.log(
      "Eror: Tombol hamburger atau kontainer menu tidak ditemukan di HTML!"
    );
    return;
  }

  // Pasang fungsi klik
  hamburgerBtn.addEventListener("click", function (event) {
    // Mencegah efek lompat halaman jika tombol berupa link
    event.preventDefault();

    // Toggle kelas 'show'
    navLinksContainer.classList.toggle("show");

    // Log pengecekan di console browser
    console.log(
      "Tombol hamburger berhasil diklik! Status kelas 'show':",
      navLinksContainer.classList.contains("show")
    );
  });
}

// LOGIKA MENANDAI MENU AKTIF
function tandaiMenuAktif() {
  // Mengambil jalur path setelah nama domain (contoh: '/katalog.html' atau '/')
  const pathSekarang = window.location.pathname;

  const menuBeranda = document.getElementById("menu-beranda");
  const menuKatalog = document.getElementById("menu-katalog");
  const menuAbout = document.getElementById("menu-about"); // Sudah benar!

  // 1. Reset kelas active terlebih dahulu untuk memastikan tidak ada bentrok
  if (menuBeranda) menuBeranda.classList.remove("active");
  if (menuKatalog) menuKatalog.classList.remove("active"); // Fix: Diubah dari "remove" ke "active"
  if (menuAbout) menuAbout.classList.remove("active"); // Tambahan: Reset untuk menu About

  // 2. JIKA URL berakhiran 'katalog.html' atau 'katalog'
  if (
    pathSekarang.endsWith("katalog.html") ||
    pathSekarang.endsWith("katalog")
  ) {
    if (menuKatalog) menuKatalog.classList.add("active");
  }
  // 3. JIKA URL berakhiran 'about.html' atau 'about' (TAMBAHAN BARU)
  else if (
    pathSekarang.endsWith("about.html") ||
    pathSekarang.endsWith("about")
  ) {
    if (menuAbout) menuAbout.classList.add("active");
  }
  // 4. JIKA URL berakhiran 'index.html', '/' (halaman utama kosong), atau 're-style-web/' (di github)
  else if (
    pathSekarang.endsWith("index.html") ||
    pathSekarang.endsWith("/") ||
    pathSekarang.endsWith("index")
  ) {
    if (menuBeranda) menuBeranda.classList.add("active");
  }
}

// Fungsi Membuka Jendela Modal secara Otomatis mengisi data
function bukaModal(namaWarna, hexUtama, arrayHexKombinasi, arrayNamaKombinasi) {
  document.getElementById("modalTitle").innerText =
    "Detail Palet: " + namaWarna;
  document.getElementById("visualWarnaUtama").style.backgroundColor = hexUtama;

  const containerList = document.getElementById("listKombinasiLengkap");
  containerList.innerHTML = ""; // Bersihkan isi modal lama terlebih dahulu

  // Looping render seluruh warna dari gambar kelompokmu
  for (let i = 0; i < arrayHexKombinasi.length; i++) {
    const itemHtml = `
      <div class="modal-color-circle-item">
        <div class="mini-circle" style="background-color: ${arrayHexKombinasi[i]}"></div>
        <span>${arrayNamaKombinasi[i]}</span>
      </div>
    `;
    containerList.innerHTML += itemHtml;
  }

  // Tampilkan jendela modal ke layar
  document.getElementById("modalPalet").style.display = "flex";
}

// Fungsi menutup modal
function tutupModal() {
  document.getElementById("modalPalet").style.display = "none";
}

// Fungsi menutup modal ketika user klik sembarang area di luar kotak putih
function tutupModalLuar(event) {
  if (event.target.id === "modalPalet") {
    tutupModal();
  }
}

// Fungsi membuka modal detail kombinasi baju
function bukaModalBaju(
  nama,
  imgSrc,
  deskripsi,
  atasan,
  bawahan,
  sepatu,
  aksesori
) {
  document.getElementById("modalBajuTitle").innerText = "Panduan Gaya: " + nama;
  document.getElementById("modalBajuImg").src = imgSrc;
  document.getElementById("modalBajuDesc").innerText = deskripsi;

  // Memasukkan rincian komponen fashion
  document.getElementById("compAtasan").innerText = atasan;
  document.getElementById("compBawahan").innerText = bawahan;
  document.getElementById("compAlasKaki").innerText = sepatu;
  document.getElementById("compAksesori").innerText = aksesori;

  document.getElementById("modalBaju").style.display = "flex";
}

// Fungsi menutup modal baju
function tutupModalBaju() {
  document.getElementById("modalBaju").style.display = "none";
}

// Fungsi menutup modal baju saat klik area luar
function tutupModalBajuLuar(event) {
  if (event.target.id === "modalBaju") {
    tutupModalBaju();
  }
}
