import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2, Sparkles, Backpack, Pencil, Eraser } from 'lucide-react';
import { Subject, Message, Role } from './types';
import ChatMessage from './components/ChatMessage';
import SubjectSelector from './components/SubjectSelector';
import { generateResponse, fileToGenerativePart } from './services/openRouterService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: "Hai! Aku **EduMind**, teman belajarmu yang asik! 🎒\n\nAda PR Matematika, Sains, atau Sejarah yang bikin bingung? \n\n📸 **Foto soalnya** atau **ketik pertanyaanmu** di bawah. Jangan lupa pilih mapelnya ya biar aku makin pinter!",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.GENERAL);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessageId = Date.now().toString();
    const timestamp = Date.now();
    let base64Image = undefined;
    let mimeType = undefined;

    // Prepare User Message
    if (selectedImage) {
      const part = await fileToGenerativePart(selectedImage);
      base64Image = part.inlineData.data;
      mimeType = part.inlineData.mimeType;
    }

    const newUserMessage: Message = {
      id: userMessageId,
      role: Role.USER,
      text: input,
      image: base64Image,
      timestamp,
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    clearImage();
    setIsLoading(true);

    try {
      const responseText = await generateResponse(
        newUserMessage.text,
        selectedSubject,
        base64Image,
        mimeType
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-graph-paper font-display overflow-hidden selection:bg-pink-200">

      {/* Decorative Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header Floating */}
      <header className="flex-none pt-6 px-4 pb-2 z-20">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border-2 border-white shadow-lg shadow-indigo-100/50 rounded-3xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl rotate-[-6deg] flex items-center justify-center text-white shadow-lg ring-4 ring-indigo-50 border-2 border-indigo-400 transition-transform hover:rotate-0">
              <Backpack size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                EduMind <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">AI</span>
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={10} className="text-yellow-500" />
                Teman Belajar Pintar
              </p>
            </div>
          </div>
          <div className="hidden sm:flex">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-indigo-900">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden relative flex flex-col w-full max-w-4xl mx-auto z-10">

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-0 scroll-smooth">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex justify-start w-full mb-8 pl-4">
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-5 py-4 rounded-[2rem] rounded-bl-none border-2 border-indigo-100 shadow-sm">
                <Loader2 size={24} className="animate-spin text-indigo-500" />
                <span className="text-sm font-bold text-indigo-400 animate-pulse">Sedang memecahkan masalah...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area - Dock Style */}
        <div className="flex-none p-4 md:p-6 pb-6">
          <div className="bg-white border-2 border-indigo-50 rounded-[2.5rem] shadow-2xl shadow-indigo-200/40 p-3 relative transform transition-all hover:scale-[1.01]">

            {/* Subject Selector */}
            <div className="mb-3 px-1">
              <SubjectSelector selectedSubject={selectedSubject} onSelect={setSelectedSubject} />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mx-4 mb-3 relative inline-block animate-in fade-in zoom-in duration-300">
                <div className="relative group rotate-2 hover:rotate-0 transition-transform">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur opacity-30"></div>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="relative h-28 w-auto rounded-xl border-4 border-white shadow-lg object-cover"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg border-2 border-white transition-transform hover:scale-110"
                  >
                    <Eraser size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="flex items-end gap-3 bg-slate-50 rounded-[2rem] border-2 border-slate-100 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all p-2 pr-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-[1.5rem] transition-colors duration-200 group"
                title="Unggah Foto Soal"
              >
                <ImageIcon size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ketik pertanyaan ${selectedSubject}...`}
                className="flex-1 max-h-32 min-h-[3.5rem] py-4 bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 resize-none text-base font-bold"
                rows={1}
                style={{ minHeight: '56px' }}
              />

              <button
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || isLoading}
                className={`p-4 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 transform ${(!input.trim() && !selectedImage) || isLoading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-1 active:scale-95'
                  }`}
              >
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} strokeWidth={2.5} className="-ml-0.5 mt-0.5" />}
              </button>
            </div>

          </div>
        </div>
      </main>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default App;