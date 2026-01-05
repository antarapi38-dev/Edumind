import React from 'react';
import { Message, Role, Subject } from '../types';
import { User, Sparkles, AlertCircle, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

interface ChatMessageProps {
  message: Message;
}

const getSubjectStyles = (subject?: Subject) => {
  // Debug log (optional, but helper for logic verification if needed)
  // console.log('Rendering bubble for subject:', subject);

  switch (subject) {
    case Subject.MATH:
      return {
        avatar: 'from-blue-500 to-indigo-600',
        bubble: 'bg-blue-100 border-blue-400 text-slate-900 shadow-blue-100', // Stronger Blue
        dot: 'text-blue-500',
        strong: 'text-blue-800',
        marker: 'marker:text-blue-600'
      };
    case Subject.PHYSICS:
      return {
        avatar: 'from-violet-500 to-purple-600',
        bubble: 'bg-violet-100 border-violet-400 text-slate-900 shadow-violet-100', // Stronger Purple
        dot: 'text-violet-500',
        strong: 'text-purple-800',
        marker: 'marker:text-purple-600'
      };
    case Subject.CHEMISTRY:
      return {
        avatar: 'from-lime-500 to-green-600',
        bubble: 'bg-lime-100 border-lime-400 text-slate-900 shadow-lime-100', // Stronger Green
        dot: 'text-lime-500',
        strong: 'text-green-800',
        marker: 'marker:text-green-600'
      };
    case Subject.BIOLOGY:
      return {
        avatar: 'from-emerald-500 to-teal-600',
        bubble: 'bg-emerald-100 border-emerald-400 text-slate-900 shadow-emerald-100', // Stronger Emerald
        dot: 'text-emerald-500',
        strong: 'text-teal-800',
        marker: 'marker:text-teal-600'
      };
    case Subject.HISTORY:
      return {
        avatar: 'from-orange-500 to-amber-600',
        bubble: 'bg-orange-100 border-orange-400 text-slate-900 shadow-orange-100', // Stronger Orange
        dot: 'text-orange-500',
        strong: 'text-orange-800',
        marker: 'marker:text-orange-600'
      };
    case Subject.LITERATURE:
      return {
        avatar: 'from-pink-500 to-rose-600',
        bubble: 'bg-pink-100 border-pink-400 text-slate-900 shadow-pink-100', // Stronger Pink
        dot: 'text-pink-500',
        strong: 'text-pink-800',
        marker: 'marker:text-pink-600'
      };
    case Subject.CODING:
      return {
        avatar: 'from-cyan-500 to-sky-600',
        bubble: 'bg-cyan-100 border-cyan-400 text-slate-900 shadow-cyan-100', // Stronger Cyan
        dot: 'text-cyan-500',
        strong: 'text-cyan-800',
        marker: 'marker:text-cyan-600'
      };
    case Subject.GENERAL:
    default:
      return {
        avatar: 'from-yellow-400 to-amber-500',
        bubble: 'bg-yellow-100 border-yellow-400 text-slate-900 shadow-yellow-100', // Stronger Yellow
        dot: 'text-yellow-600',
        strong: 'text-yellow-800',
        marker: 'marker:text-yellow-600'
      };
  }
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const styles = getSubjectStyles(message.subject);

  const preprocessText = (text: string) => {
    return text
      .replace(/\\\[/g, '$$$')
      .replace(/\\\]/g, '$$$')
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$');
  };

  return (
    <div className={`flex w-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3 md:gap-4`}>

        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-2xl rotate-3 flex items-center justify-center shadow-lg transition-transform hover:rotate-6 ${isUser
            ? 'bg-gradient-to-tr from-slate-400 to-slate-600 text-white'
            : `bg-gradient-to-tr ${styles.avatar} text-white`
          }`}>
          {isUser ? <User size={20} strokeWidth={2.5} /> : <div className="material-symbols-rounded text-lg">smart_toy</div>}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}>
          <div className={`relative px-6 py-4 rounded-[2rem] shadow-sm text-sm md:text-base leading-relaxed overflow-hidden border-2 transition-all duration-300 hover:shadow-md ${isUser
              ? 'bg-white text-gray-800 border-slate-100 rounded-br-none mr-1'
              : message.isError
                ? 'bg-red-50 border-red-200 text-red-700 rounded-bl-none ml-1'
                : `${styles.bubble} rounded-bl-none ml-1`
            }`}>

            {/* Decorative dot pattern overlay for AI */}
            {!isUser && !message.isError && (
              <div className={`absolute top-0 right-0 p-3 opacity-20 ${styles.dot}`}>
                <Sparkles size={16} />
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
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                      strong: ({ node, ...props }) => <span className={`font-extrabold ${styles.strong}`} {...props} />,
                      ul: ({ node, ...props }) => <ul className={`list-disc pl-5 my-3 space-y-1 ${styles.marker}`} {...props} />,
                      ol: ({ node, ...props }) => <ol className={`list-decimal pl-5 my-3 space-y-1 ${styles.marker} font-bold`} {...props} />,
                      li: ({ node, ...props }) => <li className="pl-1 text-gray-700 font-medium" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-xl font-black text-indigo-600 mb-2 mt-4" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-purple-600 mb-2 mt-3" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-base font-bold text-pink-600 mb-1 mt-2" {...props} />,
                      table: ({ node, ...props }) => <div className="overflow-x-auto my-4 rounded-lg border border-indigo-100 shadow-sm"><table className="min-w-full divide-y divide-indigo-200" {...props} /></div>,
                      thead: ({ node, ...props }) => <thead className="bg-indigo-50" {...props} />,
                      tbody: ({ node, ...props }) => <tbody className="bg-white divide-y divide-indigo-100" {...props} />,
                      tr: ({ node, ...props }) => <tr className="hover:bg-indigo-50/50 transition-colors" {...props} />,
                      th: ({ node, ...props }) => <th className="px-4 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider" {...props} />,
                      td: ({ node, ...props }) => <td className="px-4 py-3 whitespace-pre-wrap text-sm text-slate-600" {...props} />,
                      code({ node, className, children, ...props }) {
                        return (
                          <code className={`${className} bg-yellow-50 text-orange-600 rounded-md px-1.5 py-0.5 font-mono text-sm border border-yellow-200 font-bold`} {...props}>
                            {children}
                          </code>
                        )
                      },
                      pre({ node, children, ...props }) {
                        return (
                          <pre className="bg-slate-800 text-slate-100 p-4 rounded-xl overflow-x-auto my-3 text-sm shadow-inner border-4 border-slate-200" {...props}>
                            {children}
                          </pre>
                        )
                      },
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-pink-300 pl-4 py-1 my-3 bg-pink-50 rounded-r-lg italic text-pink-700" {...props} />
                      )
                    }}
                  >
                    {preprocessText(message.text)}
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