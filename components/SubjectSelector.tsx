import React from 'react';
import { Subject } from '../types';
import { 
  BookOpen, Calculator, FlaskConical, Globe, Code, 
  History, GraduationCap, Microscope, PenTool, Palette 
} from 'lucide-react';

interface SubjectSelectorProps {
  selectedSubject: Subject;
  onSelect: (subject: Subject) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ selectedSubject, onSelect }) => {
  
  // Colorful mapping for subjects to give a fun sticker vibe
  const getSubjectStyle = (s: Subject) => {
    switch (s) {
      case Subject.MATH: return "bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200";
      case Subject.PHYSICS: return "bg-violet-100 text-violet-600 border-violet-200 hover:bg-violet-200";
      case Subject.CHEMISTRY: return "bg-teal-100 text-teal-600 border-teal-200 hover:bg-teal-200";
      case Subject.BIOLOGY: return "bg-green-100 text-green-600 border-green-200 hover:bg-green-200";
      case Subject.HISTORY: return "bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200";
      case Subject.LITERATURE: return "bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200";
      case Subject.CODING: return "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200";
      default: return "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200";
    }
  };

  const getIcon = (s: Subject) => {
    switch (s) {
      case Subject.MATH: return <Calculator size={16} strokeWidth={2.5} />;
      case Subject.PHYSICS: return <PenTool size={16} strokeWidth={2.5} />;
      case Subject.CHEMISTRY: return <FlaskConical size={16} strokeWidth={2.5} />;
      case Subject.BIOLOGY: return <Microscope size={16} strokeWidth={2.5} />;
      case Subject.HISTORY: return <History size={16} strokeWidth={2.5} />;
      case Subject.LITERATURE: return <BookOpen size={16} strokeWidth={2.5} />;
      case Subject.CODING: return <Code size={16} strokeWidth={2.5} />;
      case Subject.GENERAL: return <Palette size={16} strokeWidth={2.5} />;
      default: return <Globe size={16} strokeWidth={2.5} />;
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 pt-2 scrollbar-hide px-2">
      {Object.values(Subject).map((subject) => {
        const isSelected = selectedSubject === subject;
        const style = getSubjectStyle(subject);
        
        return (
          <button
            key={subject}
            onClick={() => onSelect(subject)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap 
              transition-all duration-300 transform border-2
              ${isSelected 
                ? `${style} scale-105 shadow-md ring-2 ring-offset-1 ring-white ring-opacity-60` 
                : 'bg-white border-transparent text-gray-400 hover:bg-gray-50 hover:scale-105'}
            `}
          >
            <span className={`${isSelected ? 'opacity-100' : 'opacity-70'}`}>
              {getIcon(subject)}
            </span>
            {subject}
          </button>
        );
      })}
    </div>
  );
};

export default SubjectSelector;