import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import {
  motion,
  useInView,
  useSpring,
  useMotionValue,
  AnimatePresence,
  useScroll,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  GraduationCap,
  Users,
  User,
  BookOpen,
  Globe,
  Briefcase,
  MapPin,
  Building2,
  Handshake,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Phone,
  ChevronRight,
  ChevronLeft,
  Activity,
  Menu,
  Sprout,
  Landmark,
  HardHat,
  BrainCircuit,
  Sparkles,
  Rocket,
  Target,
  MessageCircle,
  Zap,
  Trophy,
  Medal,
  Calendar,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "./ui/carousel";
import atsTextLogo from "figma:asset/1556cc827b7fa917a54b1192b2bd00d30f254d9f.png";
import orhanPamukImg from "figma:asset/9516fb81d16016e538b08d11fcb0a8fba140eeb8.png";
import azizSancarImg from "figma:asset/10f98e3b7342492f6bf74a96437986f04537d109.png";
import alpIkizlerImg from "figma:asset/f63d2c0b22c6813e1e9f1c1f415c1b4a04715326.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Card, CardContent } from "./ui/card";
import { eventService, Event as BackendEvent } from "../services/eventService";

// --- Animated Counter Component ---
function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "0px",
  });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent =
          Math.floor(latest).toLocaleString("tr-TR") + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref} />;
}

// --- Map Data & Types ---
type Sector =
  | "all"
  | "tech"
  | "health"
  | "law"
  | "business"
  | "engineering"
  | "education"
  | "agriculture"
  | "finance"
  | "construction"
  | "other";

interface RegionData {
  id: string;
  name: string;
  count: number;
  topCompanies: string[];
  lat: number;
  lng: number;
  sectors: Sector[];
  sectorStats: {
    label: string;
    value: number;
    color: string;
  }[];
}

// Bağlantı Ağı (Hangi nokta hangisine bağlı)
// [Kaynak ID, Hedef ID]
const mapConnections: [string, string][] = [
  ["na", "eu"], // Kuzey Amerika -> Avrupa
  ["na", "sa"], // Kuzey Amerika -> Güney Amerika
  ["sa", "africa"], // Güney Amerika -> Afrika
  ["eu", "africa"], // Avrupa -> Afrika
  ["eu", "tr"], // Avrupa -> Türkiye
  ["tr", "asia"], // Türkiye -> Asya
  ["africa", "asia"], // Afrika -> Asya
  ["asia", "au"], // Asya -> Avustralya
  ["na", "asia"], // Pasifik hattı
  // --- YENİ STRATEJİK BAĞLANTILAR (Filtreleme sürekliliği için) ---
  ["sa", "tr"], // Güney Amerika -> Türkiye (Örn: Tarım filtresinde kopukluğu önler)
  ["tr", "africa"], // Türkiye -> Afrika (Örn: İnşaat filtresinde direkt bağ)
  ["sa", "eu"], // Güney Amerika -> Avrupa (Örn: Mühendislik için alternatif rota)
];

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: (
    role: "student" | "alumni" | "staff",
  ) => void;
  logoSrc: string;
}

