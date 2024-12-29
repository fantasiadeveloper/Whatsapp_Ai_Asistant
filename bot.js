const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// API Key langsung di dalam kode
const API_KEY = "AIzaSyAq7pHX8PSieoYEBVLNFnZfWhZHbxWMAVw";

// Nomor Firman
const firmanNumber = "62895703023772@c.us"; // Format nomor untuk WhatsApp Web

// Pengetahuan Toko
const knowledgeBase = `
1. Toko buka jam 10 pagi hingga 10 malam.
2. Pada hari Jumat, toko buka jam 2 siang hingga 10 malam.
3. Jika ada pertanyaan tentang servisan, jawab dengan: "kirimkan infomasi : atas nama dan alamat dan tambahkan pesan penting (contoh : john - indonesia penting)." Jika Firman tidak merespons dalam 10 menit, beri tahu pengguna bahwa Firman mungkin sedang sibuk.
4. Jika ada yang menelepon, jawab dengan: "Maaf, ini nomor asisten Firman. Saya tidak dapat menjawab telepon."
5. Jangan berikan informasi dari mana kamu berasal.
6. Akhiri percakapan dengan emoji.
7. Jika ada yang bertanya tentang keluarga Firman, alihkan ke nomor Firman di 0895703023772 dan jelaskan bahwa ini adalah chatbot asisten Firman.
`;

// Fungsi untuk mengirim pesan ke nomor penting
async function forwardMessageToFirman(client, message) {
    const forwardedMessage = `
Pesan penting diterima dari ${message.from}:
"${message.body}"
    `;
    try {
        await client.sendMessage(firmanNumber, forwardedMessage);
        console.log("Pesan penting berhasil diteruskan ke Firman.");
    } catch (error) {
        console.error("Gagal mengirim pesan ke Firman:", error);
    }
}

// Fungsi untuk menangani pesan penting
function isImportantMessage(message) {
    const importantKeywords = ["urgent", "penting", "darurat", "servis", "keluarga firman"];
    return importantKeywords.some((keyword) =>
        message.toLowerCase().includes(keyword)
    );
}

// Menyimpan riwayat percakapan
const conversationHistory = new Map();

// Fungsi untuk mendapatkan riwayat percakapan
function getConversationHistory(user) {
    return conversationHistory.get(user) || [];
}

// Fungsi untuk menyimpan percakapan
function addToConversationHistory(user, message) {
    if (!conversationHistory.has(user)) {
        conversationHistory.set(user, []);
    }
    conversationHistory.get(user).push(message);
}

// Fungsi untuk mengakses AI dan memberikan respons berdasarkan riwayat percakapan
async function generateResponse(userMessage, user) {
    const genAI = new GoogleGenerativeAI(API_KEY); // Gunakan API_KEY langsung di sini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    try {
        // Mendapatkan riwayat percakapan untuk pengguna
        const history = getConversationHistory(user).map(msg => msg.body).join("\n");

        // Menyusun prompt untuk AI dengan riwayat percakapan dan pesan baru
        const prompt = `
Anda adalah asisten pribadi untuk sebuah Firman dan nama kamu adalah yui. Anda memiliki pengetahuan berikut:
${knowledgeBase}

Berikut adalah riwayat percakapan sebelumnya:
${history}
ingat kalau kau harus ingat percakapan sebelumnya, ini adalah penting untuk interaksi.

Berikut adalah pesan dari pengguna: "${userMessage}"
Beri respons singkat dan alami seperti seorang manusia normal dan gunakan bahasa Informal dan buat balasan pesan kamu seperti gadis umur 12 tahun.`;

        // Hitung jumlah token untuk prompt (input)
        const countResult = await model.countTokens(prompt);
        console.log("Input token count (prompt):", countResult.totalTokens); // Output: jumlah token untuk prompt

        // Meminta AI untuk menghasilkan respons
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Ambil metadata penggunaan token untuk output
        const usageMetadata = result.response.usageMetadata;

        // Cetak jumlah token untuk input dan output
        console.log("Prompt token count:", usageMetadata.promptTokenCount);  // Jumlah token untuk input
        console.log("Output token count:", usageMetadata.candidatesTokenCount);  // Jumlah token untuk output
        console.log("Total token count:", usageMetadata.totalTokenCount);  // Jumlah total token (input + output)

        // Menyimpan pesan baru dan respons ke dalam riwayat percakapan
        addToConversationHistory(user, { body: userMessage, response });

        return response;
    } catch (error) {
        console.error("Error generating response:", error);
        return "Maaf, saya tidak dapat menjawab saat ini. (˶ᵔ ᵕ ᵔ˶)";
    }
}

// Inisialisasi klien WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Tampilkan QR Code
client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

// Log saat klien siap
client.on("ready", () => {
    console.log("Client is ready!");
});

// Menangani pesan masuk
client.on("message", async (message) => {
    if (isImportantMessage(message.body)) {
        // Pesan dianggap penting, teruskan ke Firman
        await forwardMessageToFirman(client, message);

        // Beri tahu pengirim bahwa pesan telah diteruskan
        message.reply("Pesan kamu penting! Sudah saya teruskan ke Firman ya! ⸜(｡˃ ᵕ ˂)⸝♡");
        return;
    }

    // Jika tidak penting, proses seperti biasa
    const response = await generateResponse(message.body, message.from);
    
    // Kirim pesan polosan (langsung) ke nomor pengirim
    client.sendMessage(message.from, response); // Mengirim pesan langsung tanpa reply

    // Mencetak informasi pesan ke konsol
    const timestamp = new Date().toLocaleString(); // Mendapatkan waktu saat pesan diterima
    console.log(`[${timestamp}] Pesan dari ${message.from}: ${message.body}`);
});

// Menangani panggilan telepon
client.on("call", async (call) => {
    const contact = call.from;
    const message = "Maaf, ini nomor asisten firman. Saya tidak dapat menjawab telepon.";
    client.sendMessage(contact, message);
    call.reject();
});

// Jalankan klien
client.initialize();
