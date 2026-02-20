import React, { useState, useMemo } from 'react';
import { AlumniMap } from './AlumniMap';
import { SectorFilter } from './SectorFilter';
import { Alumni } from '../types/alumni';

// Mock Data
const MOCK_ALUMNI: Alumni[] = [
  {
    id: '1',
    name: 'Ayşe Yılmaz',
    role: 'Senior UX Designer',
    company: 'Spotify',
    city: 'Stockholm',
    country: 'Sweden',
    lat: 59.3293,
    lng: 18.0686,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2019,
    industry: 'Design',
    connectionDate: '2020-02-15'
  },
  {
    id: '2',
    name: 'Mehmet Demir',
    role: 'Frontend Developer',
    company: 'Google',
    city: 'London',
    country: 'UK',
    lat: 51.5074,
    lng: -0.1278,
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2020,
    industry: 'Technology',
    connectionDate: '2021-05-20'
  },
  {
    id: '3',
    name: 'Canan Kara',
    role: 'Product Manager',
    company: 'Asana',
    city: 'San Francisco',
    country: 'USA',
    lat: 37.7749,
    lng: -122.4194,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2018,
    industry: 'Technology',
    connectionDate: '2019-11-10'
  },
  {
    id: '4',
    name: 'Burak Öz',
    role: 'Data Scientist',
    company: 'DeepMind',
    city: 'Berlin',
    country: 'Germany',
    lat: 52.5200,
    lng: 13.4050,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2021,
    industry: 'Technology',
    connectionDate: '2022-01-05'
  },
  {
    id: '5',
    name: 'Zeynep Su',
    role: 'Architect',
    company: 'Freelance',
    city: 'Istanbul',
    country: 'Turkey',
    lat: 41.0082,
    lng: 28.9784,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2022,
    industry: 'Architecture',
    connectionDate: '2023-06-15'
  },
  {
    id: '6',
    name: 'Ali Vural',
    role: 'Investment Banker',
    company: 'J.P. Morgan',
    city: 'New York',
    country: 'USA',
    lat: 40.7128,
    lng: -74.0060,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2017,
    industry: 'Finance',
    connectionDate: '2018-09-01'
  },
  {
    id: '7',
    name: 'Elif Kaya',
    role: 'Civil Engineer',
    company: 'Arup',
    city: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2020,
    industry: 'Engineering',
    connectionDate: '2021-04-12'
  },
  // Yönetim Bilişim Sistemleri (YBS) Mezunları
  {
    id: '8',
    name: 'Semih Yılmaz',
    role: 'IT Consultant',
    company: 'Deloitte',
    city: 'Istanbul',
    country: 'Turkey',
    lat: 41.0582,
    lng: 29.0084,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2022,
    industry: 'Consulting',
    connectionDate: '2023-01-20'
  },
  {
    id: '9',
    name: 'Büşra Demir',
    role: 'Business Analyst',
    company: 'Trendyol',
    city: 'Ankara',
    country: 'Turkey',
    lat: 39.9334,
    lng: 32.8597,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2023,
    industry: 'Technology',
    connectionDate: '2024-01-10'
  },
  {
    id: '10',
    name: 'Onur Çelik',
    role: 'Data Analyst',
    company: 'Zalando',
    city: 'Berlin',
    country: 'Germany',
    lat: 52.5100,
    lng: 13.4150,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2021,
    industry: 'Data Science',
    connectionDate: '2022-03-15'
  },
  {
    id: '11',
    name: 'Esra Şahin',
    role: 'Product Owner',
    company: 'Wise',
    city: 'London',
    country: 'UK',
    lat: 51.5174,
    lng: -0.1178,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2020,
    industry: 'Finance',
    connectionDate: '2021-06-30'
  },
  {
    id: '12',
    name: 'Kemal Aydın',
    role: 'Software Developer',
    company: 'Booking.com',
    city: 'Amsterdam',
    country: 'Netherlands',
    lat: 52.3676,
    lng: 4.9041,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2019,
    industry: 'Technology',
    connectionDate: '2020-08-14'
  },
  {
    id: '13',
    name: 'Melis Yıldız',
    role: 'Project Manager',
    company: 'Vodafone',
    city: 'Istanbul',
    country: 'Turkey',
    lat: 41.1082,
    lng: 29.0584,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2018,
    industry: 'Telecommunications',
    connectionDate: '2019-02-28'
  },
  {
    id: '14',
    name: 'Gamze Koç',
    role: 'SAP Consultant',
    company: 'BMW Group',
    city: 'Munich',
    country: 'Germany',
    lat: 48.1351,
    lng: 11.5820,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2021,
    industry: 'Automotive',
    connectionDate: '2021-12-10'
  },
  {
    id: '15',
    name: 'Fatih Arslan',
    role: 'Cybersecurity Specialist',
    company: 'Shopify',
    city: 'Toronto',
    country: 'Canada',
    lat: 43.6532,
    lng: -79.3832,
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150',
    graduationYear: 2022,
    industry: 'Technology',
    connectionDate: '2023-05-01'
  }
];

export function AlumniNetworkSection() {
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<Alumni['industry'] | 'All'>('All');

  const filteredAlumni = useMemo(() => {
    if (selectedIndustry === 'All') return MOCK_ALUMNI;
    return MOCK_ALUMNI.filter(a => a.industry === selectedIndustry);
  }, [selectedIndustry]);

  const industryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: MOCK_ALUMNI.length };
    MOCK_ALUMNI.forEach(a => {
      counts[a.industry] = (counts[a.industry] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="w-full flex flex-col bg-[#0B1026] border-t border-slate-800 shadow-2xl">
      <div className="px-6 py-10 md:px-12 bg-gradient-to-r from-slate-900 via-[#0B1026] to-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="w-2 h-8 bg-blue-500 rounded-full inline-block"></span>
            Mezun Ağı Haritası
          </h2>
          <p className="text-slate-400 pl-5">Dünyanın dört bir yanındaki mezun bağlantılarınızı keşfedin, lokasyon bazlı filtreleme yapın ve iletişim kurun.</p>
        </div>
      </div>

      <SectorFilter 
        selectedIndustry={selectedIndustry}
        onSelect={setSelectedIndustry}
        counts={industryCounts}
      />
      
      <div className="relative w-full h-[600px] md:h-[750px]">
        <AlumniMap 
          alumni={filteredAlumni} 
          selectedAlumni={selectedAlumni}
          onSelect={setSelectedAlumni}
        />
      </div>
    </div>
  );
}