export function LandingPage({
  onLoginClick,
  onRegisterClick,
  logoSrc,
}: LandingPageProps) {
    const [language, setLanguage] = useState<"TR" | "EN">("TR");
    
    // Backend Events State
    const [backendEvents, setBackendEvents] = useState<any[]>([]);
    
    useEffect(() => {
        const fetchEvents = async () => {
            const events = await eventService.getAll();
            // API'den veri gelmese bile (null/undefined), işlem yapmaya çalış
            const safeEvents = Array.isArray(events) ? events : [];
            
            if (safeEvents.length > 0) {
                // Backend verisini UI formatına dönüştür
                const formattedEvents = safeEvents.reduce((acc: any[], e: any) => {
                    // Veri tamamen boşsa atla
                    if (!e) return acc;

                    try {
                        // Tarih yoksa veya bozuksa şimdiki zamanı kullan (Veriyi kaybetmemek için)
                        let d = new Date();
                        if (e.date) {
                            const parsedDate = new Date(e.date);
                            if (!isNaN(parsedDate.getTime())) {
                                d = parsedDate;
                            }
                        }

                        const monthsTR = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
                        const monthsEN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        
                        acc.push({
                            title: e.title || "Başlıksız Etkinlik",
                            dateDay: d.getDate().toString(),
                            dateMonth: language === "TR" ? monthsTR[d.getMonth()] : monthsEN[d.getMonth()],
                            fullDate: d.toLocaleString(language === "TR" ? "tr-TR" : "en-US", { dateStyle: "long", timeStyle: "short" }),
                            loc: e.location || "Online",
                            desc: e.description || "",
                            type: e.category || "Genel",
                            image: e.image || "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1080",
                            organizer: e.organizer || "Admin"
                        });
                    } catch (err) {
                        console.error("Event formatting error:", err);
                    }
                    return acc;
                }, []);
                setBackendEvents(formattedEvents);
            }
        };
        fetchEvents();
    }, [language]); // Dil değişince tarih formatını güncellemek için dependency

    const [isLogoHovered, setIsLogoHovered] = useState(false);
    // ... (Mevcut kodlar)
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] =
    useState(false);

  // Map State
  const [selectedSector, setSelectedSector] =
    useState<Sector>("all");
  const [activeRegion, setActiveRegion] =
    useState<RegionData | null>(null);

  // Carousel State
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string>("");

  // Scroll Animation for Hero - DEEP EFFECT
  const { scrollY } = useScroll();
  
  // Daha agresif küçülme (1 -> 0.6)
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.6]);
  
  // Opacity değişimi
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  
  // Kararma + Bulanıklaşma efekti
  const heroFilter = useTransform(scrollY, [0, 600], ["brightness(1) blur(0px)", "brightness(0) blur(10px)"]);
  
  // Daha fazla aşağı kayma (Parallax)
  const heroY = useTransform(scrollY, [0, 600], [0, 300]);
  
  // Hafif 3D Dönüş (Geriye yatma)
  const heroRotateX = useTransform(scrollY, [0, 600], [0, 20]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // OTOMATİK KOORDİNAT HESAPLAYICI (PROJEKSİYON) - Kullanıcının Orijinal Fonksiyonu
  const getPos = (lat: number, lng: number) => {
    // x boylamdan hesaplanır: -180 ile 180 arasıdır.
    const x = ((lng + 180) * 100) / 360;

    // y enlemden hesaplanır (Mercator projeksiyonu formülü)
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));

    // 2.03 değeri standart Mercator haritalarının en-boy oran sabiti içindir
    // Eğer noktalar hala biraz yukarıdaysa 50 değerini 48 veya 52 yaparak ince ayar yapabilirsin.
    const y = 50 - (100 * mercN) / (2 * Math.PI);

    return { x, y };
  };

  const content = {
    TR: {
      login: "Giriş Yap",
      register: "Kayıt Ol",
      heroTitle:
        "Mezun Olmak Bir Son Değil, Bir Ağın Parçası Olmaktır.",
      heroDesc:
        "İstanbul Üniversitesi mezunlarını ve öğrencilerini tek bir platformda buluşturuyoruz.",
      statsTitle: "Gücümüz Sayılarda",
      start: "Ağımıza Katıl",
      mapSection: {
        title: "Mezunlarımız Dünyanın Her Yerinde",
        subtitle: "Global Etki Alanı",
        viewProfiles: "Mezun Profillerini İncele",
      },
      eventsSection: {
        title: "Etkinlikler",
        subtitle: "Mezun ağımızdaki en güncel buluşmalar, seminerler ve sosyal aktiviteler",
        goToEvent: "Etkinliğe Git",
      },
      eventDialog: {
        organizer: "Düzenleyen",
        close: "Kapat",
        loginToJoin: "Katılmak İçin Giriş Yap",
      },
      menu: {
        network: "Ağımızı Keşfet",
        mentorship: "Mentorluk",
        events: "Etkinlikler",
        stories: "Başarı Hikayeleri",
        contact: "İletişim",
      },
      mentorshipSection: {
        badge: "Yapay Zeka Destekli",
        title: "Geleceğinize Işık Tutacak Bir Rehber Bulun",
        subtitle:
          "Sıradan bir iş ağından fazlası. Yapay zeka algoritmamız, kariyer hedeflerinize, ilgi alanlarınıza ve geçmişinize en uygun mentoru binlerce mezun arasından sizin için seçer.",
        aiFeature: {
          title: "Akıllı Eşleştirme",
          desc: "Profilinizi analiz eder ve en uyumlu mentoru %98 doğrulukla önerir.",
        },
        features: [
          {
            title: "Gerçek Deneyim Aktarımı",
            desc: "Kitaplarda yazmayan, sektörün içinden gelen gerçek hayat tecrübeleri.",
            icon: "BookOpen",
          },
          {
            title: "Canlı Etkileşim",
            desc: "Statik profiller yerine görüntülü görüşmeler ve birebir mesajlaşma.",
            icon: "MessageCircle",
          },
          {
            title: "Okul Kültürü",
            desc: "Sizinle aynı sıralardan geçmiş, aynı dili konuşan bir topluluk.",
            icon: "Landmark",
          },
        ],
        ctaStudent: "Mentor Bul",
        ctaAlumni: "Mentor Ol / Destek Ver",
      },
      footer: {
        desc: "İstanbul Üniversitesi mezunları için geliştirilen resmi takip sistemi.",
        about: "Hakkımızda",
        privacy: "KVKK & Gizlilik",
        contact: "İletişim",
        policy: "Mezun Politikası",
      },
      menuTitle: "Menü",
      sectorLabels: {
        all: "Tümü",
        tech: "Teknoloji",
        health: "Sağlık",
        engineering: "Mühendislik",
        business: "İş Dünyası",
        law: "Hukuk",
        education: "Eğitim",
        agriculture: "Tarım",
        finance: "Finans",
        construction: "İnşaat",
        other: "Diğer",
      },
      mapRegions: [
        {
          id: "na",
          name: "Kuzey Amerika",
          count: 1250,
          topCompanies: ["Google", "Amazon", "Pfizer"],
          lat: 40.0,
          lng: -90.0,
          sectors: ["tech", "business", "health", "other"],
          sectorStats: [
            { label: "Teknoloji", value: 45, color: "#3b82f6" },
            { label: "İş Dünyası", value: 30, color: "#10b981" },
            { label: "Sağlık", value: 15, color: "#ef4444" },
            { label: "Diğer", value: 10, color: "#64748b" },
          ],
        },
        {
          id: "sa",
          name: "Güney Amerika",
          count: 450,
          topCompanies: ["Embraer"],
          lat: -15.0,
          lng: -60.0,
          sectors: ["engineering", "agriculture", "other"],
          sectorStats: [
            { label: "Mühendislik", value: 60, color: "#f59e0b" },
            { label: "Tarım", value: 20, color: "#84cc16" },
            { label: "Diğer", value: 20, color: "#64748b" },
          ],
        },
        {
          id: "eu",
          name: "Avrupa",
          count: 4500,
          topCompanies: ["Siemens", "SAP", "Bayer"],
          lat: 55.0,
          lng: 9.0,
          sectors: ["engineering", "tech", "health", "law", "other"],
          sectorStats: [
            { label: "Mühendislik", value: 35, color: "#f59e0b" },
            { label: "Teknoloji", value: 25, color: "#3b82f6" },
            { label: "Hukuk", value: 15, color: "#8b5cf6" },
            { label: "Sağlık", value: 15, color: "#ef4444" },
            { label: "Diğer", value: 10, color: "#64748b" },
          ],
        },
        {
          id: "tr",
          name: "Türkiye (Merkez)",
          count: 8500,
          topCompanies: ["THY", "Aselsan"],
          lat: 47.0,
          lng: 18.0,
          sectors: ["all", "engineering", "health", "law", "education", "tech", "finance", "agriculture", "construction", "other"],
          sectorStats: [
            { label: "Mühendislik", value: 25, color: "#f59e0b" },
            { label: "Sağlık", value: 15, color: "#ef4444" },
            { label: "Teknoloji", value: 15, color: "#3b82f6" },
            { label: "Eğitim", value: 10, color: "#06b6d4" },
            { label: "Hukuk", value: 10, color: "#8b5cf6" },
            { label: "Finans", value: 10, color: "#10b981" },
            { label: "Tarım", value: 5, color: "#84cc16" },
            { label: "İnşaat", value: 5, color: "#f97316" },
            { label: "Diğer", value: 5, color: "#64748b" },
          ],
        },
        {
          id: "africa",
          name: "Afrika",
          count: 320,
          topCompanies: ["Naspers"],
          lat: 5.0,
          lng: 20.0,
          sectors: ["tech", "construction", "other"],
          sectorStats: [
            { label: "Teknoloji", value: 40, color: "#3b82f6" },
            { label: "İnşaat", value: 30, color: "#f97316" },
            { label: "Diğer", value: 30, color: "#64748b" },
          ],
        },
        {
          id: "asia",
          name: "Asya Pasifik",
          count: 850,
          topCompanies: ["Samsung", "Sony"],
          lat: 35.0,
          lng: 90.0,
          sectors: ["tech", "business", "finance", "other"],
          sectorStats: [
            { label: "Teknoloji", value: 55, color: "#3b82f6" },
            { label: "Finans", value: 25, color: "#10b981" },
            { label: "Diğer", value: 20, color: "#64748b" },
          ],
        },
        {
          id: "au",
          name: "Avustralya",
          count: 120,
          topCompanies: ["Canva"],
          lat: -52.0,
          lng: 105.0,
          sectors: ["tech", "other"],
          sectorStats: [
            { label: "Yazılım", value: 60, color: "#3b82f6" },
            { label: "Diğer", value: 40, color: "#64748b" },
          ],
        },
      ],
      events: [
        { 
          title: "Global Mezunlar Ağı Zirvesi", 
          dateDay: "15",
          dateMonth: "Haz",
          fullDate: "15 Haziran 2025 09:00",
          loc: "Merkez Kongre Salonu", 
          desc: "Dünyanın dört bir yanından gelen mezunlarımızın deneyimlerini paylaştığı, yeni iş birliklerinin temellerinin atıldığı büyük buluşma.",
          type: "Networking",
          image: "https://images.unsplash.com/photo-1571645163064-77faa9676a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG5ldHdvcmtpbmclMjBldmVudCUyMGNvbmZlcmVuY2V8ZW58MXx8fHwxNzY2MjcxNjUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          organizer: "Prof. Dr. Rasim ÖZCAN"
        },
        { 
          title: "Geleceğin Teknolojileri Paneli", 
          dateDay: "22",
          dateMonth: "May",
          fullDate: "22 Mayıs 2025 14:30",
          loc: "Teknoloji Transfer Ofisi", 
          desc: "Yapay zeka, blockchain ve sürdürülebilir enerji teknolojilerinin sektördeki öncü isimleri tarafından ele alınacağı vizyoner panel.",
          type: "Teknoloji",
          image: "https://images.unsplash.com/photo-1762968286778-60e65336d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmUlMjB0ZWNobm9sb2d5JTIwYWklMjByb2JvdCUyMGNvbmZlcmVuY2V8ZW58MXx8fHwxNzY2MjcxNjU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          organizer: "Doç. Dr. Emre AKADAL"
        },
        { 
          title: "Kariyer Gelişim ve Fırsatlar Fuarı", 
          dateDay: "10",
          dateMonth: "Eki",
          fullDate: "10 Ekim 2025 10:00",
          loc: "Ana Kampüs Fuar Alanı", 
          desc: "Sektör lideri 50'den fazla firmanın katılımıyla gerçekleşecek, staj ve iş imkanlarının sunulduğu kapsamlı kariyer etkinliği.",
          type: "Kariyer",
          image: "https://images.unsplash.com/photo-1758610840977-8ee55513281c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBmYWlyJTIwY2FyZWVyJTIwZXZlbnQlMjBzdHVkZW50c3xlbnwxfHx8fDE3NjYyNzE2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          organizer: "Doç. Dr. Elif KARTAL"
        },
        { 
          title: "Yaratıcı Endüstriler Festivali", 
          dateDay: "05",
          dateMonth: "Nis",
          fullDate: "05 Nisan 2025 11:00",
          loc: "Sanat ve Tasarım Merkezi", 
          desc: "Tasarım, mimarlık ve sanat alanındaki mezunlarımızın en seçkin projelerinin sergilendiği, atölye çalışmalarıyla dolu festival.",
          type: "Sanat",
          image: "https://images.unsplash.com/photo-1763909855036-46b3be5085b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeSUyMHVuaXZlcnNpdHl8ZW58MXx8fHwxNzY2MjcxNjYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          organizer: "Doç. Dr. Zeki ÖZEN"
        },
        { 
          title: "Liderlik ve Yönetim Semineri", 
          dateDay: "20",
          dateMonth: "Kas",
          fullDate: "20 Kasım 2025 15:00",
          loc: "İşletme Fakültesi Amfisi", 
          desc: "Kriz yönetimi ve stratejik liderlik konularında uzman yöneticilerin vaka analizleri eşliğinde sunum yapacağı sertifikalı seminer.",
          type: "İş Dünyası",
          image: "https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGxlYWRlcnNoaXAlMjBzZW1pbmFyJTIwc3BlYWtlcnxlbnwxfHx8fDE3NjYyNzE2Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          organizer: "Doç. Dr. Gökhan ÖVENÇ"
        },
      ],
      stories: [
        {
          name: "Orhan Pamuk",
          title: "Yazar",
          desc1: "İstanbul Üniversitesi'nde gazetecilik okudu.",
          desc2: "Orhan Ferit Pamuk, Türk romancı. Birçok başka edebiyat ödülünün yanı sıra, 2006 yılında Nobel Edebiyat Ödülü'ne layık görüldü ve 54 yaşında, bu ödülü kazanan en genç edebiyatçılardan biri oldu.",
          image: orhanPamukImg,
          badge: "Nobel Edebiyat",
          isNobel: true,
          badgeIcon: "Trophy"
        },
        {
          name: "Aziz Sancar",
          title: "Doktor",
          desc1: "1963 yılında girdiği İstanbul Üniversitesi Tıp Fakültesi'nden 1969 yılında birincilikle mezun oldu.",
          desc2: "Türk-Amerikalı doktor, akademisyen, biyokimyager ve moleküler biyologdur. 2015 yılında DNA onarımına ilişkin çalışmaları nedeniyle Nobel Kimya Ödülü'ne layık görülmüştür. ",
          image: azizSancarImg,
          badge: "Nobel Kimya",
          isNobel: true,
          badgeIcon: "Trophy"
        },
        {
          name: "Alp İkizler",
          title: "Doktor",
          desc1: "İstanbul Üniversitesi Tıp Fakültesi'nden MD derecesini aldı.",
          desc2: "Vanderbilt Üniversitesi Tıp Fakültesi'nde Catherine McLaughlin Hakim Tıp Kürsüsü'nü elinde tutan bir nefrologdur; klinik çalışmalar yürütür ve bir araştırma laboratuvarına başkanlık eder.",
          image: alpIkizlerImg,
          badge: "Bilim İnsanı",
          isNobel: false,
          badgeIcon: "Medal"
        }
      ]
    },
    EN: {
      login: "Login",
      register: "Register",
      heroTitle:
        "Graduation is Not an End, It's Being Part of a Network.",
      heroDesc:
        "We bring Istanbul University alumni and students together on a single platform.",
      statsTitle: "Strength in Numbers",
      start: "Join Network",
      mapSection: {
        title: "Our Alumni Are Everywhere",
        subtitle: "Global Impact Area",
        viewProfiles: "View Alumni Profiles",
      },
      eventsSection: {
        title: "Events",
        subtitle: "Latest meetups, seminars and social activities in our alumni network",
        goToEvent: "Go to Event",
      },
      eventDialog: {
        organizer: "Organizer",
        close: "Close",
        loginToJoin: "Login to Join",
      },
      menu: {
        network: "Discover Network",
        mentorship: "Mentorship",
        events: "Events",
        stories: "Success Stories",
        howItWorks: "How it Works?",
        contact: "Contact",
      },
      mentorshipSection: {
        badge: "AI Powered",
        title: "Find a Guide to Light Your Future",
        subtitle:
          "More than just a job network. Our AI algorithm selects the most suitable mentor for your career goals, interests, and background from thousands of alumni.",
        aiFeature: {
          title: "Smart Matching",
          desc: "Analyzes your profile and suggests the most compatible mentor with 98% accuracy.",
        },
        features: [
          {
            title: "Real Experience Transfer",
            desc: "Real-life experiences from within the industry that aren't written in books.",
            icon: "BookOpen",
          },
          {
            title: "Live Interaction",
            desc: "Video calls and one-on-one messaging instead of static profiles.",
            icon: "MessageCircle",
          },
          {
            title: "School Culture",
            desc: "A community that passed through the same desks and speaks the same language as you.",
            icon: "Landmark",
          },
        ],
        ctaStudent: "Find a Mentor",
        ctaAlumni: "Become a Mentor",
      },
      footer: {
        desc: "Official tracking system developed for Istanbul University alumni.",
        about: "About Us",
        privacy: "Privacy Policy",
        contact: "Contact",
        policy: "Alumni Policy",
      },
      menuTitle: "Menu",
      sectorLabels: {
        all: "All",
        tech: "Technology",
        health: "Health",
        engineering: "Engineering",
        business: "Business",
        law: "Law",
        education: "Education",
        agriculture: "Agriculture",
        finance: "Finance",
        construction: "Construction",
        other: "Other",
      },
      mapRegions: [
        {
          id: "na",
          name: "North America",
          count: 1250,
          topCompanies: ["Google", "Amazon", "Pfizer"],
          lat: 40.0,
          lng: -90.0,
          sectors: ["tech", "business", "health", "other"],
          sectorStats: [
            { label: "Technology", value: 45, color: "#3b82f6" },
            { label: "Business", value: 30, color: "#10b981" },
            { label: "Health", value: 15, color: "#ef4444" },
            { label: "Other", value: 10, color: "#64748b" },
          ],
        },
        {
          id: "sa",
          name: "South America",
          count: 450,
          topCompanies: ["Embraer"],
          lat: -15.0,
          lng: -60.0,
          sectors: ["engineering", "agriculture", "other"],
          sectorStats: [
            { label: "Engineering", value: 60, color: "#f59e0b" },
            { label: "Agriculture", value: 20, color: "#84cc16" },
            { label: "Other", value: 20, color: "#64748b" },
          ],
        },
        {
          id: "eu",
          name: "Europe",
          count: 4500,
          topCompanies: ["Siemens", "SAP", "Bayer"],
          lat: 55.0,
          lng: 9.0,
          sectors: ["engineering", "tech", "health", "law", "other"],
          sectorStats: [
            { label: "Engineering", value: 35, color: "#f59e0b" },
            { label: "Technology", value: 25, color: "#3b82f6" },
            { label: "Law", value: 15, color: "#8b5cf6" },
            { label: "Health", value: 15, color: "#ef4444" },
            { label: "Other", value: 10, color: "#64748b" },
          ],
        },
        {
          id: "tr",
          name: "Turkey (HQ)",
          count: 8500,
          topCompanies: ["THY", "Aselsan"],
          lat: 47.0,
          lng: 18.0,
          sectors: ["all", "engineering", "health", "law", "education", "tech", "finance", "agriculture", "construction", "other"],
          sectorStats: [
            { label: "Engineering", value: 25, color: "#f59e0b" },
            { label: "Health", value: 15, color: "#ef4444" },
            { label: "Technology", value: 15, color: "#3b82f6" },
            { label: "Education", value: 10, color: "#06b6d4" },
            { label: "Law", value: 10, color: "#8b5cf6" },
            { label: "Finance", value: 10, color: "#10b981" },
            { label: "Agriculture", value: 5, color: "#84cc16" },
            { label: "Construction", value: 5, color: "#f97316" },
            { label: "Other", value: 5, color: "#64748b" },
          ],
        },
        {
          id: "africa",
          name: "Africa",
          count: 320,
          topCompanies: ["Naspers"],
          lat: 5.0,
          lng: 20.0,
          sectors: ["tech", "construction", "other"],
          sectorStats: [
            { label: "Technology", value: 40, color: "#3b82f6" },
            { label: "Construction", value: 30, color: "#f97316" },
            { label: "Other", value: 30, color: "#64748b" },
          ],
        },
        {
          id: "asia",
          name: "Asia Pacific",
          count: 850,
          topCompanies: ["Samsung", "Sony"],
          lat: 35.0,
          lng: 90.0,
          sectors: ["tech", "business", "finance", "other"],
          sectorStats: [
            { label: "Technology", value: 55, color: "#3b82f6" },
            { label: "Finance", value: 25, color: "#10b981" },
            { label: "Other", value: 20, color: "#64748b" },
          ],
        },
        {
          id: "au",
          name: "Australia",
          count: 120,
          topCompanies: ["Canva"],
          lat: -52.0,
          lng: 105.0,
          sectors: ["tech", "other"],
          sectorStats: [
            { label: "Software", value: 60, color: "#3b82f6" },
            { label: "Other", value: 40, color: "#64748b" },
          ],
        },
      ],
      events: [
        { 
          title: "Global Alumni Network Summit", 
          dateDay: "15",
          dateMonth: "Jun",
          fullDate: "15 June 2025 09:00",
          loc: "Central Congress Hall", 
          desc: "A major gathering where alumni from all over the world share their experiences and the foundations of new collaborations are laid.",
          type: "Networking",
          image: "https://images.unsplash.com/photo-1571645163064-77faa9676a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG5ldHdvcmtpbmclMjBldmVudCUyMGNvbmZlcmVuY2V8ZW58MXx8fHwxNzY2MjcxNjUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          organizer: "Prof. Dr. Rasim ÖZCAN"
        },
        { 
          title: "Future Technologies Panel", 
          dateDay: "22",
          dateMonth: "May",
          fullDate: "22 May 2025 14:30",
          loc: "Technology Transfer Office", 
          desc: "A visionary panel where AI, blockchain, and sustainable energy technologies will be discussed by leading names in the industry.",
          type: "Technology",
          image: "https://images.unsplash.com/photo-1762968286778-60e65336d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmUlMjB0ZWNobm9sb2d5JTIwYWklMjByb2JvdCUyMGNvbmZlcmVuY2V8ZW58MXx8fHwxNzY2MjcxNjU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          organizer: "Assoc. Prof. Dr. Emre AKADAL"
        },
        { 
          title: "Career Development and Opportunities Fair", 
          dateDay: "10",
          dateMonth: "Oct",
          fullDate: "10 October 2025 10:00",
          loc: "Main Campus Fairground", 
          desc: "A comprehensive career event where internship and job opportunities are presented with the participation of more than 50 industry-leading companies.",
          type: "Career",
          image: "https://images.unsplash.com/photo-1758610840977-8ee55513281c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBmYWlyJTIwY2FyZWVyJTIwZXZlbnQlMjBzdHVkZW50c3xlbnwxfHx8fDE3NjYyNzE2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          organizer: "Assoc. Prof. Dr. Elif KARTAL"
        },
        { 
          title: "Creative Industries Festival", 
          dateDay: "05",
          dateMonth: "Apr",
          fullDate: "05 April 2025 11:00",
          loc: "Art and Design Center", 
          desc: "A festival full of workshops where the most distinguished projects of our alumni in design, architecture, and art are exhibited.",
          type: "Art",
          image: "https://images.unsplash.com/photo-1763909855036-46b3be5085b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9uJTIwZ2FsbGVyeSUyMHVuaXZlcnNpdHl8ZW58MXx8fHwxNzY2MjcxNjYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          organizer: "Assoc. Prof. Dr. Zeki ÖZEN"
        },
        { 
          title: "Leadership and Management Seminar", 
          dateDay: "20",
          dateMonth: "Nov",
          fullDate: "20 November 2025 15:00",
          loc: "Faculty of Business Amphitheater", 
          desc: "A certified seminar where expert executives in crisis management and strategic leadership will present with case studies.",
          type: "Business",
          image: "https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGxlYWRlcnNoaXAlMjBzZW1pbmFyJTIwc3BlYWtlcnxlbnwxfHx8fDE3NjYyNzE2Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          organizer: "Assoc. Prof. Dr. Gökhan ÖVENÇ"
        },
      ],
      stories: [
        {
          name: "Orhan Pamuk",
          title: "Writer",
          desc1: "Studied journalism at Istanbul University.",
          desc2: "Orhan Ferit Pamuk is a Turkish novelist. In addition to many other literary awards, he was awarded the Nobel Prize in Literature in 2006, becoming one of the youngest writers to win this prize at the age of 54.",
          image: orhanPamukImg,
          badge: "Nobel Literature",
          isNobel: true,
          badgeIcon: "Trophy"
        },
        {
          name: "Aziz Sancar",
          title: "Doctor",
          desc1: "Graduated first in his class from Istanbul University Faculty of Medicine in 1969.",
          desc2: "He is a Turkish-American doctor, academic, biochemist, and molecular biologist. He was awarded the Nobel Prize in Chemistry in 2015 for his studies on DNA repair.",
          image: azizSancarImg,
          badge: "Nobel Chemistry",
          isNobel: true,
          badgeIcon: "Trophy"
        },
        {
          name: "Alp İkizler",
          title: "Doctor",
          desc1: "Received his MD degree from Istanbul University Faculty of Medicine.",
          desc2: "He is a nephrologist who holds the Catherine McLaughlin Hakim Chair in Medicine at Vanderbilt University School of Medicine; he conducts clinical trials and heads a research laboratory.",
          image: alpIkizlerImg,
          badge: "Scientist",
          isNobel: false,
          badgeIcon: "Medal"
        }
      ]
    },
  };

  const t = content[language];

  // Menu Links Component to DRY
  const MenuLinks = ({
    className = "",
    onClick,
  }: {
    className?: string;
    onClick?: () => void;
  }) => {
    const links = [
      { id: "events-section", label: t.menu.events },
      { id: "map-section", label: t.menu.network },
      { id: "mentorship-section", label: t.menu.mentorship },
      { id: "success-stories", label: t.menu.stories },
      { id: "footer", label: t.menu.contact },
    ];

    return (
      <>
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveLink(link.id);
              document
                .getElementById(link.id)
                ?.scrollIntoView({ behavior: "smooth" });
              onClick?.();
            }}
            className={`relative group text-sm font-medium text-slate-300 hover:text-blue-400 transition-all duration-300 flex-shrink-0 py-2 ${className} ${activeLink === link.id ? "!text-blue-400" : ""}`}
          >
            {link.label}
            <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all duration-300 ${activeLink === link.id ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"}`} />
          </a>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B1026] text-white overflow-hidden font-sans selection:bg-blue-500/30">
      <Dialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
      >
        <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[850px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-2">
              Kayıt Türünü Seçiniz
            </DialogTitle>
            <DialogDescription className="text-center text-slate-400">
              Devam etmek için lütfen size uygun olan profili
              seçin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <Card
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-blue-500/50 cursor-pointer transition-all group"
              onClick={() => onRegisterClick("student")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">
                    Öğrenci
                  </h3>
                  <p className="text-sm text-slate-400">
                    Halihazırda eğitimine devam eden öğrenciler
                    için.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-purple-500/50 cursor-pointer transition-all group"
              onClick={() => onRegisterClick("alumni")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">
                    Mezun
                  </h3>
                  <p className="text-sm text-slate-400">
                    İstanbul Üniversitesi'nden mezun olmuş
                    kişiler için.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-green-500/50 cursor-pointer transition-all group"
              onClick={() => onRegisterClick("staff")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">
                    Personel
                  </h3>
                  <p className="text-sm text-slate-400">
                    Akademik veya idari personel için.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
      >
        <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[600px] p-0 overflow-hidden">
          {selectedEvent && (
            <>
               <div className="relative h-48 w-full">
                  <img 
                    src={selectedEvent.image} 
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                      {selectedEvent.type}
                    </span>
                    <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight">
                      {selectedEvent.title}
                    </DialogTitle>
                  </div>
               </div>
               <div className="p-6">
                 <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-400">
                    <div className="flex items-center">
                       <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                       {selectedEvent.fullDate}
                    </div>
                    <div className="flex items-center">
                       <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                       {selectedEvent.loc}
                    </div>
                    <div className="flex items-center w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                       <User className="w-4 h-4 mr-2 text-emerald-400" />
                       <span className="font-semibold text-slate-200 mr-2">{t.eventDialog.organizer}:</span>
                       <span className="text-white">{selectedEvent.organizer}</span>
                    </div>
                 </div>
                 
                 <DialogDescription className="text-slate-300 text-base leading-relaxed mb-8">
                   {selectedEvent.desc}
                 </DialogDescription>

                 <div className="flex justify-end gap-3">
                   <Button 
                     variant="ghost" 
                     onClick={() => setIsEventDialogOpen(false)}
                     className="text-slate-400 hover:text-white hover:bg-white/10"
                   >
                     {t.eventDialog.close}
                   </Button>
                   <Button 
                     onClick={() => {
                       setIsEventDialogOpen(false);
                       onLoginClick();
                     }}
                     className="bg-blue-600 hover:bg-blue-700 text-white"
                   >
                     {t.eventDialog.loginToJoin}
                     <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                 </div>
               </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1026]/90 backdrop-blur-md border-b border-white/20 transition-all duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          {/* Main Top Bar */}
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer relative"
              onClick={() => setIsLogoHovered(!isLogoHovered)}
            >
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center p-1 z-[60] relative shadow-lg">
                <img
                  src={logoSrc}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: isLogoHovered
                    ? "min(500px, calc(100vw - 60px))"
                    : 0,
                  opacity: isLogoHovered ? 1 : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-20 bg-white rounded-r-xl rounded-l-3xl flex items-center overflow-hidden shadow-2xl z-[50] pl-20"
                style={{ pointerEvents: "none" }}
              >
                <div className="flex items-center justify-center w-full h-full pr-6 py-3">
                  <img
                    src={atsTextLogo}
                    alt="Alumni Tracking System"
                    className="h-full w-auto max-w-full object-contain"
                  />
                </div>
              </motion.div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              <MenuLinks />
            </div>

            {/* Buttons (Visible on Mobile too) */}
            <div className="flex items-center gap-2 sm:gap-4 relative z-20">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-4"
                onClick={onLoginClick}
              >
                {t.login}
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4"
                onClick={() => setIsRegisterDialogOpen(true)}
              >
                {t.register}
              </Button>
              <div className="w-px h-6 bg-white/20 mx-1 hidden sm:block"></div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setLanguage((prev) =>
                    prev === "TR" ? "EN" : "TR",
                  );
                }}
                className="text-slate-300 hover:text-white hover:bg-white/10 min-w-[3rem] px-2"
              >
                <Globe className="w-4 h-4 mr-1.5" />
                {language === "TR" ? "EN" : "TR"}
              </Button>
            </div>
          </div>

          {/* Mobile Horizontal Scroll Menu (Visible only on lg and below) */}
          <div className="lg:hidden w-full overflow-x-auto no-scrollbar pb-3 border-t border-white/5 pt-3">
            <div className="flex items-center gap-6 px-1 min-w-max">
              <MenuLinks className="text-slate-400 hover:text-white text-sm" />
            </div>
          </div>
        </div>
      </nav>

      {/* Adjusted top padding for header content to account for double-height nav on mobile */}
      <motion.div 
        style={{ 
          scale: heroScale, 
          opacity: heroOpacity, 
          filter: heroFilter,
          y: heroY,
          rotateX: heroRotateX,
          perspective: 1000 // 3D Derinlik için gerekli
        }}
        className="relative pt-44 pb-12 sm:pt-40 sm:pb-16 min-h-[70vh] flex items-center overflow-hidden bg-[rgba(0,0,0,0)] origin-top will-change-transform"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1026] via-[#111835] to-[#0B1026]" />
          <svg
            className="absolute w-full h-full opacity-40"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient
                id="connection-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <g fill="#3b82f6" fillOpacity="0.2">
              {[...Array(40)].map((_, i) => (
                <circle
                  key={`dot-${i}`}
                  cx={Math.random() * 1200}
                  cy={Math.random() * 800}
                  r={Math.random() * 2 + 1}
                />
              ))}
            </g>
            <path
              d="M200,400 Q600,100 1000,400"
              fill="none"
              stroke="url(#connection-gradient)"
              strokeWidth="2"
              strokeDasharray="10 10"
              className="animate-[dash_20s_linear_infinite]"
            />
            <circle
              cx="200"
              cy="400"
              r="4"
              fill="#60A5FA"
              className="animate-ping"
            />
            <circle
              cx="1000"
              cy="400"
              r="4"
              fill="#60A5FA"
              className="animate-ping"
              style={{ animationDelay: "1.5s" }}
            />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              {t.heroTitle.split(",").map((part, i) => (
                <span
                  key={i}
                  className={`block ${i === 1 ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 pb-2" : "text-white"}`}
                >
                  {part}
                  {i === 0 ? "," : ""}
                </span>
              ))}
            </h1>
            <p className="mt-2 max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-8 leading-relaxed">
              {t.heroDesc}
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
              onClick={() => setIsRegisterDialogOpen(true)}
            >
              {t.start} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="py-6 sm:py-8 bg-slate-900/50 border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-8 rounded-[0px]">
            <StatCard
              icon={
                <GraduationCap className="w-6 h-6 text-blue-400" />
              }
              val={12450}
              suffix="+"
              label={language === "TR" ? "Mezun" : "Graduates"}
            />
            <StatCard
              icon={
                <MapPin className="w-6 h-6 text-purple-400" />
              }
              val={42}
              label={
                language === "TR"
                  ? "Ülkede Aktif"
                  : "Countries Active"
              }
            />
            <StatCard
              icon={
                <Building2 className="w-6 h-6 text-emerald-400" />
              }
              val={3200}
              suffix="+"
              label={
                language === "TR"
                  ? "Çalışılan Şirket"
                  : "Companies"
              }
            />
            <StatCard
              icon={
                <Handshake className="w-6 h-6 text-orange-400" />
              }
              val={850}
              suffix="+"
              label={
                language === "TR"
                  ? "Mentorluk Eşleşmesi"
                  : "Mentorship Matches"
              }
            />
          </div>
          <div className="text-center mt-4 sm:mt-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
              {t.statsTitle}
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-blue-500 mx-auto rounded-full" />
          </div>
        </div>

        {/* Events Slider Section */}
        <div id="events-section" className="py-12 bg-[#0B1026] border-b border-white/5 overflow-hidden scroll-mt-40 lg:scroll-mt-24">
          <div className="text-center mb-8 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.eventsSection.title}</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">{t.eventsSection.subtitle}</p>
          </div>
          
          <div className="relative w-full px-4 sm:px-12">
              {/* Fade Overlay for Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 z-20 bg-gradient-to-r from-[#0B1026] to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 z-20 bg-gradient-to-l from-[#0B1026] to-transparent pointer-events-none"></div>

              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 3000,
                    stopOnMouseEnter: true,
                    stopOnInteraction: false,
                  }),
                ]}
                className="w-full"
              >
                <CarouselContent>
                  {[...backendEvents, ...t.events].map((event, i) => (
                    <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4">
                      <div className="h-full py-2 px-1">
                        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col h-[340px] shadow-lg group hover:border-blue-500/50 transition-colors">
                          {/* Image Section */}
                          <div className="relative h-48 w-full overflow-hidden">
                             <img 
                               src={event.image} 
                               alt={event.title} 
                               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                             />
                             {/* Date Badge */}
                             <div className="absolute top-0 right-0 bg-[#0B1026] text-white w-14 h-16 flex flex-col items-center justify-center z-10 border-b border-l border-slate-700">
                                <span className="text-xl font-bold leading-none">{event.dateDay}</span>
                                <span className="text-xs font-medium mt-1">{event.dateMonth}</span>
                             </div>
                             {/* Type Badge (Overlay) */}
                             <div className="absolute top-3 left-3 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-sm shadow-sm">
                                {event.type}
                             </div>
                          </div>
                          
                          {/* Content Section */}
                          <div className="p-5 flex flex-col flex-1 bg-slate-800">
                             <h3 className="text-white text-lg font-bold leading-tight mb-2 line-clamp-2 min-h-[3.5rem]">
                               {event.title}
                             </h3>
                             <div className="flex-1"></div>
                             
                             {/* Footer */}
                             <div className="pt-4 border-t border-slate-700 mt-auto">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setIsEventDialogOpen(true);
                                  }}
                                  className="w-full h-9 bg-slate-700 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold rounded transition-colors"
                                >
                                  {t.eventsSection.goToEvent}
                                </Button>
                             </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-6 bg-slate-800 hover:bg-blue-600 text-white border border-slate-700 hover:border-blue-500 h-10 w-10 rounded-full transition-all shadow-lg hover:shadow-blue-900/40 z-20">
                  <ChevronLeft className="w-5 h-5" />
                </CarouselPrevious>
                <CarouselNext className="hidden md:flex -right-6 bg-slate-800 hover:bg-blue-600 text-white border border-slate-700 hover:border-blue-500 h-10 w-10 rounded-full transition-all shadow-lg hover:shadow-blue-900/40 z-20">
                  <ChevronRight className="w-5 h-5" />
                </CarouselNext>
              </Carousel>

              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === current 
                        ? "w-8 bg-blue-500" 
                        : "w-2 bg-slate-700 hover:bg-slate-600"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
          </div>
        </div>
      </div>

      <div id="map-section" className="relative scroll-mt-40 lg:scroll-mt-24">
        {/* Title Section */}
        <div className="pt-6 pb-2 sm:pt-10 sm:pb-4 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2"
          >
            {t.mapSection.title}
          </motion.h2>
          <p className="text-blue-300 font-medium tracking-wide uppercase text-xs sm:text-sm mb-2 sm:mb-4">
            {t.mapSection.subtitle}
          </p>
        </div>

        {/* Dark Background Section containing Filters and Map */}
        <div className="bg-[#080c1e] pb-16 pt-8 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto justify-start sm:justify-center gap-3 mb-8 pb-4 no-scrollbar">
              {[
                "all",
                "engineering",
                "tech",
                "business",
                "health",
                "law",
                "education",
                "finance",
                "agriculture",
                "construction",
                "other",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSector(s as Sector)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 border ${
                    selectedSector === s 
                      ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-105 z-10" 
                      : "bg-[#080c1e] border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  {t.sectorLabels[s] || s}
                </button>
              ))}
            </div>

            <div
              className="relative w-full aspect-[2/1] bg-[#0B1026] rounded-3xl border border-white/10 shadow-2xl overflow-hidden group"
              onClick={() => setActiveRegion(null)}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-[#0B1026]">
                <div
                  className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-[length:100%_100%] bg-no-repeat"
                  style={{
                    filter:
                      "invert(33%) sepia(95%) saturate(1873%) hue-rotate(207deg) brightness(95%) contrast(101%) drop-shadow(0 0 20px rgba(37, 99, 235, 0.4))",
                    opacity: 0.85,
                  }}
                ></div>
                <motion.div
                  className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400/80 to-transparent shadow-[0_0_15px_rgba(96,165,250,0.6)]"
                  animate={{
                    top: ["0%", "100%"],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* --- Network Connection Lines (SVG Layer - Straight) --- */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {mapConnections.map(
                    ([startId, endId], index) => {
                      const startRegion = t.mapRegions.find(
                        (r) => r.id === startId,
                      );
                      const endRegion = t.mapRegions.find(
                        (r) => r.id === endId,
                      );

                      if (!startRegion || !endRegion)
                        return null;

                      const startPos = getPos(
                        startRegion.lat,
                        startRegion.lng,
                      );
                      const endPos = getPos(
                        endRegion.lat,
                        endRegion.lng,
                      );

                      // Bağlantı görünürlük mantığı: Her iki uç nokta da haritada görünürse çizgi de görünür.
                      const isStartVisible =
                        selectedSector === "all" ||
                        startRegion.sectors.includes("all") ||
                        startRegion.sectors.includes(
                          selectedSector,
                        );
                      const isEndVisible =
                        selectedSector === "all" ||
                        endRegion.sectors.includes("all") ||
                        endRegion.sectors.includes(
                          selectedSector,
                        );
                      const isConnectionVisible =
                        isStartVisible && isEndVisible;

                      return (
                        <motion.g
                          key={`${startId}-${endId}`}
                          initial={false}
                          animate={{
                            opacity: isConnectionVisible
                              ? 1
                              : 0,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Base Line (Static) */}
                          <line
                            x1={`${startPos.x}%`}
                            y1={`${startPos.y}%`}
                            x2={`${endPos.x}%`}
                            y2={`${endPos.y}%`}
                            stroke="#3b82f6"
                            strokeWidth="1"
                            strokeOpacity="0.15"
                          />
                          {/* Animated Data Flow Line */}
                          <motion.line
                            x1={`${startPos.x}%`}
                            y1={`${startPos.y}%`}
                            x2={`${endPos.x}%`}
                            y2={`${endPos.y}%`}
                            stroke="#60a5fa"
                            strokeWidth="1.5"
                            strokeOpacity="0.6"
                            strokeDasharray="4 20"
                            initial={{ strokeDashoffset: 0 }}
                            animate={{ strokeDashoffset: -24 }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        </motion.g>
                      );
                    },
                  )}
                </svg>
              </div>

              {t.mapRegions.map((region) => {
                // --- KULLANICININ İSTEDİĞİ HESAPLAMA YÖNTEMİ ---
                const { x, y } = getPos(region.lat, region.lng);
                // Eğer seçili sektör 'all' ise HEPSİNİ göster.
                // Eğer bölgenin sektörlerinde 'all' varsa (Örn: Merkez Türkiye) HER ZAMAN göster.
                // Aksi takdirde, seçili sektör bölgenin sektör listesinde var mı diye bak.
                const isVisible =
                  selectedSector === "all" ||
                  region.sectors.includes("all") ||
                  region.sectors.includes(selectedSector);

                return (
                  <motion.div
                    key={region.id}
                    className="absolute cursor-pointer z-10"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: isVisible ? 1 : 0,
                      opacity: isVisible ? 1 : 0,
                    }}
                    whileHover={{ scale: 1.2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRegion(region);
                    }}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                      <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
                      <div
                        className={`w-3 h-3 rounded-full border-2 ${activeRegion?.id === region.id ? "bg-white border-blue-500" : "bg-blue-600 border-white"}`}
                      />

                      {/* Label (Visible on mobile, hover on desktop) */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-[8px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded backdrop-blur-md border border-white/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pointer-events-none z-20 ${
                          region.id === "eu"
                            ? "bottom-3 sm:bottom-auto sm:top-6"
                            : "top-3 sm:top-6"
                        }`}
                      >
                        {region.name}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Region Detail Card (Ultra Compact Mobile Floating) */}
              <AnimatePresence>
                {activeRegion && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      damping: 25,
                      stiffness: 300,
                    }}
                    className="absolute bottom-2 left-2 right-2 sm:bottom-auto sm:top-6 sm:left-auto sm:right-6 sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 rounded-xl shadow-2xl z-30 overflow-hidden"
                  >
                    <div className="p-1.5 sm:p-3 relative">
                      {/* Close Button - Absolute Positioned */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveRegion(null);
                        }}
                        className="absolute top-1.5 right-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 p-1 sm:p-2 rounded-full transition-colors z-20 shadow-lg border border-white/10"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="sm:w-4 sm:h-4"
                        >
                          <line
                            x1="18"
                            y1="6"
                            x2="6"
                            y2="18"
                          ></line>
                          <line
                            x1="6"
                            y1="6"
                            x2="18"
                            y2="18"
                          ></line>
                        </svg>
                      </button>

                      {/* Compact Header Area */}
                      <div className="pr-5 mb-0.5 sm:mb-2">
                        <h3 className="text-[11px] sm:text-xl font-bold text-white leading-tight">
                          {activeRegion.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0">
                          <span className="text-[8px] sm:text-xs text-blue-400 font-medium">
                            Toplam Mezun:
                          </span>
                          <span className="text-[9px] sm:text-sm font-bold text-white">
                            {activeRegion.count.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Sector Stats - Mini Bar Chart */}
                      <div className="mb-0.5 sm:mb-2">
                        <div className="space-y-[1px] sm:space-y-1">
                          {activeRegion.sectorStats
                            .slice(0, 4)
                            .map((stat, i) => (
                              <div
                                key={i}
                                className="flex items-center text-[8px] sm:text-xs group/stat"
                              >
                                <span className="w-12 sm:w-16 text-slate-300 truncate font-medium">
                                  {stat.label}
                                </span>
                                <div className="flex-1 h-[2px] sm:h-1.5 bg-white/5 rounded-full mx-1 sm:mx-1.5 overflow-hidden relative">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${stat.value}%`,
                                    }}
                                    transition={{
                                      duration: 0.8,
                                      delay: i * 0.1,
                                    }}
                                    className="absolute left-0 top-0 bottom-0 rounded-full"
                                    style={{
                                      backgroundColor: stat.color,
                                    }}
                                  />
                                </div>
                                <span className="w-6 sm:w-8 text-right text-slate-400 font-medium">
                                  %{stat.value}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Top Companies - Tags */}
                      <div className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-white/5">
                        <div className="flex flex-wrap gap-1">
                          {activeRegion.topCompanies.map(
                            (company, i) => (
                              <span
                                key={i}
                                className="text-[7px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20"
                              >
                                {company}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div id="mentorship-section" className="relative py-20 bg-[#0B1026] overflow-hidden scroll-mt-40 lg:scroll-mt-24">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <Sparkles className="w-3 h-3" />
              {t.mentorshipSection.badge}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight"
            >
              {t.mentorshipSection.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg leading-relaxed"
            >
              {t.mentorshipSection.subtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10">
            {/* Left Column: AI Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-[500px] mx-auto">
                {/* Central AI Brain */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="relative w-32 h-32 bg-slate-900 rounded-full border border-blue-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                    <BrainCircuit className="w-16 h-16 text-blue-400 animate-pulse" />
                    {/* Orbiting dots */}
                    <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60A5FA]"></div>
                    </div>
                  </div>
                </div>

                {/* Connecting Nodes */}
                <svg
                  className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                  viewBox="0 0 400 400"
                >
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#3b82f6"
                        stopOpacity="0"
                      />
                      <stop
                        offset="50%"
                        stopColor="#3b82f6"
                        stopOpacity="0.5"
                      />
                      <stop
                        offset="100%"
                        stopColor="#3b82f6"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  {/* Lines from center to corners */}
                  <line
                    x1="200"
                    y1="200"
                    x2="80"
                    y2="80"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                  />
                  <line
                    x1="200"
                    y1="200"
                    x2="320"
                    y2="80"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                  />
                  <line
                    x1="200"
                    y1="200"
                    x2="80"
                    y2="320"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                  />
                  <line
                    x1="200"
                    y1="200"
                    x2="320"
                    y2="320"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                  />
                </svg>

                {/* Floating Profile Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-10 left-10 z-20 bg-slate-800/80 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3 w-40"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="h-2 w-16 bg-white/20 rounded mb-1.5"></div>
                    <div className="h-1.5 w-10 bg-white/10 rounded"></div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute bottom-10 right-10 z-20 bg-slate-800/80 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3 w-40"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="h-2 w-16 bg-white/20 rounded mb-1.5"></div>
                    <div className="h-1.5 w-10 bg-white/10 rounded"></div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/2 left-10 z-20 bg-green-500/10 backdrop-blur-md px-3 py-1 rounded-full border border-green-500/30 text-green-400 text-xs font-bold"
                >
                  %98 Eşleşme
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column: Benefits */}
            <div className="space-y-6">
              {t.mentorshipSection.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      {feature.icon === "BookOpen" && (
                        <BookOpen className="w-6 h-6 text-blue-400" />
                      )}
                      {feature.icon === "MessageCircle" && (
                        <MessageCircle className="w-6 h-6 text-blue-400" />
                      )}
                      {feature.icon === "Landmark" && (
                        <Landmark className="w-6 h-6 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg shadow-blue-900/20 group text-base"
              onClick={() => onRegisterClick("student")}
            >
              <Rocket className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
              {t.mentorshipSection.ctaStudent}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 border-white/10 text-slate-200 hover:bg-white/5 hover:text-white group text-base bg-transparent"
              onClick={() => onRegisterClick("alumni")}
            >
              <Handshake className="w-5 h-5 mr-2 text-purple-400" />
              {t.mentorshipSection.ctaAlumni}
            </Button>
          </motion.div>
        </div>
      </div>

      <div id="success-stories" className="relative py-20 bg-[#0B1026] overflow-hidden scroll-mt-40 lg:scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              {t.menu.stories}
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              İstanbul Üniversitesi mezunlarının küresel başarı hikayeleriyle ilham alın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.stories.map((story, index) => (
              <div key={index} className="relative group">
                {/* Altın Köşe Şeridi (Sadece Nobel Ödüllüler için) */}
                {story.isNobel && (
                  <div className="absolute -top-3 -right-3 z-20 overflow-hidden w-24 h-24 pointer-events-none">
                    <div className="absolute top-0 right-0 bg-yellow-500 text-[#0B1026] text-[10px] font-bold py-1 w-32 text-center rotate-45 translate-x-[28px] translate-y-[18px] shadow-lg">
                      {language === "TR" ? "NOBEL ÖDÜLLÜ" : "NOBEL PRIZE"}
                    </div>
                  </div>
                )}
                
                <div className={`h-full bg-slate-900/50 border rounded-2xl p-6 relative overflow-hidden transition-colors ${
                  story.isNobel 
                    ? "border-yellow-500/30 hover:border-yellow-500/50" 
                    : "border-white/10 hover:border-blue-500/30"
                }`}>
                  {/* Profil */}
                  <div className="flex flex-col items-center mb-6">
                    <div className={`w-32 h-32 rounded-full p-1 mb-4 ${
                      story.isNobel 
                        ? "bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-[0_0_20px_rgba(234,179,8,0.3)]" 
                        : "bg-gradient-to-b from-slate-700 to-slate-900"
                    }`}>
                      <img 
                        src={story.image} 
                        alt={story.name} 
                        className="w-full h-full rounded-full object-cover border-4 border-[#0B1026]"
                      />
                    </div>
                    
                    {/* Badge */}
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
                      story.isNobel
                        ? "bg-green-900/30 border border-green-500/30 text-green-400"
                        : "bg-blue-900/30 border border-blue-500/30 text-blue-400"
                    }`}>
                      {story.badgeIcon === "Trophy" ? <Trophy className="w-3 h-3" /> : <Medal className="w-3 h-3" />}
                      {story.badge}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">{story.name}</h3>
                    <span className="text-sm text-slate-400 font-medium">{story.title}</span>
                  </div>

                  {/* İçerik */}
                  <div className="text-center space-y-4">
                    <p className="text-white font-medium text-sm border-b border-white/10 pb-4">
                      {story.desc1}
                    </p>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {story.desc2}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer id="footer" className="bg-[#050814] border-t border-white/10 pt-16 pb-8 scroll-mt-40 lg:scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center p-0.5">
                  <img
                    src={logoSrc}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Alumni Tracking
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t.footer.desc}
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">
                {language === "TR" ? "Kurumsal" : "Corporate"}
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white text-sm"
                  >
                    {t.footer.about}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white text-sm"
                  >
                    {t.footer.policy}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white text-sm"
                  >
                    {t.footer.privacy}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">
                {t.footer.contact}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-400 text-sm">
                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                  alumni@istanbul.edu.tr
                </li>
                <li className="flex items-center text-slate-400 text-sm">
                  <Phone className="w-4 h-4 mr-2 text-blue-500" />
                  +90 212 *** ** **
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">
                {language === "TR"
                  ? "Bizi Takip Edin"
                  : "Follow Us"}
              </h4>
              <div className="flex gap-4">
                <SocialIcon icon={<Linkedin />} />
                <SocialIcon icon={<Twitter />} />
                <SocialIcon icon={<Instagram />} />
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} İstanbul
              Üniversitesi.{" "}
              {language === "TR"
                ? "Tüm hakları saklıdır."
                : "All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helpers
function StatCard({
  icon,
  val,
  suffix = "",
  label,
}: {
  icon: any;
  val: number;
  suffix?: string;
  label: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-[#0B1026] border border-white/10 hover:border-blue-500/30 transition-colors group flex flex-row sm:flex-col items-center sm:justify-center text-left sm:text-center"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-auto sm:ml-auto mb-0 sm:mb-4 group-hover:bg-blue-500/10 transition-colors flex-shrink-0">
        {React.cloneElement(icon, {
          className: `w-5 h-5 sm:w-6 sm:h-6 ${icon.props.className?.replace(/w-\d+ h-\d+/, "") || ""}`,
        })}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-base sm:text-2xl lg:text-4xl font-bold text-white mb-0 sm:mb-1 truncate">
          <AnimatedCounter value={val} suffix={suffix} />
        </div>
        <p className="text-slate-400 text-[10px] sm:text-sm leading-tight px-0 sm:px-1 truncate">{label}</p>
      </div>
    </motion.div>
  );
}

function SocialIcon({ icon }: { icon: any }) {
  return (
    <a
      href="#"
      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-all group"
    >
      {React.cloneElement(icon, {
        className:
          "w-5 h-5 text-slate-300 group-hover:text-white",
      })}
    </a>
  );
}
