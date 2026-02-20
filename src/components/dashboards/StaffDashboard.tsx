import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  MapPin, 
  LogOut, 
  Plus,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  User,
  LayoutDashboard,
  MessageSquare,
  UserPlus,
  UserCheck,
  Check,
  Send,
  Clock,
  Save,
  ChevronDown
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from "../ui/input";
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { AlumniNetworkSection } from '../AlumniNetworkSection';
import atsLogo from 'figma:asset/e53d33bd8a04eb6599952774279c21a71eb10311.png';
import zekiOzenImg from 'figma:asset/db565daf2ca64d95841e98d6189505ba9541e681.png';
import { toast } from 'sonner@2.0.3';

interface StaffDashboardProps {
  onLogout?: () => void;
}

export function StaffDashboard({ onLogout }: StaffDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'map' | 'profile' | 'network'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  
  // Mesajlaşma State'leri
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Record<number, any[]>>({});

  // Profil Düzenleme State'leri
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Doç. Dr. Zeki ÖZEN",
    title: "Doç. Dr.",
    department: "İstanbul Üniversitesi İktisat Fakültesi Yönetim Bilişim Sistemleri Bölümü",
    email: "zekiozen@istanbul.edu.tr"
  });

  // Bağlantı İstekleri Collapsible State
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  
  // Bağlantılarda Arama State
  const [connectionSearch, setConnectionSearch] = useState("");
  
  // Bağlantı Filtreleme State
  const [connectionFilter, setConnectionFilter] = useState<'all' | 'staff' | 'alumni' | 'student'>('all');
  
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

  const openChat = (contact: any) => {
    setSelectedContact(contact);
    setMessageDialogOpen(true);
  };

  // Mock Data
  const notifications = [
    { id: 1, type: 'message', text: 'Ahmet Yılmaz size bir mesaj gönderdi.', time: '10 dk önce', read: false },
    { id: 2, type: 'request', text: 'Ayşe Demir bağlantı isteğinizi kabul etti.', time: '1 saat önce', read: true },
    { id: 3, type: 'system', text: 'Mezunlar Buluşması etkinliği onaylandı.', time: '2 saat önce', read: true },
    { id: 4, type: 'request', text: 'Mehmet Özkan size bağlantı isteği gönderdi.', time: 'Dün', read: true },
  ];

  const connections = [
    { id: 1, name: 'Prof. Dr. Ahmet Yılmaz', title: 'Bölüm Başkanı', avatar: '', status: 'online', type: 'staff' },
    { id: 2, name: 'Arş. Gör. Ayşe Demir', title: 'Akademisyen', avatar: '', status: 'offline', type: 'staff' },
    { id: 3, name: 'Dr. Mehmet Özkan', title: 'Öğretim Üyesi', avatar: '', status: 'online', type: 'staff' },
    { id: 4, name: 'Zeynep Kaya', title: 'Mezun - 2020', avatar: '', status: 'busy', type: 'alumni' },
    { id: 5, name: 'Ali Veli', title: 'Öğrenci - 3. Sınıf', avatar: '', status: 'online', type: 'student' },
    { id: 6, name: 'Mustafa Kemal', title: 'Mezun - Google', avatar: '', status: 'online', type: 'alumni' },
  ];

  const [requests, setRequests] = useState({
    incoming: [
      { id: 1, name: 'Canan Yurt', title: 'Mezun - 2019', avatar: '' },
      { id: 2, name: 'Burak Yılmaz', title: 'Öğrenci Temsilcisi', avatar: '' },
    ],
    outgoing: [
      { id: 3, name: 'Prof. Dr. Selim Ak', title: 'Dekan', avatar: '' },
    ]
  });

  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: "Global Mezunlar Ağı Zirvesi", 
      date: "2025-06-15", 
      time: "09:00", 
      location: "Merkez Kongre Salonu", 
      organizer: "Prof. Dr. Rasim ÖZCAN", 
      type: "Networking", 
      status: "Yayında",
      participants: 120
    },
    { 
      id: 2, 
      title: "Geleceğin Teknolojileri Paneli", 
      date: "2025-05-22", 
      time: "14:30", 
      location: "Teknoloji Transfer Ofisi", 
      organizer: "Doç. Dr. Emre AKADAL", 
      type: "Teknoloji", 
      status: "Yayında",
      participants: 85
    },
    { 
      id: 3, 
      title: "Kariyer Gelişim ve Fırsatlar Fuarı", 
      date: "2025-10-10", 
      time: "10:00", 
      location: "Ana Kampüs Fuar Alanı", 
      organizer: "Doç. Dr. Elif KARTAL", 
      type: "Kariyer", 
      status: "Planlanıyor",
      participants: 350
    },
    { 
      id: 4, 
      title: "Yaratıcı Endüstriler Festivali", 
      date: "2025-04-05", 
      time: "11:00", 
      location: "Sanat ve Tasarım Merkezi", 
      organizer: "Doç. Dr. Zeki ÖZEN", 
      type: "Sanat", 
      status: "Yayında",
      participants: 200
    },
    { 
      id: 5, 
      title: "Liderlik ve Yönetim Semineri", 
      date: "2025-11-20", 
      time: "15:00", 
      location: "İşletme Fakültesi Amfisi", 
      organizer: "Doç. Dr. Gökhan ÖVENÇ", 
      type: "İş Dünyası", 
      status: "Planlanıyor",
      participants: 60
    }
  ]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const location = formData.get('location') as string;

    if (editingEvent) {
      // Güncelleme
      const updatedEvents = events.map(ev => 
        ev.id === editingEvent.id 
        ? { ...ev, title, date, location } 
        : ev
      );
      setEvents(updatedEvents);
      toast.success("Etkinlik başarıyla güncellendi.");
    } else {
      // Yeni Kayıt
      const newEvent = {
        id: Date.now(),
        title,
        date,
        location,
        status: "Taslak",
        participants: 0
      };
      setEvents([...events, newEvent]);
      toast.success("Etkinlik başarıyla oluşturuldu.");
    }
    
    setIsNewEventDialogOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(ev => ev.id !== id));
    toast.success("Etkinlik silindi.");
  };

  const openNewEventDialog = () => {
    setEditingEvent(null);
    setIsNewEventDialogOpen(true);
  };

  const openEditDialog = (event: any) => {
    setEditingEvent(event);
    setIsNewEventDialogOpen(true);
  };

  const handleApproveRequest = (id: number, name: string) => {
    setRequests(prev => ({
      ...prev,
      incoming: prev.incoming.filter(req => req.id !== id)
    }));
    toast.success(`${name} bağlantı isteği onaylandı.`);
  };

  const handleRejectRequest = (id: number, name: string) => {
    setRequests(prev => ({
      ...prev,
      incoming: prev.incoming.filter(req => req.id !== id)
    }));
    toast.error(`${name} bağlantı isteği reddedildi.`);
  };

  const handleCancelRequest = (id: number, name: string) => {
    setRequests(prev => ({
      ...prev,
      outgoing: prev.outgoing.filter(req => req.id !== id)
    }));
    toast.success(`${name}'e gönderilen istek iptal edildi.`);
  };

  const renderNetwork = () => (
    <div className="space-y-6">
      {/* Bağlantı İstekleri - Collapsible */}
      <Collapsible open={isRequestsOpen} onOpenChange={setIsRequestsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <div className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-white">Bağlantı İstekleri</h3>
                <Badge variant="outline" className="border-blue-600/30 bg-blue-600/10 text-blue-400">
                  {requests.incoming.length + requests.outgoing.length}
                </Badge>
              </div>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isRequestsOpen ? 'transform rotate-180' : ''}`} />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
            <CardContent className="pt-6">
              <Tabs defaultValue="incoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800 mb-4 max-w-[400px]">
                  <TabsTrigger value="incoming" className="data-[state=active]:bg-slate-700 text-slate-300">Gelen ({requests.incoming.length})</TabsTrigger>
                  <TabsTrigger value="outgoing" className="data-[state=active]:bg-slate-700 text-slate-300">Gönderilen ({requests.outgoing.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="incoming">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requests.incoming.map((req) => (
                      <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-800/30 p-4 rounded-lg border border-slate-800 gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{req.name.substring(0,2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-white">{req.name}</p>
                            <p className="text-xs text-slate-400">{req.title}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button 
                            size="sm" 
                            className="flex-1 sm:flex-none bg-green-600/20 text-green-400 hover:bg-green-600/40 border border-green-600/30 text-xs sm:text-sm" 
                            onClick={() => handleApproveRequest(req.id, req.name)}
                          >
                            <Check className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" /> 
                            <span className="hidden sm:inline">Onayla</span>
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 sm:flex-none bg-red-600/20 text-red-400 hover:bg-red-600/40 border border-red-600/30 text-xs sm:text-sm" 
                            onClick={() => handleRejectRequest(req.id, req.name)}
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" /> 
                            <span className="hidden sm:inline">Reddet</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                    {requests.incoming.length === 0 && <p className="text-slate-500 py-4 col-span-2">Bekleyen gelen istek yok.</p>}
                  </div>
                </TabsContent>
                
                <TabsContent value="outgoing">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requests.outgoing.map((req) => (
                      <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-800/30 p-4 rounded-lg border border-slate-800 gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{req.name.substring(0,2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-white">{req.name}</p>
                            <p className="text-xs text-slate-400">{req.title}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full sm:w-auto border-slate-700 text-slate-400 hover:text-white text-xs sm:text-sm" 
                          onClick={() => handleCancelRequest(req.id, req.name)}
                        >
                          İptal Et
                        </Button>
                      </div>
                    ))}
                    {requests.outgoing.length === 0 && <p className="text-slate-500 py-4 col-span-2">Gönderilen istek yok.</p>}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Bağlantılarım */}
      <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {connections
              .filter(c => connectionFilter === 'all' || c.type === connectionFilter)
              .filter(conn => conn.name.toLowerCase().includes(connectionSearch.toLowerCase()))
              .map((conn) => (
                <div key={conn.id} className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 flex flex-col items-center text-center hover:bg-slate-800/50 transition-colors group">
                  <div className="relative mb-3">
                    <Avatar className="h-20 w-20 border-4 border-slate-800 group-hover:border-slate-700 transition-colors">
                      <AvatarFallback className="bg-slate-700 text-xl text-slate-300">{conn.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 h-5 w-5 rounded-full border-4 border-slate-900 ${
                      conn.status === 'online' ? 'bg-green-500' : 
                      conn.status === 'busy' ? 'bg-red-500' : 'bg-slate-500'
                    }`} />
                  </div>
                  <h3 className="font-bold text-white text-base truncate w-full">{conn.name}</h3>
                  <p className="text-sm text-slate-400 mb-4 truncate w-full">{conn.title}</p>
                  <div className="flex gap-2 w-full">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border border-blue-600/30"
                      onClick={() => openChat(conn)}
                    >
                      <MessageSquare className="mr-2 h-3 w-3" /> Mesaj
                    </Button>
                    <Button size="sm" variant="ghost" className="px-2 text-slate-400 hover:text-white">
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Toplam Mezun</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12,345</div>
            <p className="text-xs text-slate-500">+180 geçen aydan beri</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Aktif Etkinlikler</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{events.length}</div>
            <p className="text-xs text-slate-500">2 tanesi bu hafta</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Harita Etkileşimi</CardTitle>
            <MapPin className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">85 Ülke</div>
            <p className="text-xs text-slate-500">Mezun dağılımı</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-white">Son Etkinlikler</CardTitle>
            <CardDescription className="text-slate-400">Yönettiğiniz son etkinliklerin durumu.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.slice(0, 3).map(event => (
                <div key={event.id} className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                  <div>
                    <h4 className="font-medium text-white">{event.title}</h4>
                    <p className="text-sm text-slate-500">{event.date} • {event.location}</p>
                  </div>
                  <Badge variant="outline" className={`${
                    event.status === 'Planlandı' ? 'border-blue-500 text-blue-400' :
                    event.status === 'Aktif' ? 'border-green-500 text-green-400' :
                    'border-slate-500 text-slate-400'
                  }`}>
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-white">Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/50"
              onClick={() => { setActiveTab('events'); setIsNewEventDialogOpen(true); }}
            >
              <Plus className="mr-2 h-4 w-4" /> Yeni Etkinlik Oluştur
            </Button>
            <Button 
              className="w-full justify-start bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-600/50"
              onClick={() => setActiveTab('map')}
            >
              <MapPin className="mr-2 h-4 w-4" /> Mezun Haritasını İncele
            </Button>
            <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-slate-300">
              <Bell className="mr-2 h-4 w-4" /> Duyuru Yayınla
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );


  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Etkinlik Yönetimi</h2>
          <p className="text-slate-400">Mezunlar ve öğrenciler için etkinlikler düzenleyin.</p>
        </div>
        <Dialog open={isNewEventDialogOpen} onOpenChange={setIsNewEventDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setEditingEvent(null)}>
              <Plus className="mr-2 h-4 w-4" /> Yeni Etkinlik
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Etkinliği Düzenle" : "Yeni Etkinlik Oluştur"}</DialogTitle>
              <DialogDescription className="text-slate-400">
                {editingEvent ? "Mevcut etkinlik bilgilerini güncelleyin." : "Etkinlik detaylarını girerek yeni bir etkinlik planlayın."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-200">Etkinlik Adı</Label>
                <Input id="title" name="title" defaultValue={editingEvent?.title} required className="bg-slate-950 border-slate-700 text-white" placeholder="Örn: Mezunlar Kahvaltısı" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-slate-200">Tarih</Label>
                  <Input id="date" name="date" type="date" defaultValue={editingEvent?.date} required className="bg-slate-950 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-slate-200">Saat</Label>
                  <Input id="time" name="time" type="time" defaultValue={editingEvent?.time} className="bg-slate-950 border-slate-700 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-200">Konum</Label>
                <Input id="location" name="location" defaultValue={editingEvent?.location} required className="bg-slate-950 border-slate-700 text-white" placeholder="Örn: Konferans Salonu veya Online Link" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-200">Açıklama</Label>
                <Input id="description" name="description" defaultValue={editingEvent?.description} className="bg-slate-950 border-slate-700 text-white" placeholder="Etkinlik hakkında kısa bilgi..." />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">{editingEvent ? "Güncelle" : "Oluştur"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events.map((event) => {
          const isOwner = event.organizer === profileData.name;
          return (
            <Card key={event.id} className="bg-slate-900/50 border-slate-800 text-slate-100 group hover:border-slate-700 transition-colors">
              <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                    <Badge variant="outline" className={`${
                      event.status === 'Planlanıyor' ? 'border-blue-500 text-blue-400' :
                      event.status === 'Yayında' ? 'border-green-500 text-green-400' :
                      'border-slate-500 text-slate-400'
                    }`}>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date} {event.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {event.organizer}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.participants} Katılımcı</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto min-w-[140px] justify-end">
                  {isOwner ? (
                    <>
                      <Button onClick={() => openEditDialog(event)} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold border-none">Düzenle</Button>
                      <Button onClick={() => handleDeleteEvent(event.id)} variant="destructive" className="flex-1 md:flex-none bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/50">Sil</Button>
                    </>
                  ) : (
                     <span className="text-xs text-slate-500 italic self-center px-2">Sadece görüntüleme yetkisi</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
      <AlumniNetworkSection />
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Profilim</h2>
          <p className="text-slate-400">Kişisel ve akademik bilgilerinizi yönetin.</p>
        </div>
        {isEditingProfile ? (
            <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setIsEditingProfile(false)} className="text-slate-300 hover:text-white border border-slate-700">İptal</Button>
                <Button onClick={() => { setIsEditingProfile(false); toast.success("Profil bilgileri güncellendi."); }} className="bg-green-600 hover:bg-green-700 text-white gap-2"><Save size={16}/> Kaydet</Button>
            </div>
        ) : (
            <Button onClick={() => setIsEditingProfile(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Settings size={16} /> Profili Düzenle
            </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon: Avatar & Basic Info */}
        <Card className="bg-slate-900/50 border-slate-800 text-slate-100 h-fit">
          <CardContent className="pt-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-32 w-32 border-4 border-slate-800 shadow-xl">
                <AvatarImage src={zekiOzenImg} alt="Zeki zen" />
                <AvatarFallback className="bg-blue-900 text-blue-200">ZÖ</AvatarFallback>
              </Avatar>
            </div>
            <h3 className="text-xl font-bold text-white">{profileData.title} {profileData.name}</h3>
            <p className="text-slate-400 mb-1">{profileData.department.split(' ').slice(0, 4).join(' ')}...</p>
            <p className="text-slate-500 text-sm mb-4">İstanbul Üniversitesi</p>
            <div className="flex justify-center gap-2 mb-6">
              <Badge variant="outline" className="border-slate-700 text-slate-300">Akademisyen</Badge>
              <Badge variant="outline" className="border-blue-900/50 text-blue-400 bg-blue-900/10">Doç. Dr.</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Sağ Kolon: Form Alanları */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-white">Personel Bilgileri</CardTitle>
            <CardDescription className="text-slate-400">
              Kişisel ve akademik bilgilerinizi buradan güncelleyebilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-slate-300">Ünvan</Label>
                        <Input 
                            value={profileData.title} 
                            disabled={!isEditingProfile}
                            onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                            className={`bg-slate-950/50 border-slate-800 ${isEditingProfile ? 'text-white border-slate-700' : 'text-slate-400'}`}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-300">Ad Soyad</Label>
                        <Input 
                            value={profileData.name} 
                            disabled={!isEditingProfile}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            className={`bg-slate-950/50 border-slate-800 ${isEditingProfile ? 'text-white border-slate-700' : 'text-slate-400'}`}
                        />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label className="text-slate-300">Bölüm / Fakülte</Label>
                    <Input 
                        value={profileData.department} 
                        disabled={!isEditingProfile}
                        onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                        className={`bg-slate-950/50 border-slate-800 ${isEditingProfile ? 'text-white border-slate-700' : 'text-slate-400'}`}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">E-posta</Label>
                    <Input 
                        value={profileData.email} 
                        disabled={!isEditingProfile}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className={`bg-slate-950/50 border-slate-800 ${isEditingProfile ? 'text-white border-slate-700' : 'text-slate-400'}`}
                    />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
  
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
              {/* Doktora */}
              <div className="relative pl-12">
                  <div className="absolute left-7 top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-900"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-lg font-bold text-white">Doktora</h3>
                      <Badge variant="secondary" className="w-fit bg-slate-800 text-slate-300">2012 - 2016</Badge>
                  </div>
                  <p className="text-slate-400">İstanbul Üniversitesi, Fen Bilimleri Enstitüsü, Enformatik Bölümü, Türkiye</p>
              </div>
  
              {/* Yüksek Lisans */}
              <div className="relative pl-12">
                  <div className="absolute left-7 top-1 w-4 h-4 rounded-full bg-slate-600 border-4 border-slate-900"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-lg font-bold text-white">Yüksek Lisans</h3>
                      <Badge variant="secondary" className="w-fit bg-slate-800 text-slate-300">2008 - 2012</Badge>
                  </div>
                  <p className="text-slate-400">İstanbul Üniversitesi, Fen Bilimleri Enstitüsü, Enformatik Bölümü, Türkiye</p>
              </div>
  
              {/* Lisans */}
              <div className="relative pl-12">
                  <div className="absolute left-7 top-1 w-4 h-4 rounded-full bg-slate-600 border-4 border-slate-900"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-lg font-bold text-white">Lisans</h3>
                      <Badge variant="secondary" className="w-fit bg-slate-800 text-slate-300">2003 - 2008</Badge>
                  </div>
                  <p className="text-slate-400">İstanbul Üniversitesi, Fen Fakültesi, Fizik, Türkiye</p>
              </div>
  
              {/* Ön Lisans */}
              <div className="relative pl-12">
                  <div className="absolute left-7 top-1 w-4 h-4 rounded-full bg-slate-600 border-4 border-slate-900"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-lg font-bold text-white">Ön Lisans</h3>
                      <Badge variant="secondary" className="w-fit bg-slate-800 text-slate-300">2000 - 2002</Badge>
                  </div>
                  <p className="text-slate-400">Sakarya Üniversitesi, Geyve Meslek Yüksekokulu, Bilgisayar Programlama, Türkiye</p>
              </div>
          </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f111a] flex font-sans text-slate-100 relative">
      {/* Sidebar */}
      <aside className={`
        w-64 bg-[#0B1026] text-white flex flex-col fixed h-full z-50 border-r border-slate-900 
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-3">
             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 shadow-lg shadow-blue-900/20">
               <img src={atsLogo} alt="ATS Logo" className="w-full h-full object-contain" />
             </div>
             Personel
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
            onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }}
          >
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Genel Bakış
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-left ${activeTab === 'events' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => { setActiveTab('events'); setIsMobileMenuOpen(false); }}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Etkinlik Yönetimi
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-left ${activeTab === 'map' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => { setActiveTab('map'); setIsMobileMenuOpen(false); }}
          >
            <MapPin className="mr-2 h-5 w-5" />
            Mezun Haritası
          </Button>

          <Button 
            variant="ghost" 
            className={`w-full justify-start text-left ${activeTab === 'network' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => { setActiveTab('network'); setIsMobileMenuOpen(false); }}
          >
            <Users className="mr-2 h-5 w-5" />
            Bağlantılarım
          </Button>

          <Button 
            variant="ghost" 
            className={`w-full justify-start text-left ${activeTab === 'profile' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }}
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
                {activeTab === 'overview' && 'Yönetim Paneli'}
                {activeTab === 'events' && 'Etkinlikler'}
                {activeTab === 'map' && 'Küresel Mezun Ağı'}
                {activeTab === 'profile' && 'Profilim'}
                {activeTab === 'network' && 'Bağlantılarım'}
              </h1>
              <p className="text-slate-400 text-xs md:text-sm hidden sm:block">Kurumsal İletişim ve Etkinlik Yönetimi</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
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
               <p className="text-sm font-medium text-white">Doç. Dr. Zeki Özen</p>
               <p className="text-xs text-slate-500">Personel</p>
             </div>
             <Avatar className="border-2 border-slate-700 h-10 w-10">
               <AvatarImage src={zekiOzenImg} alt="Zeki Özen" />
               <AvatarFallback className="bg-blue-900 text-white">ZÖ</AvatarFallback>
             </Avatar>
          </div>
        </header>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'map' && renderMap()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'network' && renderNetwork()}

        {/* Mesajlaşma Dialog */}
        <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-[500px]">
            <DialogHeader className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{selectedContact?.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-white">{selectedContact?.name}</DialogTitle>
                  <DialogDescription className="text-slate-400">{selectedContact?.title}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="flex flex-col h-[400px]">
              <ScrollArea className="flex-1 pr-4 py-4">
                <div className="space-y-4">
                  {chatMessages[selectedContact?.id]?.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-xl p-3 ${
                        msg.sender === 'me' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-slate-800 text-slate-200 rounded-bl-none'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-[10px] opacity-70 mt-1 block text-right">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="pt-4 border-t border-slate-800 flex gap-2">
                <Input 
                  placeholder="Mesajınızı yazın..." 
                  className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-blue-600"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="icon" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}