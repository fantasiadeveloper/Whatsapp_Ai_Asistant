const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
require('dotenv').config();

let klienWA = new Client({
    authStrategy: new LocalAuth(),
});
klienWA.on("qr", (kode) => {
    qrcode.generate(kode, { small: true });
});
klienWA.on("ready", () => {
    console.log("Klien WhatsApp siap!");
});

const basisPengetahuan = `
contoh: aku suka kopi.
`;

async function tanyaAI(pesanPengguna) {
    const kunciAPI = process.env.API_KEY;
    const ai = new GoogleGenerativeAI(kunciAPI);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const promptPesan = `
Kamu adalah asisten pribadi yang memiliki pengetahuan ini:
${basisPengetahuan}

Pesan yang diterima dari pengguna: "${pesanPengguna}"
Ingatlah untuk selalu mengingat percakapan sebelumnya.
`;

        const hasil = await model.generateContent(promptPesan);
        const balasanAI = hasil.response.text();
        return balasanAI;
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        return "Maaf, terjadi error";
    }
}

klienWA.on("message", async (pesan) => {
    const balasan = await tanyaAI(pesan.body);
    klienWA.sendMessage(pesan.from, balasan);

    const waktu = new Date().toLocaleString(); 
    console.log(`[${waktu}] Pesan dari ${pesan.from}: ${pesan.body}`);
});

klienWA.initialize();
