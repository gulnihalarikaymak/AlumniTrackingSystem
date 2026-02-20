import React, { useState } from 'react';
import { 
  Users, 
  BarChart2, 
  Settings, 
  Shield, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  LogOut, 
  Search,
  Plus,
  MapPin,
  Save,
  Bell,
  Lock,
  Database,
  Menu,
  X,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import atsLogo from 'figma:asset/e53d33bd8a04eb6599952774279c21a71eb10311.png';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { eventService } from '../../services/eventService';
import elifKartalImage from 'figma:asset/98196df4260a14157b9b530a259816950a8940f9.png';

// --- Mock Data ---

// Aktif Kullanıcı Verisi (Area Chart)
const activeUsersData = [
  { name: 'Pzt', users: 400 },
  { name: 'Sal', users: 300 },
  { name: 'Çar', users: 550 },
  { name: 'Per', users: 480 },
  { name: 'Cum', users: 390 },
  { name: 'Cmt', users: 240 },
  { name: 'Paz', users: 340 },
];

// Rol Dağılımı (Pie Chart)
const roleDistributionData = [
  { name: 'Mezun', value: 2350, color: '#2563eb' }, // Blue-600
  { name: 'Öğrenci', value: 1420, color: '#16a34a' }, // Green-600
];

// Sektörel Dağılım (Bar Chart)
const sectorData = [
  { name: 'Yazılım', value: 850 },
  { name: 'Finans', value: 420 },
  { name: 'Eğitim', value: 300 },
  { name: 'Sağlık', value: 250 },
  { name: 'Otomotiv', value: 180 },
  { name: 'Diğer', value: 350 },
];

// Bölüm Bazlı Sektör Dağılımı (Stacked Bar Chart)
const departmentSectorData = [
  { name: 'Bilgisayar Müh.', Teknoloji: 900, Finans: 100, Hizmet: 50, Sanayi: 50, Diğer: 20 },
  { name: 'Endüstri Müh.', Teknoloji: 200, Finans: 150, Hizmet: 300, Sanayi: 500, Diğer: 50 },
  { name: 'İşletme', Teknoloji: 100, Finans: 600, Hizmet: 400, Sanayi: 200, Diğer: 100 },
  { name: 'YBS', Teknoloji: 500, Finans: 200, Hizmet: 300, Sanayi: 50, Diğer: 50 },
  { name: 'Hukuk', Teknoloji: 20, Finans: 100, Hizmet: 800, Sanayi: 30, Diğer: 50 },
];

// Başlangıç verisi
const initialPendingUsers = [
  { id: 1, name: 'Ayşe Yılmaz', role: 'Mezun', year: '2023', dept: 'Bilgisayar Müh.', date: '10 Dakika önce' },
  { id: 2, name: 'Mehmet Demir', role: 'Öğrenci', year: '2021', dept: 'Endüstri Müh.', date: '1 Saat önce' },
  { id: 3, name: 'Zeynep Kaya', role: 'Mezun', year: '2020', dept: 'İşletme', date: '2 Saat önce' },
  { id: 4, name: 'Can Özkan', role: 'Öğrenci', year: '2022', dept: 'Hukuk', date: '3 Saat önce' },
  { id: 5, name: 'Elif Şahin', role: 'Mezun', year: '2019', dept: 'Tıp', date: '1 Gün önce' },
  // YBS Öğrencileri ve Mezunları
  { id: 6, name: 'Burak Yılmaz', role: 'Öğrenci', year: '2024', dept: 'Yönetim Bilişim Sistemleri', date: '2 Dakika önce' },
  { id: 7, name: 'Selin Demir', role: 'Öğrenci', year: '2023', dept: 'Yönetim Bilişim Sistemleri', date: '5 Dakika önce' },
  { id: 8, name: 'Mert Kaya', role: 'Öğrenci', year: '2025', dept: 'Yönetim Bilişim Sistemleri', date: '15 Dakika önce' },
  { id: 9, name: 'Ozan Çelik', role: 'Mezun', year: '2023', dept: 'Yönetim Bilişim Sistemleri', date: '20 Dakika önce' },
  { id: 10, name: 'Ece Güneş', role: 'Öğrenci', year: '2022', dept: 'Yönetim Bilişim Sistemleri', date: '30 Dakika önce' },
  { id: 11, name: 'Kaan Yıldız', role: 'Mezun', year: '2021', dept: 'Yönetim Bilişim Sistemleri', date: '45 Dakika önce' },
];

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'events' | 'settings' | 'mentorship'>('overview');
  
  // Kullanıcı listesi durumu
  const [pendingUsers, setPendingUsers] = useState(initialPendingUsers);

  // Admin Bildirimleri
  const [notifications] = useState([
    { id: 1, text: 'Yeni personel hesabı onayı bekliyor.', time: '5 dk önce', read: false },
    { id: 2, text: 'Sistem yedeklemesi başarıyla tamamlandı.', time: '1 saat önce', read: true },
    { id: 3, text: '3 yeni mezun kaydı şüpheli olarak işaretlendi.', time: '3 saat önce', read: false },
    { id: 4, text: 'Sunucu doluluk oranı %85 seviyesine ulaştı.', time: '5 saat önce', read: true },
    { id: 5, text: 'Kariyer Zirvesi etkinliği için 150 yeni kayıt.', time: 'Dün', read: true },
  ]);

  // Ayarlar Durumu
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    welcomeEmail: true,
    eventReminders: true,
    approvalNotifications: true,
    twoFactorAuth: false
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // İşlem fonksiyonları
  const handleApprove = (id: number) => {
    // Gerçek uygulamada API çağrısı yapılır
    setPendingUsers(prev => prev.filter(user => user.id !== id));
    toast.success('Kullanıcı başarıyla onaylandı.');
  };

  const handleReject = (id: number) => {
    // Gerçek uygulamada API çağrısı yapılır
    setPendingUsers(prev => prev.filter(user => user.id !== id));
    toast.info('Kullanıcı reddedildi.');
  };

  const handleSaveSettings = () => {
    toast.success('Sistem ayarları başarıyla kaydedildi.');
  };

  const handleBackup = () => {
    toast.success('Yedekleme işlemi başlatıldı. Tamamlandığında bildirim alacaksınız.');
  };

  const handleClearCache = () => {
    toast.success('Sistem önbelleği temizlendi.');
  };

  // Mentorship Data
  const [mentorshipSettings, setMentorshipSettings] = useState({
    enabled: true,
    autoMatch: false,
    maxMenteesPerMentor: 3
  });

  const [mentorshipStats] = useState({
    totalMatches: 142,
    activeMentors: 85,
    activeMentees: 130,
    pendingRequests: 24
  });

  // Etkinlik Verileri (Global Senkronizasyon)
  const [events, setEvents] = useState<any[]>([]);
  
  // Etkinlik Formu State
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    type: "Seminer",
    description: ""
  });
  
  // Düzenleme Modu State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formu Temizle
  const resetForm = () => {
    setEventForm({
        title: "",
        date: "",
        time: "",
        location: "",
        type: "Seminer",
        description: ""
    });
    setEditingId(null);
  };
  
  // Düzenleme Modunu Başlat
  const handleEditEvent = (event: any) => {
    // Backend'den gelen tarih formatını (YYYY-MM-DDTHH:mm:ss.sssZ) input formatına (YYYY-MM-DD) çevir
    // Ancak listedeki event.date zaten YYYY-MM-DD formatına çevrilmiş durumda (renderEvents öncesi map'te)
    
    // Saati ayıklamak için orijinal tarihi bulmamız gerekebilir veya varsayılan atayabiliriz
    // Şimdilik listedeki veriyi kullanacağız
    
    setEditingId(event.id);
    setEventForm({
        title: event.title,
        date: event.date, 
        time: "09:00", // Backend'den saat verisi ayrıca gelmediği için varsayılan
        location: event.location,
        type: event.category || event.type, // type veya category kullanılıyor olabilir
        description: event.description || ""
    });
    
    // Sayfanın yukarısına kaydır (Form görünür olsun)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Varsayılan Etkinlik Verileri (Seed Data)
  const initialMockEvents = [
    { 
      title: "Global Mezunlar Ağı Zirvesi", 
      date: "2025-06-15T09:00:00.000Z",
      location: "Merkez Kongre Salonu", 
      description: "Dünyanın dört bir yanından gelen mezunlarımızın deneyimlerini paylaştığı, yeni iş birliklerinin temellerinin atıldığı büyük buluşma.",
      category: "Networking",
      image: "https://images.unsplash.com/photo-1571645163064-77faa9676a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG5ldHdvcmtpbmclMjBldmVudCUyMGNvbmZlcmVuY2V8ZW58MXx8fHwxNzY2MjcxNjUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      organizer: "Prof. Dr. Rasim ÖZCAN"
    },
    { 
      title: "Geleceğin Teknolojileri Paneli", 
      date: "2025-05-22T14:30:00.000Z",
      location: "Teknoloji Transfer Ofisi", 
      description: "Yapay zeka, blockchain ve sürdürülebilir enerji teknolojilerinin sektördeki öncü isimleri tarafından ele alınacağı vizyoner panel.",
      category: "Teknoloji" as any, // "Teknoloji" backend tipiyle eşleşmeli veya UI'da handle edilmeli
      image: "https://images.unsplash.com/photo-1762968286778-60e65336d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmUlMjB0ZWNobm9sb2d5JTIwYWklMjByb2JvdCUyMGNvbmZlcmVuY2V8ZW58MXx8fHwxNzY2MjcxNjU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      organizer: "Doç. Dr. Emre AKADAL"
    },
    { 
      title: "Kariyer Gelişim ve Fırsatlar Fuarı", 
      date: "2025-10-10T10:00:00.000Z",
      location: "Ana Kampüs Fuar Alanı", 
      description: "Sektör lideri 50'den fazla firmanın katılımıyla gerçekleşecek, staj ve iş imkanlarının sunulduğu kapsamlı kariyer etkinliği.",
      category: "Kariyer" as any,
      image: "https://images.unsplash.com/photo-1758610840977-8ee55513281c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBmYWlyJTIwY2FyZWVyJTIwZXZlbnQlMjBzdHVkZW50c3xlbnwxfHx8fDE3NjYyNzE2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      organizer: "Doç. Dr. Elif KARTAL"
    },
    { 
      title: "Yaratıcı Endüstriler Festivali", 
      date: "2025-04-05T11:00:00.000Z",
      location: "Sanat ve Tasarım Merkezi", 
      description: "Tasarım, mimarlık ve sanat alanındaki mezunlarımızın en seçkin projelerinin sergilendiği, atölye çalışmalarıyla dolu festival.",
      category: "Sanat" as any,
      image: "https://images.unsplash.com/photo-1763909855036-46b3be5085b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeSUyMHVuaXZlcnNpdHl8ZW58MXx8fHwxNzY2MjcxNjYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      organizer: "Doç. Dr. Zeki ÖZEN"
    },
    { 
      title: "Liderlik ve Yönetim Semineri", 
      date: "2025-11-20T15:00:00.000Z",
      location: "İşletme Fakültesi Amfisi", 
      description: "Kriz yönetimi ve stratejik liderlik konularında uzman yöneticilerin vaka analizleri eşliğinde sunum yapacağı sertifikalı seminer.",
      category: "İş Dünyası" as any,
      image: "https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGxlYWRlcnNoaXAlMjBzZW1pbmFyJTIwc3BlYWtlcnxlbnwxfHx8fDE3NjYyNzE2Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      organizer: "Doç. Dr. Gökhan ÖVENÇ"
    }
  ];

  // Etkinlikleri Yükle
  React.useEffect(() => {
    const fetchAndSeedEvents = async () => {
      let allEvents = await eventService.getAll();
      
      // Eğer veritabanı boşsa, varsayılan verileri ekle (Seeding)
      if (Array.isArray(allEvents) && allEvents.length === 0) {
        // Promise.all ile paralel ekleme yapabiliriz ama sıra önemli değil
        for (const event of initialMockEvents) {
            await eventService.create(event);
        }
        // Tekrar çek
        allEvents = await eventService.getAll();
        toast.success("Varsayılan etkinlik verileri veritabanına eklendi.");
      }

      if (Array.isArray(allEvents)) {
        const formattedEvents = allEvents.reduce((acc: any[], e: any) => {
            if (!e || !e.date) return acc;
            try {
                acc.push({
                    ...e,
                    // Backend'den gelen veri ile UI uyumluluğu
                    date: e.date.split('T')[0], // Sadece tarih kısmı
                    participants: 0, // Bu veri şimdilik backend'de yok
                    status: "Yayında",
                    // Tip uyumluluğu için
                    type: e.category || "Genel"
                });
            } catch (err) {
                console.error("Event format error in AdminDashboard:", err);
            }
            return acc;
        }, []);
        setEvents(formattedEvents);
      }
    };
    fetchAndSeedEvents();
  }, []);

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!eventForm.title || !eventForm.date) {
        toast.error("Lütfen başlık ve tarih giriniz.");
        return;
    }
    
    try {
        const eventData = {
            title: eventForm.title,
            date: new Date(`${eventForm.date}T${eventForm.time || "09:00"}`).toISOString(),
            location: eventForm.location,
            category: eventForm.type as any,
            description: eventForm.description,
            organizer: "Admin"
        };
        
        let success = false;
        
        if (editingId) {
            // Güncelleme
            const updated = await eventService.update(editingId, eventData);
            if (updated) success = true;
        } else {
            // Yeni Oluşturma
            const created = await eventService.create(eventData);
            if (created) success = true;
        }

        if(success) {
            toast.success(editingId ? "Etkinlik güncellendi!" : "Etkinlik başarıyla yayınlandı!");
            
            // Listeyi güncelle
            const allEvents = await eventService.getAll();
            if (Array.isArray(allEvents)) {
                const formattedEvents = allEvents.reduce((acc: any[], ev: any) => {
                    if (!ev || !ev.date) return acc;
                    try {
                        acc.push({
                            ...ev,
                            date: ev.date.split('T')[0],
                            participants: 0,
                            status: "Yayında",
                            type: ev.category || "Genel"
                        });
                    } catch (err) {
                        console.error("Event refresh error:", err);
                    }
                    return acc;
                }, []);
                setEvents(formattedEvents);
            }
            
            // Formu temizle
            resetForm();
        }
    } catch (error) {
        toast.error("İşlem sırasında bir hata oluştu.");
    }
  };

  const handleDeleteEvent = async (id: any) => {
    // ID number veya string gelebilir, servise string yolluyoruz
    await eventService.delete(String(id));
    setEvents(events.filter(ev => ev.id !== id));
    toast.success("Etkinlik silindi.");
  };

  const [recentMatches] = useState([
    { id: 1, mentor: "Mustafa Kemal", mentee: "Ali Veli", date: "12.12.2025", status: "Aktif", department: "Bilgisayar Müh." },
    { id: 2, mentor: "Ayşe Yılmaz", mentee: "Zeynep Demir", date: "10.12.2025", status: "Aktif", department: "Endüstri Müh." },
    { id: 3, mentor: "Caner Erkin", mentee: "Mehmet Öz", date: "09.12.2025", status: "Bekliyor", department: "Yazılım Müh." },
    { id: 4, mentor: "Elif Su", mentee: "Burcu Yıldız", date: "08.12.2025", status: "Tamamlandı", department: "İşletme" },
    { id: 5, mentor: "Ahmet Kaya", mentee: "Selin Yılmaz", date: "05.12.2025", status: "Aktif", department: "Hukuk" },
  ]);

  const handleSaveMentorshipSettings = () => {
    toast.success('Mentorluk ayarları güncellendi.');
  };

  // --- Render Functions ---

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100 shadow-lg shadow-blue-900/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Toplam Kullanıcı</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3,770</div>
            <p className="text-xs text-slate-400">+180 bu ay</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100 shadow-lg shadow-orange-900/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Onay Bekleyen</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{pendingUsers.length}</div>
            <p className="text-xs text-slate-400">İşlem bekleniyor</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100 shadow-lg shadow-purple-900/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Aktif Etkinlik</CardTitle>
            <Calendar className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-slate-400">Bu hafta</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100 shadow-lg shadow-cyan-900/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Toplam Mesaj</CardTitle>
            <MessageSquare className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">12.5K</div>
            <p className="text-xs text-slate-400">+2.1K bu hafta</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Active Users & Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-slate-100">Haftalık Aktif Kullanıcı Grafiği</CardTitle>
            <CardDescription className="text-slate-400">Sisteme günlük giriş yapan tekil kullanıcı sayıları</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px] min-h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={activeUsersData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8'}} />
                  <YAxis stroke="#64748b" tick={{fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-slate-100">Kullanıcı Dağılımı</CardTitle>
            <CardDescription className="text-slate-400">Öğrenci vs Mezun Oranı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px] min-h-[300px] relative">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {roleDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-slate-300">{value}</span>}/>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">3.7K</span>
                  <p className="text-xs text-slate-400">Toplam</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Sector Distribution */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
            <CardHeader>
              <CardTitle className="text-slate-100">Bölüm Bazlı Sektör Analizi</CardTitle>
              <CardDescription className="text-slate-400">Mezunların bölümlerine göre çalıştıkları ana sektörlerin dağılımı</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px] min-h-[400px]">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={departmentSectorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                    <Tooltip 
                      cursor={{fill: '#1e293b'}}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => <span className="text-slate-300">{value}</span>} />
                    <Bar dataKey="Teknoloji" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} animationDuration={1500} />
                    <Bar dataKey="Finans" stackId="a" fill="#10b981" animationDuration={1600} />
                    <Bar dataKey="Hizmet" stackId="a" fill="#8b5cf6" animationDuration={1700} />
                    <Bar dataKey="Sanayi" stackId="a" fill="#f59e0b" animationDuration={1800} />
                    <Bar dataKey="Diğer" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} animationDuration={1900} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-slate-100">Genel Sektörel Dağılım</CardTitle>
            <CardDescription className="text-slate-400">Tüm mezunların en çok çalıştığı sektörler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px] min-h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8'}} />
                  <YAxis stroke="#64748b" tick={{fill: '#94a3b8'}} />
                  <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', color: '#fff' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Doğrulama Kuyruğu</h2>
          <p className="text-slate-400">Sisteme kayıt olan ve onay bekleyen kullanıcılar.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            <Search size={16} /> Filtrele
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {pendingUsers.map((user) => (
            <motion.div
              key={user.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -20, transition: { duration: 0.2 } }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden bg-slate-900/50 border-slate-800 text-slate-100">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-slate-700 shadow-sm">
                        <AvatarFallback className={user.role === 'Mezun' ? 'bg-blue-900/50 text-blue-400' : 'bg-green-900/50 text-green-400'}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-white">{user.name}</h3>
                          <Badge variant={user.role === 'Mezun' ? 'default' : 'secondary'} className={user.role === 'Öğrenci' ? 'bg-green-900/30 text-green-400 border-green-900 hover:bg-green-900/50' : 'bg-blue-600 hover:bg-blue-700'}>
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">
                          {user.dept} • {user.role === 'Mezun' ? `Mezuniyet: ${user.year}` : `Giriş: ${user.year}`}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Başvuru: {user.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <Button 
                        variant="outline" 
                        className="flex-1 md:flex-none border-red-900/50 text-red-400 bg-red-900/10 hover:bg-red-900/30 hover:text-red-300 hover:border-red-800"
                        onClick={() => handleReject(user.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reddet
                      </Button>
                      <Button 
                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
                        onClick={() => handleApprove(user.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Onayla
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {pendingUsers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 text-slate-500"
          >
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-900/50" />
            <p>Harika! Bekleyen onay bulunmuyor.</p>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Etkinlik Yönetimi</h2>
          <p className="text-slate-400">Yeni etkinlik oluşturun ve yayınlayın.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Form */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-white">{editingId ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle'}</CardTitle>
            <CardDescription className="text-slate-400">Etkinlik detaylarını girerek tüm kullanıcılara duyurun.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-300">Etkinlik Başlığı</Label>
              <Input 
                id="title" 
                placeholder="Örn: Kariyer Zirvesi 2024" 
                className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500/50" 
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-slate-300">Tarih</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input 
                    id="date" 
                    type="date" 
                    className="pl-10 bg-slate-950/50 border-slate-800 text-white focus:border-blue-500/50 color-scheme-dark" 
                    style={{colorScheme: 'dark'}} 
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-slate-300">Saat</Label>
                <Input 
                    id="time" 
                    type="time" 
                    className="bg-slate-950/50 border-slate-800 text-white focus:border-blue-500/50" 
                    style={{colorScheme: 'dark'}} 
                    value={eventForm.time}
                    onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-300">Konum / Link</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                    id="location" 
                    placeholder="Örn: Konferans Salonu A veya Zoom Linki" 
                    className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500/50" 
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-slate-300">Etkinlik Türü</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                value={eventForm.type}
                onChange={(e) => setEventForm({...eventForm, type: e.target.value})}
              >
                <option value="Seminer">Seminer</option>
                <option value="Buluşma">Buluşma</option>
                <option value="Workshop">Workshop</option>
                <option value="Online Webinar">Online Webinar</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">Açıklama</Label>
              <Textarea 
                id="description" 
                placeholder="Etkinlik hakkında detaylı bilgi..." 
                className="min-h-[120px] bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500/50" 
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              {editingId && (
                <Button 
                  variant="outline" 
                  className="border-red-900/50 text-red-400 hover:bg-red-900/20 hover:text-red-300 bg-transparent"
                  onClick={resetForm}
                >
                  Vazgeç
                </Button>
              )}
              {!editingId && (
                <Button 
                    variant="outline" 
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
                    onClick={() => toast.success("Taslak olarak kaydedildi.")}
                >
                    Taslak Olarak Kaydet
                </Button>
              )}
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
                onClick={handleSaveEvent}
              >
                {editingId ? 'Güncelle' : 'Etkinliği Yayınla'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips / Preview */}
        <div className="space-y-6">
          <Card className="bg-slate-900/30 border-dashed border-slate-700">
            <CardHeader>
              <CardTitle className="text-base text-slate-300">İpuçları</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-400 space-y-2">
              <p>• Etkinlik görselleri 16:9 formatında olmalıdır.</p>
              <p>• "Buluşma" türündeki etkinlikler mezunlara özel bildirim gönderir.</p>
              <p>• Konum bilgisini harita linki olarak eklemek katılımı artırır.</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
            <CardHeader>
              <CardTitle className="text-base text-white">Son Eklenen Etkinlikler</CardTitle>
              <CardDescription className="text-slate-400">Toplam {events.length} etkinlik yayında</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {events.map((event) => (
                <div key={event.id} className="flex flex-col gap-2 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-900/30 text-blue-400 font-bold p-2 rounded text-center min-w-[50px] border border-blue-900/50">
                      {event.date.split('-')[2]}<br/>
                      <span className="text-xs font-normal">
                        {new Date(event.date).toLocaleString('tr-TR', { month: 'short' }).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-slate-200 line-clamp-1" title={event.title}>{event.title}</h4>
                        <Badge variant="outline" className="text-[10px] h-5 border-slate-700 text-slate-400">
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>{event.organizer}</span>
                        <span>•</span>
                        <span>{event.location}</span>
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 px-2"
                          onClick={() => handleEditEvent(event)}
                        >
                          Düzenle
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 px-2"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          Sil
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Sistem Ayarları</h2>
          <p className="text-slate-400">Platform yapılandırması ve güvenlik tercihleri.</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-900/20"
          onClick={handleSaveSettings}
        >
          <Save size={16} /> Değişiklikleri Kaydet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5 text-blue-400" /> Genel Ayarlar
            </CardTitle>
            <CardDescription className="text-slate-400">Temel sistem yapılandırması</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="text-slate-300">Bakım Modu</Label>
                <p className="text-xs text-slate-500">Sistemi kullanıcılara kapat</p>
              </div>
              <Switch 
                checked={systemSettings.maintenanceMode}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                className="data-[state=checked]:bg-blue-600" 
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="text-slate-300">Yeni Üye Alımı</Label>
                <p className="text-xs text-slate-500">Kayıt formunu aktif et</p>
              </div>
              <Switch 
                checked={systemSettings.newRegistrations}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, newRegistrations: checked }))}
                className="data-[state=checked]:bg-blue-600" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5 text-purple-400" /> Bildirim Tercihleri
            </CardTitle>
            <CardDescription className="text-slate-400">Otomatik gönderim ayarları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="text-slate-300">Hoşgeldin E-postası</Label>
                <p className="text-xs text-slate-500">Yeni üyelere otomatik gönder</p>
              </div>
              <Switch 
                checked={systemSettings.welcomeEmail}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, welcomeEmail: checked }))}
                className="data-[state=checked]:bg-purple-600" 
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="text-slate-300">Etkinlik Hatırlatıcıları</Label>
                <p className="text-xs text-slate-500">Etkinlik öncesi bildirim</p>
              </div>
              <Switch 
                checked={systemSettings.eventReminders}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, eventReminders: checked }))}
                className="data-[state=checked]:bg-purple-600" 
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="text-slate-300">Onay Bildirimleri</Label>
                <p className="text-xs text-slate-500">Hesap onaylandığında bildir</p>
              </div>
              <Switch 
                checked={systemSettings.approvalNotifications}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, approvalNotifications: checked }))}
                className="data-[state=checked]:bg-purple-600" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lock className="h-5 w-5 text-orange-400" /> Güvenlik
            </CardTitle>
            <CardDescription className="text-slate-400">Erişim ve yetkilendirme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Admin Şifre Değiştir</Label>
              <Input type="password" placeholder="Yeni şifre..." className="bg-slate-950/50 border-slate-800 text-white focus:border-orange-500/50" />
            </div>
             <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="text-slate-300">2FA Zorunluluğu</Label>
                <p className="text-xs text-slate-500">Yöneticiler için iki aşamalı doğrulama</p>
              </div>
              <Switch 
                checked={systemSettings.twoFactorAuth}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                className="data-[state=checked]:bg-orange-600" 
              />
            </div>
          </CardContent>
        </Card>

        {/* System Data */}
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="h-5 w-5 text-green-400" /> Veri ve Yedekleme
            </CardTitle>
            <CardDescription className="text-slate-400">Veritabanı işlemleri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-300">Son Yedekleme</span>
                <Badge variant="outline" className="border-green-900/50 text-green-400">Başarılı</Badge>
              </div>
              <p className="text-xs text-slate-500">13.12.2025 - 03:00</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={handleBackup}
            >
              Şimdi Yedekle
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-red-900/30 text-red-400 hover:bg-red-900/10 hover:text-red-300"
              onClick={handleClearCache}
            >
              Önbelleği Temizle
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMentorship = () => (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-900/20"
          onClick={handleSaveMentorshipSettings}
        >
          <Save size={16} /> Ayarları Kaydet
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <Card className="bg-slate-900/50 border-slate-800 text-slate-100 shadow-lg shadow-indigo-900/5">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="p-3 bg-indigo-900/30 text-indigo-400 rounded-lg border border-indigo-900/50">
                  <Award size={24} />
               </div>
               <div>
                  <p className="text-sm text-slate-500">Toplam Eşleşme</p>
                  <p className="text-2xl font-bold text-white">{mentorshipStats.totalMatches}</p>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-slate-900/50 border-slate-800 text-slate-100 shadow-lg shadow-blue-900/5">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="p-3 bg-blue-900/30 text-blue-400 rounded-lg border border-blue-900/50">
                  <Users size={24} />
               </div>
               <div>
                  <p className="text-sm text-slate-500">Aktif Mentor</p>
                  <p className="text-2xl font-bold text-white">{mentorshipStats.activeMentors}</p>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-slate-900/50 border-slate-800 text-slate-100 shadow-lg shadow-green-900/5">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="p-3 bg-green-900/30 text-green-400 rounded-lg border border-green-900/50">
                  <Users size={24} />
               </div>
               <div>
                  <p className="text-sm text-slate-500">Aktif Menti</p>
                  <p className="text-2xl font-bold text-white">{mentorshipStats.activeMentees}</p>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-slate-900/50 border-slate-800 text-slate-100 shadow-lg shadow-yellow-900/5">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="p-3 bg-yellow-900/30 text-yellow-400 rounded-lg border border-yellow-900/50">
                  <Shield size={24} />
               </div>
               <div>
                  <p className="text-sm text-slate-500">Bekleyen İstek</p>
                  <p className="text-2xl font-bold text-white">{mentorshipStats.pendingRequests}</p>
               </div>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Settings Column */}
         <Card className="bg-slate-900/50 border-slate-800 text-slate-100 h-fit">
            <CardHeader>
               <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5 text-indigo-400" /> Program Ayarları
               </CardTitle>
               <CardDescription className="text-slate-400">Mentorluk sistemi yapılandırması</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                     <Label className="text-slate-300">Mentorluk Programı</Label>
                     <p className="text-xs text-slate-500">Programı genel olarak aç/kapat</p>
                  </div>
                  <Switch 
                     checked={mentorshipSettings.enabled}
                     onCheckedChange={(checked) => setMentorshipSettings(prev => ({ ...prev, enabled: checked }))}
                     className="data-[state=checked]:bg-indigo-600" 
                  />
               </div>
               <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                     <Label className="text-slate-300">Otomatik Eşleşme (AI)</Label>
                     <p className="text-xs text-slate-500">Yapay zeka önerilerini aktifleştir</p>
                  </div>
                  <Switch 
                     checked={mentorshipSettings.autoMatch}
                     onCheckedChange={(checked) => setMentorshipSettings(prev => ({ ...prev, autoMatch: checked }))}
                     className="data-[state=checked]:bg-indigo-600" 
                  />
               </div>
               <div className="space-y-2 pt-2">
                  <Label className="text-slate-300">Maksimum Menti Sınırı (Mentor Başına)</Label>
                  <Input 
                     type="number" 
                     value={mentorshipSettings.maxMenteesPerMentor}
                     onChange={(e) => setMentorshipSettings(prev => ({ ...prev, maxMenteesPerMentor: parseInt(e.target.value) }))}
                     className="bg-slate-950/50 border-slate-800 text-white"
                  />
               </div>
            </CardContent>
         </Card>

         {/* Matches List Column */}
         <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 text-slate-100">
            <CardHeader>
               <CardTitle className="text-white">Son Eşleşmeler</CardTitle>
               <CardDescription className="text-slate-400">Sistemdeki son mentor-menti aktiviteleri</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="grid grid-cols-4 text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-800">
                     <div className="col-span-1">Mentor</div>
                     <div className="col-span-1">Menti</div>
                     <div className="col-span-1">Bölüm</div>
                     <div className="col-span-1 text-right">Durum</div>
                  </div>
                  {recentMatches.map((match) => (
                     <div key={match.id} className="grid grid-cols-4 items-center py-2 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20 transition-colors px-2 -mx-2 rounded">
                        <div className="col-span-1 font-medium text-white">{match.mentor}</div>
                        <div className="col-span-1 text-slate-300">{match.mentee}</div>
                        <div className="col-span-1 text-slate-400 text-sm">{match.department}</div>
                        <div className="col-span-1 flex justify-end">
                           <Badge variant="outline" className={`
                              ${match.status === 'Aktif' ? 'border-green-900 text-green-400 bg-green-900/10' : ''}
                              ${match.status === 'Bekliyor' ? 'border-yellow-900 text-yellow-400 bg-yellow-900/10' : ''}
                              ${match.status === 'Tamamlandı' ? 'border-blue-900 text-blue-400 bg-blue-900/10' : ''}
                           `}>
                              {match.status}
                           </Badge>
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f111a] flex font-sans text-slate-100 relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-[#0B1026] text-white flex flex-col fixed h-full z-50 border-r border-slate-900 
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow-lg shadow-blue-900/20">
              <img src={atsLogo} alt="ATS Logo" className="w-full h-full object-contain" />
            </div>
            Yönetici
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-left ${activeTab === 'overview' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => {
              setActiveTab('overview');
              setIsMobileMenuOpen(false);
            }}
          >
            <BarChart2 className="mr-2 h-5 w-5" />
            Genel Bakış
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-left ${activeTab === 'verification' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => {
              setActiveTab('verification');
              setIsMobileMenuOpen(false);
            }}
          >
            <Shield className="mr-2 h-5 w-5" />
            Doğrulama Kuyruğu
            {pendingUsers.length > 0 && (
              <span className="ml-auto bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full shadow-lg shadow-orange-900/50">
                {pendingUsers.length}
              </span>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-left ${activeTab === 'events' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => {
              setActiveTab('events');
              setIsMobileMenuOpen(false);
            }}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Etkinlik Yönetimi
          </Button>

          <Button 
            variant="ghost" 
            className={`w-full justify-start text-left ${activeTab === 'mentorship' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => {
              setActiveTab('mentorship');
              setIsMobileMenuOpen(false);
            }}
          >
            <Award className="mr-2 h-5 w-5" />
            Mentorluk
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-left ${activeTab === 'settings' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => {
              setActiveTab('settings');
              setIsMobileMenuOpen(false);
            }}
          >
            <Settings className="mr-2 h-5 w-5" />
            Ayarlar
          </Button>
        </nav>

        <div className="p-4 border-t border-slate-900">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-auto bg-gradient-to-br from-blue-950/20 via-slate-950 to-black w-full">
        <header className="flex justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {activeTab === 'overview' && 'Yönetim Paneli'}
                {activeTab === 'verification' && 'Kullanıcı İşlemleri'}
                {activeTab === 'events' && 'Etkinlikler'}
                {activeTab === 'mentorship' && 'Mentorluk Yönetimi'}
                {activeTab === 'settings' && 'Ayarlar'}
              </h1>
              <p className="text-slate-400 text-xs md:text-sm hidden sm:block">Sistemin genel durumunu ve içeriklerini yönetin.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
             <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
                  <Bell className="h-5 w-5" />
                  {notifications.some(n => !n.read) && <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-slate-900 border-slate-800 p-0 mr-4" align="end">
                <div className="p-4 border-b border-slate-800">
                  <h4 className="font-semibold text-white">Sistem Bildirimleri</h4>
                </div>
                <ScrollArea className="h-[300px]">
                  <div className="divide-y divide-slate-800">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 hover:bg-slate-800/50 transition-colors ${!notif.read ? 'bg-blue-900/10' : ''}`}>
                        <p className="text-sm text-slate-200">{notif.text}</p>
                        <span className="text-xs text-slate-500 mt-1 block">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>

             <div className="text-right hidden sm:block">
               <p className="text-sm font-medium text-white">Doç. Dr. Elif KARTAL</p>
               <p className="text-xs text-slate-500">Süper Yönetici</p>
             </div>
             <Avatar className="border-2 border-slate-700 h-8 w-8 md:h-10 md:w-10">
               <AvatarImage src={elifKartalImage} />
               <AvatarFallback className="bg-blue-600 text-white">EK</AvatarFallback>
             </Avatar>
          </div>
        </header>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'verification' && renderVerification()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'mentorship' && renderMentorship()}
        {activeTab === 'settings' && renderSettings()}
      </main>
    </div>
  );
}