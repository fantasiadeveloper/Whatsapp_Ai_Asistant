# WhatsApp AI Assistant

WhatsApp AI Assistant adalah bot WhatsApp yang menggunakan **Google Generative AI** untuk memberikan balasan otomatis kepada pengguna. Bot ini dapat memproses pesan yang diterima dan meresponsnya dengan jawaban yang relevan berdasarkan pengetahuan yang telah diprogramkan.

## Fitur Utama
- **Balasan otomatis**: Menggunakan Google Generative AI untuk memberikan balasan cerdas dan relevan terhadap pesan WhatsApp.
- **Penyimpanan percakapan**: Menyimpan dan mengingat percakapan sebelumnya untuk meningkatkan kualitas interaksi. anda bisa menggunakan fitur yang lebih moderen yang di sediakan oleh API Google
- **Penggunaan API Google Generative AI**: Memanfaatkan kemampuan model AI dari Google untuk menghasilkan konten yang akurat dan responsif.
- **Mudah digunakan**: Cukup dengan menginstal dependensi dan mengonfigurasi kunci API, Anda dapat menjalankan bot ini di server lokal Anda.

## Prasyarat
Sebelum memulai, pastikan Anda memiliki hal-hal berikut:
- **Node.js** versi 16 atau lebih baru.
- **npm** (Node Package Manager) sudah terpasang.
- **Kunci API Google Generative AI** (dapat didapatkan dari [Google Cloud](https://cloud.google.com/)).
- **WhatsApp Web** untuk menjalankan bot ini melalui `whatsapp-web.js`.

## Catatan
Disarankan untuk menginstal npm secara manual, karena ada kemungkinan beberapa modul dalam file `package-lock.json` tidak digunakan atau tidak diperlukan oleh proyek ini. Dengan menginstal dependensi secara manual, Anda dapat memastikan hanya modul yang relevan yang terpasang.

Perlu diingat bahwa WhatsApp tidak mengizinkan penggunaan bot pada nomor pribadi. Oleh karena itu, ada kemungkinan nomor WhatsApp Anda akan diblokir secara permanen jika digunakan untuk bot. Untuk menghindari hal ini, disarankan untuk menggunakan **nomor WhatsApp Bisnis**.

### Jalankan Bot
Setelah mengonfigurasi kunci API, Anda dapat menjalankan bot dengan perintah berikut:
