import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Camera,
  Menu,
  X,
  Home,
  Search,
  Award,
  Save,
  MapPin,
  Users,
  Briefcase,
  MessageSquare,
  Clock,
  Video,
  Trash2,
  Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { AlumniNetworkSection } from '../AlumniNetworkSection';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Calendar as CalendarComponent } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import atsLogo from 'figma:asset/e53d33bd8a04eb6599952774279c21a71eb10311.png';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface StudentDashboardProps {
  onLogout?: () => void;
}

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'mentorship' | 'events' | 'profile' | 'network'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Öğrenci Bildirimleri
  const [notifications] = useState([
    { id: 1, text: 'Mustafa Kemal mentorluk isteğinizi kabul etti.', time: '1 saat önce', read: false },
    { id: 2, text: 'Kariyer Zirvesi 2024 etkinliğine kaydınız oluşturuldu.', time: '3 saat önce', read: true },
    { id: 3, text: 'Zeki Özen size bir mesaj gönderdi.', time: 'Dün', read: false },
  ]);

  // Mock Mentor Data
  const [activeMentor, setActiveMentor] = useState<any>(null);
  /*
  const [activeMentor, setActiveMentor] = useState({
    id: 1,
    name: "Mustafa Kemal",
    company: "Google",
    position: "Senior Software Engineer",
    avatar: "MK",
    department: "Bilgisayar Müh.",
    graduationYear: "2019"
  });
  */

  // Mock Requests
  const [sentRequests, setSentRequests] = useState([
    { id: 101, mentorName: "Ayşe Yılmaz", company: "Microsoft", status: "Bekliyor", date: "12.06.2024" },
    { id: 102, mentorName: "Mehmet Öz", company: "Trendyol", status: "Bekliyor", date: "10.06.2024" }
  ]);

  // Mock Connections
  const connections = [
    { id: 1, name: "Ahmet Yılmaz", role: "Product Manager", company: "Spotify", avatar: "AY", type: "alumni" },
    { id: 2, name: "Zeynep Demir", role: "Software Eng.", company: "Amazon", avatar: "ZD", type: "alumni" },
    { id: 3, name: "Caner Erkin", role: "DevOps", company: "Netflix", avatar: "CE", type: "alumni" },
    { id: 4, name: "Dr. Ayşe Kaya", role: "Doç. Dr.", department: "Bilgisayar Müh.", avatar: "AK", type: "staff" },
    { id: 5, name: "Prof. Dr. Mehmet Öz", role: "Prof. Dr.", department: "YBS", avatar: "MÖ", type: "staff" },
  ];

  // Bağlantı İstekleri State
  const [connectionRequests, setConnectionRequests] = useState([
    { id: 301, name: "Dr. Ayşe Yılmaz", type: "staff", role: "Doç. Dr.", department: "YBS Bölümü", avatar: "AY", status: "Bekliyor" },
    { id: 302, name: "Mehmet Demir", type: "alumni", role: "Senior Developer", company: "Meta", avatar: "MD", status: "Bekliyor" }
  ]);
  
  const [sentConnectionRequests, setSentConnectionRequests] = useState([
    { id: 303, name: "Prof. Dr. Ali Veli", type: "staff", role: "Prof. Dr.", department: "Endüstri Müh.", avatar: "AV", status: "Bekliyor" },
    { id: 304, name: "Elif Yılmaz", type: "alumni", role: "Data Scientist", company: "Apple", avatar: "EY", status: "Bekliyor" }
  ]);
  
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [isSentRequestsOpen, setIsSentRequestsOpen] = useState(false);
  const [connectionFilter, setConnectionFilter] = useState<'all' | 'staff' | 'alumni'>('all');
  
  // Mesajlaşma State'leri
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Record<number, any[]>>({});

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;
    
    const newMessage = {
      id: Date.now(), 
      sender: 'me', 
      text: messageInput, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setChatMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));
    
    setMessageInput("");
  };

  const handleApproveConnectionRequest = (id: number) => {
    const request = connectionRequests.find(r => r.id === id);
    if (request) {
      setConnectionRequests(prev => prev.filter(r => r.id !== id));
      toast.success(`${request.name} bağlantınıza eklendi.`);
    }
  };

  const handleRejectConnectionRequest = (id: number) => {
    const request = connectionRequests.find(r => r.id === id);
    setConnectionRequests(prev => prev.filter(r => r.id !== id));
    toast.error(`${request?.name} bağlantı isteği reddedildi.`);
  };

  const handleCancelSentRequest = (id: number) => {
    const request = sentConnectionRequests.find(r => r.id === id);
    setSentConnectionRequests(prev => prev.filter(r => r.id !== id));
    toast.info(`${request?.name} için bağlantı isteği iptal edildi.`);
  };

  // Meeting State
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(new Date());
  const [meetingTime, setMeetingTime] = useState<string>("10:00");
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);

  // Bağlantılarda Arama State
  const [connectionSearch, setConnectionSearch] = useState("");

  // Etkinlik Kayıt Durumu
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);

  const events = [
    { 
      id: 1,
      title: "Global Mezunlar Ağı Zirvesi", 
      dateDay: "15",
      dateMonth: "Haz",
      fullDate: "15 Haziran 2025 09:00",
      loc: "Merkez Kongre Salonu", 
      desc: "Dünyanın dört bir yanından gelen mezunlarımızın deneyimlerini paylaştığı, yeni iş birliklerinin temellerinin atıldığı büyük buluşma.",
      type: "Networking",
      organizer: "Prof. Dr. Rasim ÖZCAN"
    },
    { 
      id: 2,
      title: "Geleceğin Teknolojileri Paneli", 
      dateDay: "22",
      dateMonth: "May",
      fullDate: "22 Mayıs 2025 14:30",
      loc: "Teknoloji Transfer Ofisi", 
      desc: "Yapay zeka, blockchain ve sürdürülebilir enerji teknolojilerinin sektördeki öncü isimleri tarafından ele alınacağı vizyoner panel.",
      type: "Teknoloji",
      organizer: "Doç. Dr. Emre AKADAL"
    },
    { 
      id: 3,
      title: "Kariyer Gelişim ve Fırsatlar Fuarı", 
      dateDay: "10",
      dateMonth: "Eki",
      fullDate: "10 Ekim 2025 10:00",
      loc: "Ana Kampüs Fuar Alanı", 
      desc: "Sektör lideri 50'den fazla firmanın katılımıyla gerçekleşecek, staj ve iş imkanlarının sunulduğu kapsamlı kariyer etkinliği.",
      type: "Kariyer",
      organizer: "Doç. Dr. Elif KARTAL"
    },
    { 
      id: 4,
      title: "Yaratıcı Endüstriler Festivali", 
      dateDay: "05",
      dateMonth: "Nis",
      fullDate: "05 Nisan 2025 11:00",
      loc: "Sanat ve Tasarım Merkezi", 
      desc: "Tasarım, mimarlık ve sanat alanındaki mezunlarımızın en seçkin projelerinin sergilendiği, atölye çalışmalarıyla dolu festival.",
      type: "Sanat",
      organizer: "Doç. Dr. Zeki ÖZEN"
    },
    { 
      id: 5,
      title: "Liderlik ve Yönetim Semineri", 
      dateDay: "20",
      dateMonth: "Kas",
      fullDate: "20 Kasım 2025 15:00",
      loc: "İşletme Fakültesi Amfisi", 
      desc: "Kriz yönetimi ve stratejik liderlik konularında uzman yöneticilerin vaka analizleri eşliğinde sunum yapacağı sertifikalı seminer.",
      type: "İş Dünyası",
      organizer: "Doç. Dr. Gökhan ÖVENÇ"
    },
  ];

  const handleToggleEventRegistration = (eventId: number) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(prev => prev.filter(id => id !== eventId));
      toast.info("Etkinlik kaydınız iptal edildi.");
    } else {
      setRegisteredEvents(prev => [...prev, eventId]);
      toast.success("Etkinlik kaydınız başarıyla oluşturuldu.");
    }
  };

  // AI Mentorluk Sistemi State
  const [availableMentors, setAvailableMentors] = useState([
    { id: 501, name: "Ahmet Yılmaz", company: "Spotify", role: "Product Manager", department: "Bilgisayar Müh.", graduationYear: "2018", avatar: "AY", areas: ["Product Management", "Agile", "UX"] },
    { id: 502, name: "Zeynep Demir", company: "Amazon", role: "Software Eng.", department: "Bilgisayar Müh.", graduationYear: "2019", avatar: "ZD", areas: ["Backend", "AWS", "Java"] },
    { id: 503, name: "Caner Erkin", company: "Netflix", role: "DevOps", department: "Yazılım Müh.", graduationYear: "2017", avatar: "CE", areas: ["Cloud", "DevOps", "Kubernetes"] },
    { id: 504, name: "Elif Su", company: "Google", role: "Data Scientist", department: "Endüstri Müh.", graduationYear: "2020", avatar: "ES", areas: ["AI", "Python", "Big Data"] },
  ]);
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false);
  const [analyzingMentor, setAnalyzingMentor] = useState<any>(null);
  const [aiMatchScore, setAiMatchScore] = useState(0);
  const [aiAnalysisSteps, setAiAnalysisSteps] = useState<string[]>([]);
  
  const calculateCompatibility = (mentor: any) => {
    setAnalyzingMentor(mentor);
    setIsAIAnalysisOpen(true);
    setAiAnalysisSteps([]);
    setAiMatchScore(0);
    
    // Yapay Zeka Analizi Simülasyonu
    const steps = [
      "Öğrenci profili analiz ediliyor...",
      "Akademik geçmiş karşılaştırılıyor...",
      "Kariyer hedefleri eşleştiriliyor...",
      "Sektörel uyumluluk hesaplanıyor...",
      "Mentörlük geçmişi inceleniyor..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setAiAnalysisSteps(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        // Random score between 70 and 99
        const score = Math.floor(Math.random() * (99 - 70 + 1)) + 70;
        setAiMatchScore(score);
      }
    }, 800);
  };

  const sendMentorshipRequest = () => {
    if (!analyzingMentor) return;
    
    const newRequest = {
      id: Date.now(),
      mentorName: analyzingMentor.name,
      company: analyzingMentor.company,
      status: "Bekliyor",
      date: new Date().toLocaleDateString('tr-TR'),
      matchScore: aiMatchScore
    };
    
    setSentRequests(prev => [...prev, newRequest]);
    setIsAIAnalysisOpen(false);
    toast.success(`${analyzingMentor.name} kişisine mentorluk isteği gönderildi. (AI Eşleşme Skoru: %${aiMatchScore})`);
    setAnalyzingMentor(null);
  };


  const handleScheduleMeeting = () => {
    if (activeMentor && meetingDate && meetingTime) {
      const newMeeting = {
        id: Date.now(),
        mentorId: activeMentor.id,
        mentorName: activeMentor.name,
        mentorAvatar: activeMentor.avatar,
        date: meetingDate,
        time: meetingTime,
      };

      setUpcomingMeetings(prev => [...prev, newMeeting]);
      
      toast.success(`${activeMentor.name} ile ${format(meetingDate, 'd MMMM yyyy', { locale: tr })} saat ${meetingTime} için toplantı ayarlandı.`);
      setIsMeetingModalOpen(false);
    } else {
      toast.error('Lütfen tarih ve saat seçiniz.');
    }
  };

  const handleCancelRequest = (id: number) => {
    setSentRequests(prev => prev.filter(req => req.id !== id));
    toast.info('Mentorluk isteği iptal edildi.');
  };

  // Mock student data
  const studentData = {
    name: "Gül Nihal Arıkaymak",
    studentNo: "2022123001",
    department: "Yönetim Bilişim Sistemleri",
    faculty: "İktisat Fakültesi",
    lastGpa: "3.15",
    email: "ali.veli@ogrenci.istanbul.edu.tr",
    photoUrl: ""
  };

  const handleUpdateProfile = () => {
    toast.success('Profil bilgileriniz güncellendi.');
  };

  // --- Render Functions ---

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 to-slate-900/40 border border-blue-900/20 rounded-xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">Hoşgeldin, {studentData.name.split(' ')[0]}! 👋</h2>
          <p className="text-slate-400 max-w-2xl">
            Kariyer yolculuğunda sana destek olacak mentorlar ve etkinlikler seni bekliyor.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      </div>

      {/* Profile Completion Card */}
      <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
        <CardHeader className="pb-2">
           <div className="flex justify-between items-center">
             <CardTitle className="text-lg text-white">Profil Doluluk Oranı</CardTitle>
             <span className="text-blue-400 font-bold">60%</span>
           </div>
           <CardDescription className="text-slate-400">Mezunlar tarafından fark edilmek için profilini tamamla.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-2 bg-slate-800 rounded-full w-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-blue-600"
            />
          </div>
          <Button 
            variant="link" 
            className="text-blue-400 p-0 h-auto mt-4 hover:text-blue-300"
            onClick={() => setActiveTab('profile')}
          >
            Eksik bilgileri tamamla →
          </Button>
        </CardContent>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="bg-slate-900/50 border-slate-800 text-slate-100 hover:bg-slate-800/50 transition-colors cursor-pointer group"
          onClick={() => setActiveTab('mentorship')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              Mentorluk Programı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm mb-4">Sektördeki mezunlarımızdan mentorluk alarak kariyerine yön ver.</p>
            <div className="flex items-center text-orange-400 text-sm font-medium">
              Mentor Bul <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-slate-900/50 border-slate-800 text-slate-100 hover:bg-slate-800/50 transition-colors cursor-pointer group"
          onClick={() => setActiveTab('events')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Calendar className="h-5 w-5" />
              </div>
              Etkinlik Takvimi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm mb-4">Yaklaşan kariyer günleri ve seminerleri kaçırma.</p>
            <div className="flex items-center text-green-400 text-sm font-medium">
              Takvimi Gör <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registered Events Section */}
      {registeredEvents.length > 0 && (
        <Card className="bg-green-900/10 border-green-900/30 border-l-4 border-l-green-500">
          <CardHeader>
             <CardTitle className="text-lg text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-400" />
                Yaklaşan Kayıt Olduğum Etkinlikler
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {events.filter(e => registeredEvents.includes(e.id)).map(event => (
                  <div key={event.id} className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 flex gap-4 items-center">
                     <div className="bg-green-900/30 text-green-400 border border-green-900/50 rounded-lg p-2 text-center min-w-[60px]">
                        <div className="text-xs font-bold uppercase">{event.dateMonth}</div>
                        <div className="text-xl font-bold">{event.dateDay}</div>
                     </div>
                     <div className="min-w-0">
                        <h4 className="font-semibold text-white truncate">{event.title}</h4>
                        <p className="text-sm text-slate-500 truncate">{event.loc}</p>
                        <p className="text-xs text-slate-400 mt-1">{event.fullDate.split(' ').pop()}</p>
                     </div>
                  </div>
               ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connections Preview */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Bağlantılarım</h3>
          <Button variant="link" className="text-blue-400 p-0">Tümünü Gör</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {connections.map(conn => (
             <Card key={conn.id} className="bg-slate-900/50 border-slate-800 text-slate-100">
               <CardContent className="p-4 flex items-center gap-3">
                 <Avatar className="h-10 w-10 border border-slate-700">
                    <AvatarFallback className="bg-blue-900 text-blue-200">{conn.avatar}</AvatarFallback>
                 </Avatar>
                 <div>
                   <h4 className="font-bold text-white text-sm">{conn.name}</h4>
                   <p className="text-xs text-slate-400">{conn.company}</p>
                 </div>
               </CardContent>
             </Card>
           ))}
        </div>
      </div>

      {/* Map Section - Moved Here */}
      <div className="pt-4">
        <div className="-mx-4 md:-mx-8 min-h-[400px]">
          <div className="alumni-network-wrapper">
            <AlumniNetworkSection />
          </div>
        </div>
      </div>
    </div>
  );


  const renderMentorship = () => (
    <div className="space-y-8">
      {/* Active Mentor Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-400" />
          Mentorüm
        </h2>
        
        {activeMentor ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="bg-slate-900/50 border-slate-800 text-slate-100 h-full">
                <CardContent className="p-6">
                   <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
                      <Avatar className="h-20 w-20 border-2 border-slate-700">
                        <AvatarFallback className="bg-blue-900 text-blue-200">
                           <User className="h-10 w-10" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center sm:text-left">
                         <h3 className="text-xl font-bold text-white">{activeMentor.name}</h3>
                         <p className="text-blue-400 font-medium">{activeMentor.position}</p>
                         <p className="text-slate-400 text-sm mb-1">{activeMentor.company}</p>
                         <p className="text-slate-500 text-xs">{activeMentor.department} '{activeMentor.graduationYear.slice(-2)}</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="border-slate-700 hover:bg-slate-800 text-slate-300 gap-2 h-10"
                        onClick={() => setIsMeetingModalOpen(true)}
                      >
                         <Video size={16} /> Toplantı Ayarla
                      </Button>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-10"
                        onClick={() => toast.success('Mesajlaşma penceresi açılıyor...')}
                      >
                         <MessageSquare size={16} /> Mesaj Gönder
                      </Button>
                   </div>
                </CardContent>
             </Card>

             {/* Quick Actions / Tips */}
             <Card className="bg-gradient-to-br from-indigo-900/20 to-slate-900/50 border-slate-800 text-slate-100 flex flex-col justify-center">
                <CardContent className="p-6">
                   <h4 className="font-bold text-white mb-2">Mentorluk İpuçları</h4>
                   <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                      <li>Görüşmelere hazırlıklı katılın.</li>
                      <li>Kariyer hedeflerinizi netleştirin.</li>
                      <li>Sorularınızı önceden not alın.</li>
                      <li>Düzenli geri bildirim isteyin.</li>
                   </ul>
                </CardContent>
             </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700 text-slate-100">
              <CardContent className="p-6 text-center">
                 <div className="bg-slate-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-600">
                    <User className="h-8 w-8 text-blue-400" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Henüz bir mentorunuz yok</h3>
                 <p className="text-slate-400 max-w-lg mx-auto mb-6">
                   Yapay zeka destekli eşleştirme sistemimiz ile kariyer hedeflerinize en uygun mentoru bulun.
                 </p>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-lg font-bold text-white mb-4">Önerilen Mentorlar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {availableMentors.map(mentor => (
                  <Card key={mentor.id} className="bg-slate-900/50 border-slate-800 text-slate-100 hover:bg-slate-800/50 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14 border border-slate-700">
                           <AvatarFallback className="bg-blue-900/50 text-blue-200">{mentor.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-lg">{mentor.name}</h4>
                          <p className="text-blue-400 font-medium text-sm">{mentor.role}</p>
                          <p className="text-slate-400 text-sm mb-2">{mentor.company} • {mentor.graduationYear} Mezunu</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {mentor.areas.map(area => (
                              <Badge key={area} variant="secondary" className="bg-slate-800 text-slate-300 text-xs hover:bg-slate-700">{area}</Badge>
                            ))}
                          </div>
                          <Button 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                            onClick={() => calculateCompatibility(mentor)}
                          >
                            <Award size={16} /> Mentor İste (AI Eşleşme)
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Meetings Section */}
      {upcomingMeetings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-400" />
            Yaklaşan Toplantılar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMeetings.map(meeting => (
              <Card key={meeting.id} className="bg-slate-900/50 border-slate-800 text-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <Avatar className="h-10 w-10 border border-slate-700">
                          <AvatarFallback className="bg-slate-800 text-slate-300">{meeting.mentorAvatar}</AvatarFallback>
                       </Avatar>
                       <div>
                         <h4 className="font-bold text-white text-sm">{meeting.mentorName}</h4>
                         <p className="text-xs text-slate-400">Mentorluk Görüşmesi</p>
                       </div>
                    </div>
                    <Badge variant="outline" className="border-purple-900 text-purple-400 bg-purple-900/10 text-xs">Online</Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      {format(meeting.date, 'd MMMM yyyy', { locale: tr })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Clock className="w-4 h-4 text-slate-500" />
                      {meeting.time}
                    </div>
                  </div>
                  
                  <Button variant="secondary" className="w-full h-8 text-xs bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-600/20">
                    Toplantıya Katıl
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sent Requests Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          Gönderilen Mentorluk İstekleri
        </h2>
        {sentRequests.length === 0 ? (
           <div className="text-slate-400 italic">Bekleyen isteğiniz bulunmuyor.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sentRequests.map(req => (
              <Card key={req.id} className="bg-slate-900/50 border-slate-800 text-slate-100">
                <CardContent className="p-6">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white">{req.mentorName}</h3>
                      <Badge variant="outline" className="border-yellow-600/50 text-yellow-400 bg-yellow-900/10">{req.status}</Badge>
                   </div>
                   <p className="text-sm text-slate-400 mb-2">{req.company}</p>
                   {req.matchScore && (
                     <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                           <span className="text-slate-400">AI Uyumluluk</span>
                           <span className="text-green-400 font-bold">%{req.matchScore}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-green-500" style={{ width: `${req.matchScore}%` }}></div>
                        </div>
                     </div>
                   )}
                   <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-slate-500">{req.date}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8"
                        onClick={() => handleCancelRequest(req.id)}
                      >
                         <Trash2 size={14} className="mr-1" /> İptal Et
                      </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* AI Analysis Dialog */}
      <Dialog open={isAIAnalysisOpen} onOpenChange={setIsAIAnalysisOpen}>
         <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[500px]">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                     <Award className="w-6 h-6 text-indigo-400" />
                  </div>
                  Yapay Zeka Uyumluluk Analizi
               </DialogTitle>
               <DialogDescription className="text-slate-400">
                  {analyzingMentor?.name} ile profil uyumluluğunuz hesaplanıyor.
               </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
               {aiMatchScore === 0 ? (
                  <div className="space-y-4">
                     <div className="flex flex-col gap-3">
                        {aiAnalysisSteps.map((step, index) => (
                           <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-3 text-sm text-slate-300"
                           >
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              {step}
                           </motion.div>
                        ))}
                     </div>
                     <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                           className="h-full bg-indigo-500"
                           initial={{ width: "0%" }}
                           animate={{ width: "100%" }}
                           transition={{ duration: 4, ease: "linear" }}
                        />
                     </div>
                  </div>
               ) : (
                  <div className="text-center space-y-6">
                     <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-32 h-32 mx-auto rounded-full border-4 border-slate-800 flex items-center justify-center relative"
                     >
                        <svg className="w-full h-full -rotate-90 absolute">
                           <circle
                              cx="60"
                              cy="60"
                              r="56"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className="text-slate-800"
                           />
                           <motion.circle
                              cx="60"
                              cy="60"
                              r="56"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className={aiMatchScore > 85 ? "text-green-500" : aiMatchScore > 75 ? "text-yellow-500" : "text-orange-500"}
                              strokeDasharray="351.86"
                              initial={{ strokeDashoffset: 351.86 }}
                              animate={{ strokeDashoffset: 351.86 - (351.86 * aiMatchScore) / 100 }}
                              transition={{ duration: 1, ease: "easeOut" }}
                           />
                        </svg>
                        <div className="flex flex-col items-center">
                           <span className="text-3xl font-bold text-white">%{aiMatchScore}</span>
                           <span className="text-xs text-slate-400">Uyumluluk</span>
                        </div>
                     </motion.div>
                     
                     <div>
                        <h4 className="text-lg font-bold text-white mb-2">Analiz Sonucu: {aiMatchScore > 85 ? "Mükemmel Eşleşme!" : "Güçlü Eşleşme"}</h4>
                        <p className="text-sm text-slate-400">
                           {analyzingMentor?.name} ile kariyer hedefleriniz ve akademik geçmişiniz 
                           {aiMatchScore > 85 ? " büyük ölçüde örtüşüyor." : " birbirini tamamlıyor."}
                        </p>
                     </div>
                  </div>
               )}
            </div>

            <DialogFooter className="sm:justify-between">
               <Button variant="ghost" onClick={() => setIsAIAnalysisOpen(false)} className="text-slate-400">
                  Kapat
               </Button>
               {aiMatchScore > 0 && (
                  <Button onClick={sendMentorshipRequest} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                     İstek Gönder
                  </Button>
               )}
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Etkinlikler</h2>
          <p className="text-slate-400">Yaklaşan seminerler, buluşmalar ve kariyer günleri.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {events.map((event) => {
           const isRegistered = registeredEvents.includes(event.id);
           return (
            <Card key={event.id} className="bg-slate-900/50 border-slate-800 text-slate-100">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-32 md:h-auto bg-slate-800 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-700 p-4">
                    <span className="text-3xl font-bold text-blue-400">{event.dateDay}</span>
                    <span className="text-sm text-slate-400 uppercase tracking-wider">{event.dateMonth}</span>
                    <span className="text-xs text-slate-500 mt-1">{event.fullDate.split(' ').pop()}</span>
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="mb-2 bg-blue-900/30 text-blue-400 border-blue-800 hover:bg-blue-900/50">{event.type}</Badge>
                        <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                        <p className="text-slate-400 text-sm mb-4">
                          {event.desc}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.loc}</span>
                          <span className="flex items-center gap-1"><User className="w-4 h-4" /> {event.organizer}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleToggleEventRegistration(event.id)}
                        className={`shrink-0 text-white ${isRegistered ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        {isRegistered ? <><Check className="mr-2 h-4 w-4" /> Kayıtlısınız</> : "Kayıt Ol"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
           );
        })}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Profilim</h2>
          <p className="text-slate-400">Kişisel bilgilerinizi ve tercihlerinizi yönetin.</p>
        </div>
        <Button onClick={handleUpdateProfile} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Save size={16} /> Değişiklikleri Kaydet
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100 h-fit">
          <CardContent className="pt-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-32 w-32 border-4 border-slate-800 shadow-xl">
                <AvatarImage src={studentData.photoUrl} />
                <AvatarFallback className="bg-blue-900 text-blue-200">
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute bottom-0 right-0 rounded-full bg-blue-600 hover:bg-blue-700 border-4 border-slate-900">
                <Camera className="h-4 w-4 text-white" />
              </Button>
            </div>
            <h3 className="text-xl font-bold text-white">{studentData.name}</h3>
            <p className="text-slate-400 mb-4">{studentData.department}</p>
            <div className="flex justify-center gap-2 mb-6">
              <Badge variant="outline" className="border-slate-700 text-slate-300">Öğrenci</Badge>
              <Badge variant="outline" className="border-blue-900/50 text-blue-400 bg-blue-900/10">2. Sınıf</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Form Fields */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-white">Öğrenci Bilgileri</CardTitle>
            <CardDescription className="text-slate-400">
              Bu bilgiler öğrenci işleri sisteminden otomatik olarak çekilmektedir.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Öğrenci Numarası</Label>
                <Input value={studentData.studentNo} disabled className="bg-slate-950/50 border-slate-800 text-slate-400" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">E-posta</Label>
                <Input value={studentData.email} disabled className="bg-slate-950/50 border-slate-800 text-slate-400" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Fakülte</Label>
                <Input value={studentData.faculty} disabled className="bg-slate-950/50 border-slate-800 text-slate-400" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Bölüm</Label>
                <Input value={studentData.department} disabled className="bg-slate-950/50 border-slate-800 text-slate-400" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Genel Not Ortalaması (AGNO)</Label>
                <Input value={studentData.lastGpa} disabled className="bg-slate-950/50 border-slate-800 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div className="space-y-6">
      {/* Bağlantı İstekleri - Collapsible */}
      {connectionRequests.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
            onClick={() => setIsRequestsOpen(!isRequestsOpen)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                  {connectionRequests.length}
                </span>
              </div>
              <span className="font-semibold text-white">Bağlantı İstekleri</span>
            </div>
            <motion.div
              animate={{ rotate: isRequestsOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
          
          {isRequestsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3 border-t border-slate-800 pt-4">
                {connectionRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10 border border-slate-700 shrink-0">
                        <AvatarFallback className={`text-sm ${request.type === 'staff' ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'}`}>
                          {request.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm truncate">{request.name}</h4>
                          <Badge variant="outline" className={`shrink-0 text-xs ${request.type === 'staff' ? 'border-purple-900/50 text-purple-400' : 'border-blue-900/50 text-blue-400'}`}>
                            {request.type === 'staff' ? 'Akademisyen' : 'Mezun'}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {request.type === 'staff' ? `${request.role} • ${request.department}` : `${request.role} • ${request.company}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-3">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-8 px-3 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => handleRejectConnectionRequest(request.id)}
                      >
                        Reddet
                      </Button>
                      <Button 
                        size="sm"
                        className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApproveConnectionRequest(request.id)}
                      >
                        Onayla
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </Card>
      )}

      {/* Gönderilen Bağlantı İstekleri - Collapsible */}
      {sentConnectionRequests.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
            onClick={() => setIsSentRequestsOpen(!isSentRequestsOpen)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                  {sentConnectionRequests.length}
                </span>
              </div>
              <span className="font-semibold text-white">Gönderilen Bağlantı İstekleri</span>
            </div>
            <motion.div
              animate={{ rotate: isSentRequestsOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
          
          {isSentRequestsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3 border-t border-slate-800 pt-4">
                {sentConnectionRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10 border border-slate-700 shrink-0">
                        <AvatarFallback className={`text-sm ${request.type === 'staff' ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'}`}>
                          {request.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm truncate">{request.name}</h4>
                          <Badge variant="outline" className={`shrink-0 text-xs ${request.type === 'staff' ? 'border-purple-900/50 text-purple-400' : 'border-blue-900/50 text-blue-400'}`}>
                            {request.type === 'staff' ? 'Akademisyen' : 'Mezun'}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {request.type === 'staff' ? `${request.role} • ${request.department}` : `${request.role} • ${request.company}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-3">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-8 px-3 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => handleCancelSentRequest(request.id)}
                      >
                        İptal Et
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </Card>
      )}

      <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5 text-indigo-500" />
            Tüm Bağlantılarım ({connections.filter(c => connectionFilter === 'all' || c.type === connectionFilter).length})
          </CardTitle>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <Input 
              placeholder="Bağlantılarda ara..." 
              className="h-9 flex-1 sm:w-[200px] bg-slate-950 border-slate-800" 
              value={connectionSearch}
              onChange={(e) => setConnectionSearch(e.target.value)}
            />
            <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setConnectionFilter('all')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${connectionFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Tümü
              </button>
              <button
                onClick={() => setConnectionFilter('staff')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${connectionFilter === 'staff' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Akademisyen
              </button>
              <button
                onClick={() => setConnectionFilter('alumni')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${connectionFilter === 'alumni' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Mezunlar
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections
              .filter(c => connectionFilter === 'all' || c.type === connectionFilter)
              .filter(conn => 
                conn.name.toLowerCase().includes(connectionSearch.toLowerCase()) ||
                (conn.company && conn.company.toLowerCase().includes(connectionSearch.toLowerCase())) ||
                conn.role.toLowerCase().includes(connectionSearch.toLowerCase())
              )
              .map((conn) => (
                <motion.div 
                  key={conn.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 flex flex-col items-center text-center hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="relative mb-3">
                    <Avatar className="h-16 w-16 border-2 border-slate-700">
                      <AvatarFallback className="bg-slate-700 text-slate-300">{conn.avatar}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 ${conn.id % 3 === 0 ? 'bg-green-500' : conn.id % 3 === 1 ? 'bg-yellow-500' : 'bg-slate-500'}`}></div>
                  </div>
                  <h3 className="font-bold text-white text-base truncate w-full">{conn.name}</h3>
                  <p className="text-sm text-slate-400 mb-1">{conn.role}</p>
                  <p className="text-xs text-slate-500 mb-4">{conn.company}</p>
                  <div className="flex gap-2 w-full">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border border-blue-600/30"
                      onClick={() => {
                        setSelectedContact(conn);
                        setMessageDialogOpen(true);
                      }}
                    >
                      <MessageSquare className="mr-2 h-3 w-3" /> Mesaj
                    </Button>
                    <Button size="sm" variant="ghost" className="px-2 text-slate-400 hover:text-white">
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Mesajlaşma Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-slate-700">
                <AvatarFallback className="bg-blue-900 text-blue-200">
                  {selectedContact?.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold">{selectedContact?.name}</div>
                <div className="text-xs text-slate-400 font-normal">{selectedContact?.role}</div>
              </div>
            </DialogTitle>
            <DialogDescription className="sr-only">
              {selectedContact?.name} ile mesajlaşma penceresi
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {(chatMessages[selectedContact?.id] || []).map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender === 'me' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-100'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 pt-4 border-t border-slate-800">
            <Input 
              placeholder="Mesajınızı yazın..." 
              className="flex-1 bg-slate-950/50 border-slate-700 text-white"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSendMessage}
            >
              Gönder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
            Öğrenci
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
            <Home className="mr-2 h-5 w-5" />
            Genel Bakış
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-left ${activeTab === 'mentorship' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => {
              setActiveTab('mentorship');
              setIsMobileMenuOpen(false);
            }}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Mentorluk
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
            Etkinlikler
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-left ${activeTab === 'network' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => {
              setActiveTab('network');
              setIsMobileMenuOpen(false);
            }}
          >
            <Users className="mr-2 h-5 w-5" />
            Bağlantılarım
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-left ${activeTab === 'profile' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => {
              setActiveTab('profile');
              setIsMobileMenuOpen(false);
            }}
          >
            <User className="mr-2 h-5 w-5" />
            Profilim
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
                {activeTab === 'overview' && 'Öğrenci Paneli'}
                {activeTab === 'mentorship' && 'Mentorluk Programı'}
                {activeTab === 'events' && 'Etkinlik Takvimi'}
                {activeTab === 'network' && 'Bağlantılarım ve Ağım'}
                {activeTab === 'profile' && 'Profil Ayarları'}
              </h1>
              <p className="text-slate-400 text-xs md:text-sm hidden sm:block">Akademik ve kariyer süreçlerinizi yönetin.</p>
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
                  <h4 className="font-semibold text-white">Bildirimler</h4>
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
               <p className="text-sm font-medium text-white">{studentData.name}</p>
               <p className="text-xs text-slate-500">Öğrenci</p>
             </div>
             <Avatar className="border-2 border-slate-700 h-8 w-8 md:h-10 md:w-10">
               <AvatarImage src={studentData.photoUrl} />
               <AvatarFallback className="bg-blue-600 text-white">
                 {studentData.name.split(' ').map(n => n[0]).join('')}
               </AvatarFallback>
             </Avatar>
          </div>
        </header>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'mentorship' && renderMentorship()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'network' && renderNetwork()}

        {/* Meeting Modal */}
        <Dialog open={isMeetingModalOpen} onOpenChange={setIsMeetingModalOpen}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Toplantı Ayarla</DialogTitle>
              <DialogDescription className="text-slate-400">
                Mentorunuz {activeMentor?.name} ile bir online görüşme planlayın.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="text-slate-300">Tarih</Label>
                <div className="border border-slate-800 rounded-md p-2 bg-slate-950/50 flex justify-center">
                  <CalendarComponent
                    mode="single"
                    selected={meetingDate}
                    onSelect={setMeetingDate}
                    className="rounded-md border-0"
                    classNames={{
                      head_cell: "text-slate-400 font-normal text-[0.8rem]",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-800 rounded-md text-slate-100",
                      day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                      day_today: "bg-slate-800 text-slate-100",
                      day_outside: "text-slate-600 opacity-50",
                      day_disabled: "text-slate-600 opacity-50",
                      day_hidden: "invisible",
                      nav_button: "border border-slate-700 hover:bg-slate-800 text-slate-300",
                      caption: "text-slate-100 font-medium"
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="time" className="text-slate-300">Saat</Label>
                <Select value={meetingTime} onValueChange={setMeetingTime}>
                  <SelectTrigger className="bg-slate-950/50 border-slate-800 text-slate-100">
                    <SelectValue placeholder="Saat seçiniz" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                    {Array.from({ length: 13 }).map((_, i) => {
                      const hour = i + 9; // 09:00 - 21:00 arası
                      const timeString = `${hour < 10 ? '0' + hour : hour}:00`;
                      const timeStringHalf = `${hour < 10 ? '0' + hour : hour}:30`;
                      return (
                        <React.Fragment key={hour}>
                          <SelectItem value={timeString} className="focus:bg-slate-800 focus:text-white">{timeString}</SelectItem>
                          {hour !== 21 && <SelectItem value={timeStringHalf} className="focus:bg-slate-800 focus:text-white">{timeStringHalf}</SelectItem>}
                        </React.Fragment>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMeetingModalOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">İptal</Button>
              <Button onClick={handleScheduleMeeting} className="bg-blue-600 hover:bg-blue-700 text-white">Toplantıyı Kaydet</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}