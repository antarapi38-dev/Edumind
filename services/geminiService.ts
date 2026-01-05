import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Subject } from "../types";

const apiKey = process.env.API_KEY;

const MODEL_NAME = 'gemini-2.0-flash-exp';

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    if (!apiKey) {
      throw new Error("API Key tidak ditemukan di environment variables");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

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
  const baseInstruction = `Kamu adalah 'EduMind', tutor akademik ahli dan teman belajar yang ramah untuk siswa di Indonesia. Spesialisasimu adalah pelajaran ${subject}.
  
  Tujuan utamamu adalah membantu siswa MEMAHAMI materi, bukan hanya memberikan jawaban instan (kecuali diminta ringkasan).
  
  Pedoman:
  1. Gunakan BAHASA INDONESIA yang baik, sopan, namun santai agar siswa merasa nyaman (seperti guru les privat yang asik).
  2. Jika pengguna memberikan soal tugas, JANGAN langsung berikan jawaban akhir. Uraikan langkah-langkah penyelesaiannya (step-by-step) secara logis.
  3. Jelaskan konsep 'mengapa' dan 'bagaimana' di balik jawaban tersebut.
  4. Jika ada gambar soal, analisislah diagram, rumus, atau teks di dalam gambar tersebut dengan teliti.
  5. Gunakan format yang rapi (bullet points, teks tebal untuk kata kunci).
  6. Untuk Matematika/Sains, tulis rumus dengan jelas.
  7. Berikan semangat positif di akhir penjelasan.`;

  return baseInstruction;
};

export const generateResponse = async (
  prompt: string,
  subject: Subject,
  imageBase64?: string,
  mimeType?: string
): Promise<string> => {
  const ai = getClient();

  const parts: any[] = [];

  // Tambahkan gambar jika ada
  if (imageBase64 && mimeType) {
    parts.push({
      inlineData: {
        data: imageBase64,
        mimeType: mimeType
      }
    });
  }

  // Tambahkan teks prompt
  parts.push({
    text: prompt
  });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: getSystemInstruction(subject),
        temperature: 0.4,
      }
    });

    return response.text || "Maaf, saya tidak dapat menghasilkan respon saat ini. Silakan coba lagi.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Gagal berkomunikasi dengan AI.");
  }
};