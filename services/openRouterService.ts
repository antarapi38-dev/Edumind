import { Subject } from "../types";

const apiKey = process.env.OPENROUTER_API_KEY;
const SITE_URL = 'http://localhost:3000'; // Optional but recommended by OpenRouter
const SITE_NAME = 'EduMind AI'; // Optional but recommended by OpenRouter

// Default model
const MODEL_NAME = 'google/gemini-2.0-flash-001';

export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove data URL prefix (e.g. "data:image/jpeg;base64,")
            const base64Data = base64String.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data, // Keep consistent with existing interface
                    mimeType: file.type
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const getSystemInstruction = (subject: Subject): string => {
    return `Kamu adalah 'EduMind', tutor akademik ahli dan teman belajar yang ramah untuk siswa di Indonesia. Spesialisasimu adalah pelajaran ${subject}.
  
  Tujuan utamamu adalah membantu siswa MEMAHAMI materi, bukan hanya memberikan jawaban instan (kecuali diminta ringkasan).
  
  Pedoman:
  1. Gunakan BAHASA INDONESIA yang baik, sopan, namun santai agar siswa merasa nyaman.
  2. Jika pengguna memberikan soal tugas, JANGAN langsung berikan jawaban akhir. Uraikan langkah-langkah penyelesaiannya (step-by-step).
  3. Jelaskan konsep 'mengapa' dan 'bagaimana'.
  4. Jika ada gambar soal, analisislah dengan teliti.
  5. Gunakan format yang rapi (markdown).
  6. Untuk Matematika/Sains, tulis rumus dengan jelas (LaTeX jika memungkinkan, atau teks biasa yang jelas).
  7. Berikan semangat positif.`;
};

export const generateResponse = async (
    prompt: string,
    subject: Subject,
    imageBase64?: string,
    mimeType?: string
): Promise<string> => {
    if (!apiKey) {
        throw new Error("OpenRouter API Key is missing. Please check vite.config.ts");
    }

    const messages: any[] = [
        {
            role: "system",
            content: getSystemInstruction(subject)
        }
    ];

    const userContent: any[] = [
        {
            type: "text",
            text: prompt
        }
    ];

    if (imageBase64 && mimeType) {
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
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": SITE_URL,
                "X-Title": SITE_NAME,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: messages,
                temperature: 0.4,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `OpenRouter Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "Maaf, tidak ada respon.";

    } catch (error: any) {
        console.error("OpenRouter API Error:", error);
        throw new Error(error.message || "Gagal berkomunikasi dengan OpenRouter.");
    }
};
