/// <reference types="vite/client" />
import OpenAI from "openai";
import { Subject } from "../types";

// @ts-ignore
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || "";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Client-side usage
});

const MODEL_NAME = 'z-ai/glm-4.5-air:free';

// Debug: log if API key is present
console.log("OpenRouter API Key present:", !!apiKey, apiKey ? `(${apiKey.substring(0, 10)}...)` : "(empty)");

export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const getSystemInstruction = (subject: Subject): string => {
    const isGeneral = subject === Subject.GENERAL;

    let topicConstraint = "";
    if (!isGeneral) {
        topicConstraint = `
    ⚠️ ATURAN VISUAL & TOPIK PENTING:
    Kamu sedang berada di MODUL KHUSUS: ${subject}.
    TUGASMU HANYA MENJAWAB PERTANYAAN TENTANG ${subject.toUpperCase()}.

    Jika pengguna bertanya atau mengirim gambar tentang topik LAIN (misal lagi di Matematika tapi tanya Sejarah):
    1. TOLAK dengan sopan, gaya bahasa gaul dan seru (fun).
    2. JANGAN berikan jawaban soalnya.
    3. Minta pengguna ganti kategori di menu atas.
    
    Contoh Penolakan Fun:
    - "Waduh, aku lagi pakai kacamata ${subject} nih! 😎 Kalau mau tanya itu, ganti ke menu yang sesuai dulu ya!"
    - "Eits, salah kamar nih! 🚪 Ini zona ${subject}, kalau mau bahas itu pindah dulu yuk!"
    - "Duh aku bingung jawabnya kalau di kelas ${subject}. Coba ganti mapel dulu ya! ✨"
    `;
    }

    return `Kamu adalah 'EduMind', tutor akademik ahli dan teman belajar yang ramah untuk siswa di Indonesia. Spesialisasimu adalah pelajaran ${subject}.
  
  ${topicConstraint}

  Tujuan utamamu adalah membantu siswa MEMAHAMI materi, bukan hanya memberikan jawaban instan (kecuali diminta ringkasan).
  
  Pedoman:
  1. Gunakan BAHASA INDONESIA yang baik, sopan, namun santai agar siswa merasa nyaman (seperti guru les privat yang asik).
  2. Jika pengguna memberikan soal tugas, JANGAN langsung berikan jawaban akhir. Uraikan langkah-langkah penyelesaiannya (step-by-step) secara logis.
  3. Jelaskan konsep 'mengapa' dan 'bagaimana' di balik jawaban tersebut.
  4. Jika ada gambar soal, analisislah diagram, rumus, atau teks di dalam gambar tersebut dengan teliti.
  5. Gunakan format yang rapi (bullet points, teks tebal untuk kata kunci).
  6. Untuk Matematika/Sains, tulis rumus dengan jelas.
  7. Berikan semangat positif di akhir penjelasan.`;
};

export const generateResponse = async (
    prompt: string,
    subject: Subject,
    imageBase64?: string,
    mimeType?: string
): Promise<string> => {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: getSystemInstruction(subject)
        }
    ];

    const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
        { type: "text", text: prompt }
    ];

    if (imageBase64 && mimeType) {
        if (!MODEL_NAME.includes('vision') && !MODEL_NAME.includes('gemini')) {
            console.warn("Current model might not support image inputs.");
        }
        // Attempting to send image url with base64 as standard OpenAI vision format
        userContent.push({
            type: "image_url",
            image_url: {
                url: `data:${mimeType};base64,${imageBase64}`
            }
        });
    }

    messages.push({
        role: "user",
        content: userContent
    });

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: messages,
            temperature: 0.4,
        });

        return completion.choices[0]?.message?.content || "Maaf, saya tidak dapat menghasilkan respon saat ini. Silakan coba lagi.";
    } catch (error: any) {
        console.error("OpenRouter API Error:", error);
        throw new Error(error.message || "Gagal berkomunikasi dengan AI.");
    }
};
