# Flowers For You — Langit Cerah

Hadiah interaktif untuk anniversary empat bulan dan pasangan LDR. Dibuat dengan HTML, CSS, dan JavaScript; tidak memerlukan instalasi library.

## Cara membuka

1. Buka folder `flowers-for-you-ldr` di VS Code, atau buka `flowers-for-you.code-workspace`.
2. Klik kanan `dist/index.html`, lalu pilih **Open with Live Server**. File ini juga dapat dibuka langsung di browser.
3. Setelah mengganti versi, tekan **Ctrl + Shift + R** di browser agar tampilan terbaru dimuat.
4. Klik **TAP TO OPEN**, tunggu kupu-kupu menyebar dan bunga mekar, kemudian klik amplop yang dibawa merpati.

## Alur hadiah

- Pembuka: hati kaca merah muda yang berdenyut, hati-hati kecil melayang, dan garis cahaya mengitari hati. Tanpa nama penerima.
- Setelah disentuh: kawanan kupu-kupu enam warna datang dari tengah, memenuhi layar, lalu menyebar untuk memperlihatkan buket.
- Langit biru, awan pastel yang bergeser perlahan, matahari lembut, dan kawanan burung kecil dengan kepakan serta gerakan meluncur. Bunga terdiri dari tulip lavender, mawar merah muda, dan daisy putih; pembungkus bernuansa mint dan krem. Daun, tangkai, dan pembungkus bergerak mengikuti angin dengan sedikit jeda.
- Merpati keluar dari belakang bunga, menyamping, lalu mendekat sambil membawa surat. Ucapannya berupa teks: **Ini ada surat buat kamu ♡**.
- Surat **Happy 4 Months, Sayang ♡** tetap berisi pesan untuk pasangan LDR. Tanpa foto beruang dan tanpa nama penerima.
- Setelah surat ditutup, merpati mengucapkan salam, berputar, lalu terbang pergi ke kanan atas. Hujan bunga menyusul. Seekor kupu-kupu kuning datang melengkung, melambat, lalu hinggap pada kelopak daisy. Setelah hinggap, sayapnya sesekali membuka perlahan dan tubuhnya ikut gerakan bunga.
- Penutup: dua kupu-kupu kecil mengapit **I LOVE YOU** di atas buket. Garis panjang dan hati dari titik-titik sudah dihapus.
- Tombol **Peluk dari jauh ♡**, **Baca surat lagi**, dan **Ulangi** tersedia. Ulangi memulai dari bunga mekar; refresh halaman untuk melihat lagi hati dan kawanan kupu-kupu pembuka.

Detail taman: pita buket memiliki lipatan satin, simpul, dan dua ujung yang bergerak mengikuti angin. Cahaya matahari sedikit melembut saat awan melintas di depannya. Setelah pembuka selesai, ketuk area kosong di langit untuk membuat beberapa kelopak melayang. Menggulir layar, membaca surat, atau menekan tombol tidak memunculkan kelopak. Efek sentuhan dibatasi, hilang sendiri, dan dibersihkan saat membaca atau mengulang adegan. Efek ini dimatikan jika perangkat memilih pengurangan gerakan.

Burung dan kupu-kupu berhenti saat tab tidak aktif. Saat surat dibaca, gerak angin dan awan juga dijeda. Pengaturan perangkat untuk mengurangi gerakan mengganti transisi kupu-kupu dengan fade pendek, menghentikan angin serta awan, dan menampilkan kupu-kupu langsung hinggap. Jumlah kupu-kupu serta burung disesuaikan dengan lebar layar. Tombol Ulangi membersihkan kupu-kupu yang hinggap sebelum memulai adegan baru. Animasi merpati utama tetap memakai gerakan yang sudah disetujui.

## Mengatur tempo ucapan merpati

Ucapan muncul perlahan, sekitar 65 milidetik per huruf, dengan jeda kecil pada tanda baca. Setelah kalimat pamitan lengkap, merpati menunggu minimal **5 detik** untuk memberi waktu membaca; pesan yang lebih panjang mendapat jeda tambahan hingga 20 detik. Merpati menunduk kecil dan balon memudar selama 0,45 detik sebelum dia pergi. Tinggi balon disiapkan sejak awal supaya teks tidak membuatnya meloncat; pesan yang sangat panjang dapat digulir.

Ubah nilai pada `SPEECH_TIMING` dekat bagian atas `dist/script.js` bila ingin lebih lambat lagi: `characterDelay` mengatur tempo huruf, `minimumReadTime` mengatur jeda baca minimum, dan `millisecondsPerWord` mengatur tambahan waktu untuk teks panjang. Nilainya memakai milidetik; angka lebih besar berarti lebih lambat. Kalimat pamitan tetap bisa diganti pada `farewellText` di bagian bawah file. Waktu mengetik dan membaca dijeda ketika tab tidak terlihat; tombol Ulangi membatalkan ucapan sebelumnya.

## Menambahkan musik di GitHub

1. Beri nama lagu persis **music.mp3**.
2. Letakkan di **dist/assets/music.mp3**. Jika isi `dist` menjadi root situs GitHub Pages, letakkan di **assets/music.mp3**.
3. Musik mulai setelah klik pembuka dan berulang. Suara masuk bertahap dari 0 ke 20% selama sekitar 1,6 detik. Saat surat dibuka, volume turun lembut ke 8%, lalu kembali ke 20% setelah ditutup. Beberapa browser HP mengatur volume melalui perangkat sehingga perubahan volume dari halaman dapat dibatasi.
4. Tombol **Jeda musik / Nyalakan musik** muncul di bawah buket dan di dalam surat. Ulangi mempertahankan pilihan musik. Membuka atau menutup surat tidak menyalakan kembali lagu yang kamu jeda; jika dilanjutkan saat membaca, lagu masuk lembut pada volume membaca.

Lagu belum disertakan. Halaman tetap berjalan ketika file musik tidak ada. Jika browser memerlukan klik tambahan, gunakan tombol Nyalakan musik.

## Susunan file

- `dist/index.html`: struktur pembuka, buket, amplop, dan surat.
- `dist/style.css`: bentuk bunga, perjalanan adegan, surat, dan kontrol.
- `dist/daylight.css`: tema langit cerah, hati kaca, gerakan angin dan awan, serta penutup kupu-kupu.
- `dist/opening.js`: kawanan kupu-kupu pembuka dan penggambaran sayap dari atlas.
- `dist/garden.js`: burung di kejauhan, pasangan kupu-kupu penutup, dan kupu-kupu yang mendarat di bunga.
- `dist/script.js`: urutan adegan dan isi surat pada bagian `CONFIG`.
- `dist/dove.js`: gerakan merpati, kepakan, dan pamitan.
- `dist/music.js`: pemutar musik opsional, fade masuk, dan penyesuaian volume saat membaca.
- `dist/assets/`: gambar lokal. Unggah seluruh folder ini bersama kode.
- `ASSETS.md`: sumber aset visual dan prompt pembuatannya.

## Referensi

Pembuka dan transisi mengikuti dua video WhatsApp tanggal 14 September 2026. Paletnya disesuaikan menjadi langit biru sesuai arahan. Ini rekonstruksi visual dengan aset ilustrasi serta animasi kode, bukan salinan source atau video asli. Seluruh aset yang digunakan halaman bersifat lokal.
