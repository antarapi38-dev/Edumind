import React from 'react';
import { Message, Role } from '../types';
import { User, Sparkles, AlertCircle, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3 md:gap-4`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-2xl rotate-3 flex items-center justify-center shadow-lg transition-transform hover:rotate-6 ${
          isUser 
            ? 'bg-gradient-to-tr from-blue-400 to-indigo-500 text-white' 
            : 'bg-gradient-to-tr from-emerald-400 to-teal-500 text-white'
        }`}>
          {isUser ? <User size={20} strokeWidth={2.5} /> : <Bot size={20} strokeWidth={2.5} />}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}>
          <div className={`relative px-6 py-4 rounded-[2rem] shadow-sm text-sm md:text-base leading-relaxed overflow-hidden border-2 transition-all duration-300 hover:shadow-md ${
            isUser 
              ? 'bg-white text-gray-800 border-blue-100 rounded-br-none mr-1' 
              : message.isError 
                ? 'bg-red-50 border-red-200 text-red-700 rounded-bl-none ml-1'
                : 'bg-white text-gray-800 border-teal-100 rounded-bl-none ml-1'
          }`}>
            
            {/* Decorative dot pattern overlay for AI */}
            {!isUser && !message.isError && (
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Sparkles className="text-teal-500" size={24} />
              </div>
            )}

            {/* Image attachment display */}
            {message.image && (
              <div className="mb-4 relative group-image">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl blur opacity-25 group-image-hover:opacity-50 transition duration-1000 group-image-hover:duration-200"></div>
                <img 
                  src={`data:image/jpeg;base64,${message.image}`} 
                  alt="Lampiran" 
                  className="relative max-h-72 rounded-xl object-contain bg-white border border-gray-100"
                />
              </div>
            )}

            {/* Text Content */}
            {message.isError ? (
               <div className="flex items-center gap-2 font-bold">
                 <AlertCircle size={18} />
                 <span>{message.text}</span>
               </div>
            ) : (
              <div className={`markdown-body font-sans`}>
                 {/* Simple rendering for user, Markdown for AI */}
                 {isUser ? (
                    <p className="whitespace-pre-wrap font-bold text-gray-700">{message.text}</p>
                 ) : (
                    <ReactMarkdown 
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                        strong: ({node, ...props}) => <span className="font-extrabold text-teal-600" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 my-3 space-y-1 marker:text-pink-400" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-3 space-y-1 marker:text-blue-400 font-bold" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1 text-gray-700 font-medium" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-xl font-black text-indigo-600 mb-2 mt-4" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold text-purple-600 mb-2 mt-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-base font-bold text-pink-600 mb-1 mt-2" {...props} />,
                        code({node, className, children, ...props}) {
                          // Handle inline math or code
                          return (
                            <code className={`${className} bg-yellow-50 text-orange-600 rounded-md px-1.5 py-0.5 font-mono text-sm border border-yellow-200 font-bold`} {...props}>
                              {children}
                            </code>
                          )
                        },
                        pre({node, children, ...props}) {
                           return (
                             <pre className="bg-slate-800 text-slate-100 p-4 rounded-xl overflow-x-auto my-3 text-sm shadow-inner border-4 border-slate-200" {...props}>
                               {children}
                             </pre>
                           )
                        },
                        blockquote: ({node, ...props}) => (
                          <blockquote className="border-l-4 border-pink-300 pl-4 py-1 my-3 bg-pink-50 rounded-r-lg italic text-pink-700" {...props} />
                        )
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                 )}
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold text-gray-400 mt-2 px-2 uppercase tracking-widest opacity-60">
            {isUser ? 'Kamu' : 'EduMind AI'} • {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;