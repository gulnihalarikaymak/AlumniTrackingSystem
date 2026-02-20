import React from 'react';
import { motion } from 'motion/react';
import { Code2, PenTool, TrendingUp, Cpu, GraduationCap, Building2, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { Alumni } from '../types/alumni';

type IndustryType = Alumni['industry'] | 'All';

interface SectorFilterProps {
  selectedIndustry: IndustryType;
  onSelect: (industry: IndustryType) => void;
  counts: Record<string, number>;
}

const SECTORS: { id: IndustryType; label: string; icon: React.ReactNode }[] = [
  { id: 'All', label: 'Tüm Sektörler', icon: <Globe size={16} /> },
  { id: 'Technology', label: 'Yazılım & Teknoloji', icon: <Code2 size={16} /> },
  { id: 'Design', label: 'Tasarım', icon: <PenTool size={16} /> },
  { id: 'Finance', label: 'Finans', icon: <TrendingUp size={16} /> },
  { id: 'Engineering', label: 'Mühendislik', icon: <Cpu size={16} /> },
  { id: 'Architecture', label: 'Mimarlık', icon: <Building2 size={16} /> },
  { id: 'Education', label: 'Eğitim', icon: <GraduationCap size={16} /> },
];

export function SectorFilter({ selectedIndustry, onSelect, counts }: SectorFilterProps) {
  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-start gap-3 overflow-x-auto no-scrollbar py-2">
        {SECTORS.map((sector) => (
          <button
            key={sector.id}
            onClick={() => onSelect(sector.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border",
              selectedIndustry === sector.id
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50"
                : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-600"
            )}
          >
            {sector.icon}
            <span>{sector.label}</span>
            <span className={cn(
              "ml-1 text-xs px-2 py-0.5 rounded-full font-bold",
              selectedIndustry === sector.id 
                ? "bg-white/20 text-white" 
                : "bg-slate-700 text-slate-400"
            )}>
              {counts[sector.id] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
