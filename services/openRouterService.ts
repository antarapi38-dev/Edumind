import { Subject } from "../types";

// MOCKED SERVICE - Returns dummy data as requested
const DUMMY_RESPONSE = `Hukum Newton! Yuk, kita bahas dengan cara yang santai dan seru 🎉

🟢 Hukum Newton I – Hukum Kelembaman

“Kalau nggak diganggu, ya tetap begitu.”

Benda yang diam akan tetap diam, dan benda yang bergerak akan terus bergerak lurus dengan kecepatan yang sama, kecuali ada gaya yang memengaruhinya.

✨ Contoh gampang:

Bola yang diam di lantai nggak akan bergerak kalau nggak ditendang ⚽

Penumpang terasa terdorong ke depan saat mobil direm mendadak 🚗💨

🔵 Hukum Newton II – Hukum Percepatan

“Makin kuat dorongannya, makin ngebut geraknya!”

Percepatan sebuah benda tergantung pada besar gaya dan massa benda tersebut.

📌 Rumus keren:
F = m × a

🎯 Artinya:

Dorong lebih kuat → benda bergerak lebih cepat

Benda lebih berat → butuh gaya lebih besar

Contoh:

Dorong troli kosong lebih mudah daripada troli penuh 🛒

🔴 Hukum Newton III – Aksi dan Reaksi

“Setiap aksi pasti ada reaksi!”

Jika kamu memberi gaya pada suatu benda, benda itu akan memberi gaya balik yang sama besar tapi berlawanan arah.

💥 Contoh seru:

Saat meloncat, kaki mendorong tanah ke bawah, tanah mendorong tubuhmu ke atas 🕴️

Roket bisa terbang karena gas didorong ke bawah 🚀

🎉 Kesimpulan

Hukum Newton membantu kita memahami bagaimana dan kenapa benda bisa bergerak di sekitar kita. Dari hal sederhana sampai teknologi canggih, semuanya pakai aturan Newton!

Belajar fisika ternyata nggak seseram itu, kan? 😄
Yuk, terus eksplor dan temukan serunya sains! 🔬✨`;

export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
    return new Promise((resolve) => {
        // Mock processing - just resolve immediately
        resolve({
            inlineData: {
                data: "mock_base64_data",
                mimeType: file.type
            },
        });
    });
};

export const generateResponse = async (
    prompt: string,
    subject: Subject,
    imageBase64?: string,
    mimeType?: string
): Promise<string> => {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    return DUMMY_RESPONSE;
};
