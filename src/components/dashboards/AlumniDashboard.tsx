import React, { useState } from 'react';
import { AlumniNetworkSection } from '../AlumniNetworkSection';
import { 
  Bell, 
  Search, 
  Briefcase, 
  Calendar, 
  Users, 
  Award, 
  ExternalLink, 
  MessageSquare, 
  LogOut, 
  Settings, 
  User, 
  Camera,
  Menu,
  X,
  Home,
  Save,
  MapPin,
  Filter,
  GraduationCap,
  BookOpen,
  Check,
  Trash2,
  Video,
  Clock
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
import emreAkadalImg from 'figma:asset/2a36d251e73a74061ea34c56390e5e898a0206b4.png';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface AlumniDashboardProps {
  onLogout?: () => void;
}

export function AlumniDashboard({ onLogout }: AlumniDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'connections' | 'events' | 'profile' | 'mentorship'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [connectionFilter, setConnectionFilter] = useState<'all' | 'student' | 'alumni'>('all');

  // Mezun Bildirimleri
  const [notifications] = useState([
    { id: 1, text: 'Ali Veli size bağlantı isteği gönderdi.', time: '10 dk önce', read: false },
    { id: 2, text: 'Mezunlar Buluşması 2024 etkinliği yaklaşıyor.', time: '2 saat önce', read: true },
    { id: 3, text: 'Profil bilgilerinizi güncellemeniz öneriliyor.', time: '1 gün önce', read: true },
    { id: 4, text: 'Ayşe Yılmaz yeni bir iş ilanı paylaştı: Senior Frontend Dev.', time: 'Dün', read: false },
  ]);

  // Mock Mentorship Data
  const [mentorshipRequests, setMentorshipRequests] = useState([
    { id: 1, name: "Ali Veli", department: "Bilgisayar Müh.", year: "3. Sınıf", message: "Sizin kariyer yolunuzu takip etmek istiyorum.", avatar: "AV" },
    { id: 2, name: "Ayşe Yılmaz", department: "Endüstri Müh.", year: "4. Sınıf", message: "Staj konusunda tavsiyelerinize ihtiyacım var.", avatar: "AY" }
  ]);

  const [activeMentees, setActiveMentees] = useState([
    { id: 3, name: "Zeynep Kaya", department: "Yazılım Müh.", year: "2. Sınıf", avatar: "ZK" }
  ]);
  
  // Mentorluk Durumu
  const [isMentorAvailable, setIsMentorAvailable] = useState(true);
  
  // Meeting State
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedMenteeForMeeting, setSelectedMenteeForMeeting] = useState<any>(null);
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(new Date());
  const [meetingTime, setMeetingTime] = useState<string>("10:00");
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);

  // Bağlantı İstekleri State
  const [connectionRequests, setConnectionRequests] = useState([
    { id: 201, name: "Burcu Yıldız", type: "student", role: "Bilgisayar Müh.", year: "2. Sınıf", avatar: "BY", status: "Bekliyor" },
    { id: 202, name: "Emre Kara", type: "alumni", role: "Data Scientist", company: "Apple", year: "2021", avatar: "EK", status: "Bekliyor" }
  ]);
  
  const [sentConnectionRequests, setSentConnectionRequests] = useState([
    { id: 203, name: "Dr. Mehmet Öz", type: "staff", role: "Prof. Dr.", department: "Bilgisayar Müh.", avatar: "MÖ", status: "Bekliyor" },
    { id: 204, name: "Elif Demir", type: "alumni", role: "UX Designer", company: "Microsoft", avatar: "ED", status: "Bekliyor" }
  ]);
  
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [isSentRequestsOpen, setIsSentRequestsOpen] = useState(false);
  const [connectionSearch, setConnectionSearch] = useState("");
  
  // Mesajlaşma State'leri
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Record<number, any[]>>({});
  
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

  const handleOpenMeetingModal = (mentee: any) => {
    setSelectedMenteeForMeeting(mentee);
    setIsMeetingModalOpen(true);
  };

  const handleScheduleMeeting = () => {
    if (selectedMenteeForMeeting && meetingDate && meetingTime) {
      const newMeeting = {
        id: Date.now(),
        menteeId: selectedMenteeForMeeting.id,
        menteeName: selectedMenteeForMeeting.name,
        menteeAvatar: selectedMenteeForMeeting.avatar,
        date: meetingDate,
        time: meetingTime,
      };

      setUpcomingMeetings(prev => [...prev, newMeeting]);
      
      toast.success(`${selectedMenteeForMeeting.name} ile ${format(meetingDate, 'd MMMM yyyy', { locale: tr })} saat ${meetingTime} için toplantı ayarlandı.`);
      setIsMeetingModalOpen(false);
    } else {
      toast.error('Lütfen tarih ve saat seçiniz.');
    }
  };

  const handleApproveRequest = (id: number) => {
    const request = mentorshipRequests.find(r => r.id === id);
    if (request) {
      setMentorshipRequests(prev => prev.filter(r => r.id !== id));
      setActiveMentees(prev => [...prev, { ...request }]);
      toast.success(`${request.name} mentileriniz arasına eklendi.`);
    }
  };

  const handleRejectRequest = (id: number) => {
    setMentorshipRequests(prev => prev.filter(r => r.id !== id));
    toast.error('Mentorluk isteği reddedildi.');
  };


  // Mock alumni data
  const [alumniData, setAlumniData] = useState({
    name: "Doç. Dr. Emre AKADAL",
    studentNo: "2006112233",
    graduationYear: "2010",
    gpa: "3.85",
    company: "İstanbul Üniversitesi",
    position: "Doç. Dr. / Bölüm Başkan Yardımcısı",
    email: "emre.akadal@istanbul.edu.tr",
    photoUrl: emreAkadalImg
  });

  // Mock Connections Data
  const connections = [
    { id: 1, name: "Ahmet Yılmaz", type: "alumni", role: "Product Manager", company: "Spotify", year: "2018", avatar: "AY" },
    { id: 2, name: "Zeynep Demir", type: "student", role: "Bilgisayar Müh.", year: "4. Sınıf", avatar: "ZD" },
    { id: 3, name: "Mehmet Öz", type: "alumni", role: "Frontend Dev", company: "Trendyol", year: "2020", avatar: "MÖ" },
    { id: 4, name: "Ayşe Kaya", type: "student", role: "Endüstri Müh.", year: "3. Sınıf", avatar: "AK" },
    { id: 5, name: "Caner Erkin", type: "alumni", role: "DevOps Engineer", company: "Amazon", year: "2017", avatar: "CE" },
    { id: 6, name: "Elif Su", type: "student", role: "YBS", year: "2. Sınıf", avatar: "ES" },
  ];

  const handleUpdateProfile = () => {
    toast.success('Profil bilgileriniz güncellendi.');
  };

  const handleSaveCareer = () => {
    toast.success('Kariyer bilgileri kaydedildi.');
  };

  const handleBecomeMentor = () => {
    setActiveTab('mentorship');
    setIsMentorAvailable(true);
    toast.success("Mentorluk programına başvurunuz alındı ve profiliniz öğrencilere görünür hale getirildi.");
  };

  // --- Render Functions ---

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 to-slate-900/40 border border-purple-900/20 rounded-xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">Hoşgeldin, {alumniData.name.split(' ')[2]} Hocam!</h2>
          <p className="text-slate-400 max-w-2xl">
            İstanbul Üniversitesi Ailesinin değerli bir üyesi olarak aramızdasın.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-900/30 text-blue-400 rounded-lg border border-blue-900/50">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Bağlantılarım</p>
              <p className="text-2xl font-bold text-white">450+</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-900/30 text-green-400 rounded-lg border border-green-900/50">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Akademik Kariyer</p>
              <p className="text-2xl font-bold text-white">12+ Yıl</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-900/30 text-purple-400 rounded-lg border border-purple-900/50">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Etkinlikler</p>
              <p className="text-2xl font-bold text-white">4</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-900/30 text-orange-400 rounded-lg border border-orange-900/50">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Mesajlar</p>
              <p className="text-2xl font-bold text-white">12</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Events Preview */}
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100 h-full">
          <CardHeader>
            <CardTitle className="text-lg text-white">Yaklaşan Etkinlikler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.slice(0, 2).map(event => (
              <div key={event.id} className="flex gap-4 items-start pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                <div className="bg-blue-900/30 text-blue-400 border border-blue-900/50 rounded-lg p-2 text-center min-w-[60px]">
                  <div className="text-xs font-bold uppercase">{event.dateMonth}</div>
                  <div className="text-xl font-bold">{event.dateDay}</div>
                </div>
                <div>
                  <h4 className="font-semibold text-white">{event.title}</h4>
                  <p className="text-sm text-slate-500">{event.loc} • {event.fullDate.split(' ').pop()}</p>
                  <Button 
                    variant="link" 
                    className={`px-0 h-auto ${registeredEvents.includes(event.id) ? 'text-green-400 hover:text-green-300' : 'text-blue-400 hover:text-blue-300'}`}
                    onClick={() => handleToggleEventRegistration(event.id)}
                  >
                    {registeredEvents.includes(event.id) ? "Kayıtlısınız" : "Kayıt Ol"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mentorship CTA */}
        <Card className="bg-gradient-to-br from-indigo-950 to-slate-950 text-white border-slate-800 h-full flex flex-col justify-center">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
               <div className="p-4 bg-white/10 rounded-full border border-white/10">
                 <Award className="h-10 w-10 text-yellow-400" />
               </div>
            </div>
            <h3 className="text-2xl font-bold mb-3">Mentor Olmak İster misin?</h3>
            <p className="text-indigo-200 mb-8 max-w-md mx-auto">
              Yeni mezunlara veya öğrencilere deneyimlerini aktararak kariyer yolculuklarında destek ol.
            </p>
            <Button 
              className="w-full max-w-xs bg-white text-indigo-950 hover:bg-indigo-50 font-semibold py-6 text-lg"
              onClick={handleBecomeMentor}
            >
              Mentorluk Başvurusu
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Map Section - Moved to Bottom of Overview */}
      <div className="space-y-4 pt-4">
        <div className="-mx-4 md:-mx-8 min-h-[400px]">
          <div className="alumni-network-wrapper">
            <AlumniNetworkSection />
          </div>
        </div>
      </div>
    </div>
  );

  const renderConnections = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Bağlantılarım</h2>
        <p className="text-slate-400">Ağındaki öğrenci ve mezunları yönet.</p>
      </div>

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
          
          <AnimatePresence>
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
                          <AvatarFallback className={`text-sm ${request.type === 'alumni' ? 'bg-blue-900 text-blue-200' : 'bg-green-900 text-green-200'}`}>
                            {request.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white text-sm truncate">{request.name}</h4>
                            <Badge variant="outline" className={`shrink-0 text-xs ${request.type === 'alumni' ? 'border-blue-900/50 text-blue-400' : 'border-green-900/50 text-green-400'}`}>
                              {request.type === 'alumni' ? 'Mezun' : 'Öğrenci'}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 truncate">
                            {request.type === 'alumni' ? `${request.role} • ${request.company}` : `${request.role} • ${request.year}`}
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
          </AnimatePresence>
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
          
          <AnimatePresence>
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
          </AnimatePresence>
        </Card>
      )}

      {/* Filtre ve Arama */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
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
                onClick={() => setConnectionFilter('alumni')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${connectionFilter === 'alumni' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Mezunlar
              </button>
              <button
                onClick={() => setConnectionFilter('student')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${connectionFilter === 'student' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Öğrenciler
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections
              .filter(c => connectionFilter === 'all' || c.type === connectionFilter)
              .filter(c => 
                c.name.toLowerCase().includes(connectionSearch.toLowerCase()) ||
                (c.type === 'alumni' && (c.role.toLowerCase().includes(connectionSearch.toLowerCase()) || c.company.toLowerCase().includes(connectionSearch.toLowerCase()))) ||
                (c.type === 'student' && c.role.toLowerCase().includes(connectionSearch.toLowerCase()))
              )
              .map((connection) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 flex flex-col items-center text-center hover:bg-slate-800/50 transition-colors group"
              >
                <div className="relative mb-3">
                  <Avatar className="h-16 w-16 border-2 border-slate-700">
                    <AvatarFallback className={`${connection.type === 'alumni' ? 'bg-blue-900 text-blue-200' : 'bg-green-900 text-green-200'}`}>
                      {connection.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 ${connection.id % 3 === 0 ? 'bg-green-500' : connection.id % 3 === 1 ? 'bg-yellow-500' : 'bg-slate-500'}`}></div>
                </div>
                
                <Badge variant="outline" className={`mb-2 text-xs ${connection.type === 'alumni' ? 'border-blue-900 text-blue-400 bg-blue-900/20' : 'border-green-900 text-green-400 bg-green-900/20'}`}>
                  {connection.type === 'alumni' ? 'Mezun' : 'Öğrenci'}
                </Badge>
                
                <h3 className="font-bold text-white text-base truncate w-full">{connection.name}</h3>
                <p className="text-sm text-slate-400 mb-1 truncate w-full">{connection.role}</p>
                <p className="text-xs text-slate-500 mb-4 truncate w-full">
                  {connection.type === 'alumni' ? connection.company : connection.year}
                </p>
                
                <div className="flex gap-2 w-full">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border border-blue-600/30"
                    onClick={() => {
                      setSelectedContact(connection);
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

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Tüm Etkinlikler</h2>
          <p className="text-slate-400">Üniversite ve mezunlar derneği etkinlikleri.</p>
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
                    <span className="text-3xl font-bold text-purple-400">{event.dateDay}</span>
                    <span className="text-sm text-slate-400 uppercase tracking-wider">{event.dateMonth}</span>
                    <span className="text-xs text-slate-500 mt-1">{event.fullDate.split(' ').pop()}</span>
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="mb-2 bg-purple-900/30 text-purple-400 border-purple-800 hover:bg-purple-900/50">{event.type}</Badge>
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
                        className={`shrink-0 text-white ${isRegistered ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}`}
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

  const renderMentorship = () => (
    <div className="space-y-8">
      {/* Mentorship Settings Card */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
         <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
               <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Award className="text-yellow-400" /> 
                  Mentorluk Programı
               </h2>
               <p className="text-slate-400 text-sm">
                  {isMentorAvailable 
                     ? "Şu anda mentorluk programına dahilsiniz ve öğrencilerden istek alabilirsiniz." 
                     : "Mentorluk programı duraklatıldı. Öğrenciler sizi mentor olarak göremeyecek."}
               </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
               <span className={`text-sm font-bold ${isMentorAvailable ? "text-green-400" : "text-slate-500"}`}>
                  {isMentorAvailable ? "Mentorluk Aktif" : "Mentorluk Kapalı"}
               </span>
               <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isMentorAvailable ? "bg-green-600" : "bg-slate-600"}`}
                  onClick={() => {
                     setIsMentorAvailable(!isMentorAvailable);
                     toast.success(isMentorAvailable ? "Mentorluk durumu pasif yapıldı." : "Mentorluk durumu aktif edildi.");
                  }}
               >
                  <motion.div 
                     className="w-4 h-4 bg-white rounded-full shadow-md"
                     animate={{ x: isMentorAvailable ? 24 : 0 }}
                  />
               </div>
            </div>
         </CardContent>
      </Card>

      {/* Active Mentees Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          Mentilerim
        </h2>
        {activeMentees.length === 0 ? (
           <div className="text-slate-400 italic">Henüz bir mentiniz bulunmuyor.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeMentees.map(mentee => (
              <Card key={mentee.id} className="bg-slate-900/50 border-slate-800 text-slate-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12 border-2 border-green-900">
                      <AvatarFallback className="bg-green-900 text-green-200">{mentee.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-white">{mentee.name}</h3>
                      <p className="text-sm text-slate-400">{mentee.department}</p>
                      <p className="text-xs text-slate-500">{mentee.year}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-slate-700 hover:bg-slate-800 text-slate-300 gap-2"
                      onClick={() => handleOpenMeetingModal(mentee)}
                    >
                      <Video size={16} /> Toplantı Ayarla
                    </Button>
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                      onClick={() => toast.success('Mesajlaşma penceresi açılıyor...')}
                    >
                      <MessageSquare size={16} /> Mesaj
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                          <AvatarFallback className="bg-slate-800 text-slate-300">{meeting.menteeAvatar}</AvatarFallback>
                       </Avatar>
                       <div>
                         <h4 className="font-bold text-white text-sm">{meeting.menteeName}</h4>
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

      {/* Requests Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-400" />
          Mentorluk İstekleri
        </h2>
        {mentorshipRequests.length === 0 ? (
           <div className="text-slate-400 italic">Bekleyen mentorluk isteği yok.</div>
        ) : (
          <div className="space-y-4">
            {mentorshipRequests.map(request => (
              <Card key={request.id} className="bg-slate-900/50 border-slate-800 text-slate-100">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                   <Avatar className="h-16 w-16 border-2 border-slate-700">
                      <AvatarFallback className="bg-slate-800 text-slate-300 text-lg">{request.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                         <h3 className="text-lg font-bold text-white">{request.name}</h3>
                         <Badge variant="outline" className="border-purple-500/30 text-purple-400">Yeni İstek</Badge>
                      </div>
                      <p className="text-sm text-slate-300 mb-1">{request.department} • {request.year}</p>
                      <p className="text-sm text-slate-400 italic">"{request.message}"</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <Button 
                        variant="ghost" 
                        className="flex-1 md:flex-none text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        <Trash2 size={20} />
                      </Button>
                      <Button 
                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white gap-2"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        <Check size={18} /> Onayla
                      </Button>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Profilim</h2>
          <p className="text-slate-400">Kişisel bilgilerinizi ve kariyer durumunuzu yönetin.</p>
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
                <AvatarImage src={alumniData.photoUrl} />
                <AvatarFallback className="bg-blue-900 text-blue-200">
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute bottom-0 right-0 rounded-full bg-blue-600 hover:bg-blue-700 border-4 border-slate-900">
                <Camera className="h-4 w-4 text-white" />
              </Button>
            </div>
            <h3 className="text-xl font-bold text-white">{alumniData.name}</h3>
            <p className="text-slate-400 mb-1">{alumniData.position}</p>
            <p className="text-slate-500 text-sm mb-4">{alumniData.company}</p>
            <div className="flex justify-center gap-2 mb-6">
              <Badge variant="outline" className="border-slate-700 text-slate-300">Mezun</Badge>
              <Badge variant="outline" className="border-purple-900/50 text-purple-400 bg-purple-900/10">{alumniData.graduationYear}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Form Fields */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-white">Mezun Bilgileri</CardTitle>
            <CardDescription className="text-slate-400">
              Akademik bilgileriniz sabit olup, kariyer bilgilerinizi güncelleyebilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Öğrenci Numarası</Label>
                <Input value={alumniData.studentNo} disabled className="bg-slate-950/50 border-slate-800 text-slate-400" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">E-posta</Label>
                <Input value={alumniData.email} disabled className="bg-slate-950/50 border-slate-800 text-slate-400" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Mezuniyet Yılı</Label>
                <Input value={alumniData.graduationYear} disabled className="bg-slate-950/50 border-slate-800 text-slate-400" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Diploma Notu (AGNO)</Label>
                <Input value={alumniData.gpa} disabled className="bg-slate-950/50 border-slate-800 text-slate-400" />
              </div>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0f111a] px-2 text-slate-500">Kariyer Bilgileri (Düzenlenebilir)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label className="text-blue-400 font-medium">Kurum / Şirket</Label>
                <Input 
                  value={alumniData.company} 
                  onChange={(e) => setAlumniData({...alumniData, company: e.target.value})}
                  className="bg-slate-950/50 border-slate-700 text-white focus:border-blue-500" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-blue-400 font-medium">Pozisyon</Label>
                <Input 
                  value={alumniData.position} 
                  onChange={(e) => setAlumniData({...alumniData, position: e.target.value})}
                  className="bg-slate-950/50 border-slate-700 text-white focus:border-blue-500" 
                />
              </div>
            </div>
            
            <div className="flex justify-end">
               <Button onClick={handleSaveCareer} variant="outline" className="border-green-900/50 text-green-400 hover:bg-green-900/20 hover:text-green-300">
                  Sadece Kariyer Bilgilerini Kaydet
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Akademik ve İdari Görevler */}
      <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <div className="bg-purple-600/20 p-2 rounded-full text-purple-400">
                      <Briefcase className="h-5 w-5" />
                  </div>
                  Akademik ve İdari Görevler
              </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
              <div>
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Akademik Ünvanlar / Görevler</h3>
                  <div className="space-y-4">
                      <div>
                          <div className="flex justify-between items-start">
                              <h4 className="font-bold text-white">Doç. Dr.</h4>
                              <Badge variant="secondary" className="bg-green-900/20 text-green-400 border border-green-900/50">2021 - Devam Ediyor</Badge>
                          </div>
                          <p className="text-slate-400 text-sm">İstanbul Üniversitesi, İktisat Fakültesi, Yönetim Bilişim Sistemleri Bölümü</p>
                      </div>
                      <div>
                          <div className="flex justify-between items-start">
                              <h4 className="font-bold text-white">Araştırma Görevlisi</h4>
                              <Badge variant="secondary" className="bg-slate-800 text-slate-400">2012 - 2021</Badge>
                          </div>
                          <p className="text-slate-400 text-sm">İstanbul Üniversitesi, Rektörlük, Bölümler</p>
                      </div>
                  </div>
              </div>

              <div>
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Yönetimsel Görevler</h3>
                  <div className="space-y-4">
                      <div>
                          <div className="flex justify-between items-start">
                              <h4 className="font-bold text-white">Uygulama ve Araştırma Merkezi Yönetim Kurulu Üyesi</h4>
                              <Badge variant="secondary" className="bg-green-900/20 text-green-400 border border-green-900/50">2023 - Devam Ediyor</Badge>
                          </div>
                          <p className="text-slate-400 text-sm">İstanbul Üniversitesi</p>
                      </div>
                      <div>
                          <div className="flex justify-between items-start">
                              <h4 className="font-bold text-white">Bölüm Başkan Yardımcısı</h4>
                              <Badge variant="secondary" className="bg-green-900/20 text-green-400 border border-green-900/50">2022 - Devam Ediyor</Badge>
                          </div>
                          <p className="text-slate-400 text-sm">İstanbul Üniversitesi, İktisat Fakültesi, Yönetim Bilişim Sistemleri Bölümü</p>
                      </div>
                  </div>
              </div>
          </CardContent>
      </Card>

      {/* Eğitim Bilgileri */}
      <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <div className="bg-blue-600/20 p-2 rounded-full text-blue-400">
                      <User className="h-5 w-5" />
                  </div>
                  Eğitim Bilgileri
              </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 relative before:absolute before:left-9 before:top-12 before:h-[calc(100%-6rem)] before:w-px before:bg-slate-800">
              <div className="relative pl-12">
                  <div className="absolute left-7 top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-900"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-lg font-bold text-white">Lisans</h3>
                      <Badge variant="secondary" className="w-fit bg-slate-800 text-slate-300">2017 - 2021</Badge>
                  </div>
                  <p className="text-slate-400">Anadolu Üniversitesi, Açıköğretim Fakültesi, Yönetim Bilişim Sistemleri Bölümü, Türkiye</p>
              </div>

               <div className="relative pl-12">
                  <div className="absolute left-7 top-1 w-4 h-4 rounded-full bg-slate-600 border-4 border-slate-900"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-lg font-bold text-white">Doktora</h3>
                      <Badge variant="secondary" className="w-fit bg-slate-800 text-slate-300">2013 - 2017</Badge>
                  </div>
                  <p className="text-slate-400">İstanbul Üniversitesi, Fen Bilimleri Enstitüsü, Enformatik Doktora Programı, Türkiye</p>
              </div>

              <div className="relative pl-12">
                  <div className="absolute left-7 top-1 w-4 h-4 rounded-full bg-slate-600 border-4 border-slate-900"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-lg font-bold text-white">Yüksek Lisans</h3>
                      <Badge variant="secondary" className="w-fit bg-slate-800 text-slate-300">2010 - 2013</Badge>
                  </div>
                  <p className="text-slate-400">İstanbul Üniversitesi, Fen Bilimleri Enstitüsü, Enformatik Yüksek Lisans Programı, Türkiye</p>
              </div>

              <div className="relative pl-12">
                  <div className="absolute left-7 top-1 w-4 h-4 rounded-full bg-slate-600 border-4 border-slate-900"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-lg font-bold text-white">Lisans</h3>
                      <Badge variant="secondary" className="w-fit bg-slate-800 text-slate-300">2006 - 2010</Badge>
                  </div>
                  <p className="text-slate-400">İstanbul Üniversitesi, Fen Fakültesi, Fizik, Türkiye</p>
              </div>
          </CardContent>
      </Card>
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
            Mezun
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
            className={`w-full justify-start text-left ${activeTab === 'connections' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => {
              setActiveTab('connections');
              setIsMobileMenuOpen(false);
            }}
          >
            <Users className="mr-2 h-5 w-5" />
            Bağlantılarım
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
                {activeTab === 'overview' && 'Mezun Paneli'}
                {activeTab === 'connections' && 'Bağlantılarım'}
                {activeTab === 'events' && 'Etkinlikler'}
                {activeTab === 'mentorship' && 'Mentorluk Merkezi'}
                {activeTab === 'profile' && 'Profil Ayarları'}
              </h1>
              <p className="text-slate-400 text-xs md:text-sm hidden sm:block">Kariyer ağınızı ve kişisel bilgilerinizi yönetin.</p>
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
               <p className="text-sm font-medium text-white">{alumniData.name}</p>
               <p className="text-xs text-slate-500">Mezun</p>
             </div>
             <Avatar className="border-2 border-slate-700 h-8 w-8 md:h-10 md:w-10">
               <AvatarImage src={alumniData.photoUrl} />
               <AvatarFallback className="bg-blue-600 text-white">MK</AvatarFallback>
             </Avatar>
          </div>
        </header>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'connections' && renderConnections()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'mentorship' && renderMentorship()}
        {activeTab === 'profile' && renderProfile()}

        {/* Meeting Modal */}
        <Dialog open={isMeetingModalOpen} onOpenChange={setIsMeetingModalOpen}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Toplantı Ayarla</DialogTitle>
              <DialogDescription className="text-slate-400">
                {selectedMenteeForMeeting?.name} ile bir online görüşme planlayın.
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