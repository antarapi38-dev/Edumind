import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './components/ChatMessage';
import { Subject, Message, Role, ChatState } from './types';
import { generateResponse, fileToGenerativePart } from './services/openRouterService';

const App: React.FC = () => {
  const [subject, setSubject] = useState<Subject>(Subject.GENERAL);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: input,
      timestamp: Date.now(),
      subject: subject
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(input, subject);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: response,
        timestamp: Date.now(),
        subject: subject
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        isError: true,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convert to base64 for display and sending
    const imageData = await fileToGenerativePart(file);
    const base64String = imageData.inlineData.data;
    const mimeType = imageData.inlineData.mimeType;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: "Mengirim gambar...",
      image: base64String, // Store base64 for display in ChatMessage
      timestamp: Date.now(),
      subject: subject
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Clear input
    if (fileInputRef.current) fileInputRef.current.value = '';

    try {
      const response = await generateResponse("Jelaskan gambar ini", subject, base64String, mimeType);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: response,
        timestamp: Date.now(),
        subject: subject
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error processing image:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: "Maaf, gagal memproses gambar.",
        isError: true,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectSelect = (newSubject: Subject) => {
    setSubject(newSubject);
    // Optional: Add a system message or toast indicating change?
    // For now, just change state.
  };

  const handleBack = () => {
    setMessages([]);
    setInput('');
  };

  const subjectIcons: Record<string, string> = {
    [Subject.GENERAL]: 'palette',
    [Subject.MATH]: 'calculate',
    [Subject.PHYSICS]: 'ink_pen',
    [Subject.CHEMISTRY]: 'science',
    [Subject.BIOLOGY]: 'biotech',
    [Subject.HISTORY]: 'history_edu',
    [Subject.LITERATURE]: 'menu_book',
    [Subject.CODING]: 'computer', // Mapping Coding to computer icon
  };

  const subjectColors: Record<string, string> = {
    [Subject.GENERAL]: 'group-hover:text-yellow-500',
    [Subject.MATH]: 'group-hover:text-blue-500',
    [Subject.PHYSICS]: 'group-hover:text-purple-500',
    [Subject.CHEMISTRY]: 'group-hover:text-green-500',
    [Subject.BIOLOGY]: 'group-hover:text-emerald-500',
    [Subject.HISTORY]: 'group-hover:text-orange-500',
    [Subject.LITERATURE]: 'group-hover:text-pink-500',
    [Subject.CODING]: 'group-hover:text-blue-400',
  };

  const subjectActiveStyles: Record<string, string> = {
    [Subject.GENERAL]: 'bg-yellow-400 text-white shadow-yellow-200 ring-yellow-200 border-yellow-300',
    [Subject.MATH]: 'bg-blue-500 text-white shadow-blue-200 ring-blue-200 border-blue-300',
    [Subject.PHYSICS]: 'bg-violet-500 text-white shadow-violet-200 ring-violet-200 border-violet-300',
    [Subject.CHEMISTRY]: 'bg-green-500 text-white shadow-green-200 ring-green-200 border-green-300',
    [Subject.BIOLOGY]: 'bg-emerald-500 text-white shadow-emerald-200 ring-emerald-200 border-emerald-300',
    [Subject.HISTORY]: 'bg-orange-500 text-white shadow-orange-200 ring-orange-200 border-orange-300',
    [Subject.LITERATURE]: 'bg-pink-500 text-white shadow-pink-200 ring-pink-200 border-pink-300',
    [Subject.CODING]: 'bg-cyan-600 text-white shadow-cyan-200 ring-cyan-200 border-cyan-300',
  };

  return (
    <>
      <div className="fixed inset-0 z-[-1] pointer-events-none dot-pattern opacity-60 dark:opacity-20"></div>
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent dark:from-indigo-900/20 dark:to-transparent z-[-1] pointer-events-none"></div>

      <header className="w-full max-w-5xl bg-card-light dark:bg-card-dark rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-3 md:p-4 flex justify-between items-center mb-6 md:mb-10 sticky top-4 z-40 backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90">
        <div className="flex items-center gap-3 md:gap-4 pl-2">
          {messages.length > 0 && (
            <button
              onClick={handleBack}
              className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-md shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all mr-1"
              title="Kembali ke Beranda"
            >
              <span className="material-symbols-rounded text-2xl">arrow_back</span>
            </button>
          )}
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
            <span className="material-symbols-rounded text-3xl">backpack</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800 dark:text-white">EduMind <span className="text-purple-500 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">AI</span></h1>
            <div className="flex items-center gap-1.5 text-[0.65rem] md:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">

              Teman Belajar Pintar
            </div>
          </div>
        </div>

      </header>

      <main className="w-full max-w-5xl flex-1 flex flex-col justify-start pb-4 relative z-10">
        {/* Messages or Start Screen */}
        {messages.length === 0 ? (
          <div className="flex gap-3 md:gap-5 items-end mb-8 group animate-fade-in-up">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-md shadow-emerald-100 dark:shadow-none mb-8 shrink-0 animate-float">
              <span className="material-symbols-rounded text-2xl">smart_toy</span>
            </div>
            <div className="flex flex-col gap-2 max-w-3xl w-full">
              <div className="bg-card-light dark:bg-card-dark p-6 md:p-10 rounded-t-[2.5rem] rounded-br-[2.5rem] rounded-bl-lg shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 relative">
                <span className="material-symbols-rounded absolute top-8 right-8 text-teal-100 dark:text-slate-700 text-4xl animate-pulse">auto_awesome</span>
                <p className="text-lg md:text-2xl text-slate-700 dark:text-slate-200 mb-4 leading-relaxed font-semibold">
                  Hai! Aku <span className="text-teal-500 font-extrabold">EduMind</span>, teman belajarmu yang asik! 🎒
                </p>
                <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Ada PR Matematika, Sains, atau Sejarah yang bikin bingung?
                </p>
                <div className="mt-8 p-5 md:p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                    <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center align-middle font-bold text-slate-800 dark:text-white mr-2 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors transform active:scale-95">
                      <span className="material-symbols-rounded text-lg mr-2 text-slate-700 dark:text-slate-200">photo_camera</span>
                      Foto soalnya
                    </button>
                    {' '}atau{' '}
                    <span className="font-extrabold text-teal-600 dark:text-teal-400">ketik pertanyaanmu</span>
                    {' '}di bawah. Jangan lupa pilih mapelnya ya biar aku makin pinter!
                  </p>
                </div>
              </div>
              <span className="text-[0.7rem] font-bold text-slate-400 dark:text-slate-500 uppercase ml-4 tracking-wider flex items-center gap-1">
                EduMind AI
                <span className="w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
                Ready to help
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-24 w-full">
            {/* Added mb-24 to prevent overlap with fixed input */}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start w-full">
                <div className="flex items-center gap-2 p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="animate-bounce w-2 h-2 bg-primary rounded-full"></div>
                  <div className="animate-bounce w-2 h-2 bg-secondary rounded-full delay-75"></div>
                  <div className="animate-bounce w-2 h-2 bg-accent rounded-full delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Subject Grid - Only show when no messages */}
        {messages.length === 0 && (
          <div className="w-full max-w-5xl mb-8 -mt-4">
            <div className="bg-card-light dark:bg-card-dark rounded-[2.5rem] p-4 md:p-6 shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg md:text-xl font-extrabold text-slate-700 dark:text-slate-200 mb-4 text-center">Pilih mata pelajaranmu!</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 justify-items-center">
                {Object.values(Subject).map((subj) => (
                  <button
                    key={subj}
                    onClick={() => handleSubjectSelect(subj)}
                    className={`w-full flex flex-col items-center justify-center p-3 md:p-4 rounded-3xl font-bold shrink-0 transition-all border 
                        ${subject === subj ? (subjectActiveStyles[subj] + ' shadow-md ring-2') : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700 border-transparent hover:border-slate-200'}
                        `}
                  >
                    <span className={`material-symbols-rounded text-3xl md:text-4xl mb-1 ${subject === subj ? '' : (subjectColors[subj] || 'group-hover:text-blue-500') + ' transition-colors'}`}>{subjectIcons[subj] || 'school'}</span>
                    <span className="text-base md:text-lg">{subj}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area - Sticky Bottom */}
        <div className={`w-full max-w-5xl ${messages.length > 0 ? 'fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4' : 'mt-auto'} z-20`}>
          <div className="bg-card-light dark:bg-card-dark rounded-[2.5rem] p-4 md:p-6 shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-700">
            <div className="relative group">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary cursor-pointer transition-colors p-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
              >
                <span className="material-symbols-rounded text-[1.75rem] block">image</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold text-lg md:text-xl py-6 pl-16 pr-20 rounded-[2rem] border-2 border-transparent focus:border-indigo-100 dark:focus:border-indigo-900 focus:bg-white dark:focus:bg-slate-800 focus:ring-0 transition-all shadow-inner dark:shadow-none"
                placeholder={`Ketik pertanyaan ${subject}...`}
                type="text"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-400 rounded-full flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary transition-all shadow-sm hover:shadow-lg hover:shadow-indigo-300 dark:hover:shadow-indigo-900/50 group-focus-within:bg-primary group-focus-within:text-white transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-rounded text-2xl ml-1">send</span>
              </button>
            </div>
          </div>
          <div className={`text-center mt-6 ${messages.length > 0 ? 'hidden' : ''}`}>
            <p className="text-[0.7rem] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest opacity-70">Powered by EduMind Intelligence</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;