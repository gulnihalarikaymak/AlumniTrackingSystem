import React, { useState } from 'react';
import { Search, MapPin, GraduationCap, Building2, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Alumni } from '../types/alumni';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

interface SidebarProps {
  alumni: Alumni[];
  onSelect: (alumni: Alumni) => void;
  selectedId?: string;
}

export function Sidebar({ alumni, onSelect, selectedId }: SidebarProps) {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const filteredAlumni = alumni.filter(person => 
    person.name.toLowerCase().includes(search.toLowerCase()) ||
    person.city.toLowerCase().includes(search.toLowerCase()) ||
    person.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
      className={cn(
        "bg-white border-r border-slate-200 h-full flex flex-col transition-all duration-300 relative z-10 shadow-xl",
        collapsed ? "w-0 md:w-16" : "w-full md:w-96"
      )}
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={20} />
            </div>
            <h1 className="font-bold text-xl text-slate-800 tracking-tight">AlumniMap</h1>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn("hidden md:flex", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {!collapsed && (
        <>
          <div className="p-4 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Search name, city or company..." 
                className="pl-9 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {filteredAlumni.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <p>No alumni found</p>
                </div>
              ) : (
                filteredAlumni.map((person) => (
                  <div
                    key={person.id}
                    onClick={() => onSelect(person)}
                    className={cn(
                      "p-3 rounded-xl cursor-pointer transition-all border border-transparent hover:border-slate-200 hover:shadow-sm group",
                      selectedId === person.id ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-slate-100"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img 
                          src={person.avatar} 
                          alt={person.name} 
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                          <div className="bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-white"></div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={cn("font-semibold truncate", selectedId === person.id ? "text-blue-700" : "text-slate-900")}>
                          {person.name}
                        </h3>
                        <p className="text-sm text-slate-500 truncate">{person.role}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
                            <Building2 size={10} /> {person.company}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded ml-auto">
                            <MapPin size={10} /> {person.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-slate-100 text-xs text-center text-slate-400">
            Alumni Tracking System © {new Date().getFullYear()}
          </div>
        </>
      )}

      {/* Collapsed View Icons */}
      {collapsed && (
        <div className="flex flex-col items-center gap-4 py-4">
          <Button variant="ghost" size="icon" className="rounded-full bg-blue-50 text-blue-600">
            <Search size={20} />
          </Button>
          <div className="w-8 h-px bg-slate-200" />
          {alumni.slice(0, 5).map(person => (
             <div 
               key={person.id}
               onClick={() => onSelect(person)}
               className="w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all relative"
             >
               <img src={person.avatar} className="w-full h-full object-cover" />
               {selectedId === person.id && (
                 <div className="absolute inset-0 bg-blue-500/20 ring-2 ring-blue-600 rounded-full" />
               )}
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
