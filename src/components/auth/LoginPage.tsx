import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowLeft, Mail, Lock, Book, Building2, Linkedin, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import atsLogo from 'figma:asset/e53d33bd8a04eb6599952774279c21a71eb10311.png';
import campusImage from 'figma:asset/f70b09dcd982b2c0fdcd152053c81b1777af4a27.png';
import atsTextLogo from 'figma:asset/79a4cfd51a3fd9a18f673dbd4107cd65848f3c2c.png';

interface LoginPageProps {
  role?: 'student' | 'alumni' | 'admin' | 'staff';
  onLogin: (role: 'student' | 'alumni' | 'admin' | 'staff') => void;
  onRegisterClick: (role: string) => void;
  onBack: () => void;
}

export function LoginPage({ role = 'student', onLogin, onRegisterClick, onBack }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<string>(role);
  const [loginMethod, setLoginMethod] = useState<'mail' | 'aksis'>('mail');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // Rol değiştiğinde formu temizle
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, [activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin(activeTab as 'student' | 'alumni' | 'admin' | 'staff');
    }, 1500);
  };

  const handleLinkedInLogin = () => {
    setIsLinkedInLoading(true);
    // Mock LinkedIn Auth flow
    setTimeout(() => {
        setIsLinkedInLoading(false);
        // LinkedIn ile giriş yapıldığında aktif tab rolü ile giriş yap
        onLogin(activeTab as 'alumni' | 'staff');
    }, 2000);
  }

  return (
    <div className="h-screen bg-[#0B1026] flex overflow-hidden">
      {/* Sol Panel - Görsel ve Alıntı */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative bg-slate-900 overflow-hidden">
        {/* Arkaplan Resmi */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 ease-in-out hover:scale-105"
          style={{ 
            backgroundImage: `url(${campusImage})`,
          }}
        >
           <div className="absolute inset-0 bg-blue-950/60 mix-blend-multiply" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026] via-transparent to-transparent" />
        </div>

        {/* Logo Sol Üst - Animasyonlu */}
        <div 
            className="absolute top-12 left-12 z-20 flex items-center gap-3 cursor-pointer"
            onClick={() => setIsLogoHovered(!isLogoHovered)}
        >
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl relative z-20">
               <img src={atsLogo} alt="Logo" className="w-full h-full object-cover" />
             </div>
             
             <motion.span 
               animate={{ opacity: isLogoHovered ? 0 : 1, x: isLogoHovered ? 10 : 0 }}
               transition={{ duration: 0.3 }}
               className="text-xl font-bold tracking-wide text-white drop-shadow-md whitespace-nowrap"
             >
               Platform
             </motion.span>

             {/* Animated Expandable Panel */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ 
                  width: isLogoHovered ? 420 : 0, 
                  opacity: isLogoHovered ? 1 : 0 
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-20 bg-white rounded-r-2xl rounded-l-[2rem] flex items-center overflow-hidden shadow-2xl z-10 pl-20"
                style={{ pointerEvents: 'none' }} 
              >
                <div className="flex items-center pr-8 min-w-[340px]">
                  <img src={atsTextLogo} alt="Alumni Tracking System" className="h-12 w-auto object-contain" />
                </div>
              </motion.div>
        </div>

        {/* İçerik Sol Alt */}
        <div className="absolute bottom-12 left-12 right-12 z-10 text-white">
          <div className="mb-8">
            <h2 className="text-xl font-light leading-relaxed italic opacity-95 mb-6 text-white drop-shadow-lg">
              "Üniversite mezunlarımızın kariyer yolculuklarını takip etmek ve öğrencilerimize mentorluk sağlamak hiç bu kadar etkili olmamıştı."
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0B1026] bg-slate-700 flex items-center justify-center text-xs font-bold relative">
                   <img 
                     src={`https://i.pravatar.cc/150?u=${i+10}`} 
                     alt="User" 
                     className="w-full h-full rounded-full object-cover"
                   />
                 </div>
               ))}
            </div>
            <div>
              <p className="text-md font-bold text-white drop-shadow-md">10,000+ Mezun</p>
              <p className="text-xs text-slate-200 drop-shadow-md">Platformu aktif kullanıyor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Panel - Form */}
      <div className="w-full lg:w-1/2 h-full relative bg-[#0B1026] overflow-y-auto">
        
        {/* Sabit Ana Sayfa Butonu */}
        <div className="absolute top-6 left-6 sm:left-12 z-20">
            <Button 
            variant="ghost" 
            className="text-slate-300 hover:text-white pl-0" 
            onClick={onBack}
            >
            <ArrowLeft className="mr-2 h-4 w-4" /> Ana Sayfa
            </Button>
        </div>

        {/* Form İçeriği - Sabit Üst Boşluk (pt-32) ile Başlık Oynaması Engellendi */}
        <div className="w-full max-w-md mx-auto px-6 sm:px-12 pt-32 pb-12 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Hoş Geldiniz</h1>
            <p className="text-slate-300 mb-8 font-medium">Giriş yapmak için lütfen rolünüzü seçin.</p>

            <div className="mb-8">
              <Label className="text-slate-200 font-medium mb-3 block">Giriş Türü</Label>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-900 p-1 border border-slate-700">
                  <TabsTrigger 
                    value="admin" 
                    className="text-slate-400 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:font-semibold transition-all hover:text-slate-200"
                  >
                    Yönetici
                  </TabsTrigger>
                  <TabsTrigger 
                    value="staff" 
                    className="text-slate-400 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:font-semibold transition-all hover:text-slate-200"
                  >
                    Personel
                  </TabsTrigger>
                  <TabsTrigger 
                    value="alumni" 
                    className="text-slate-400 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:font-semibold transition-all hover:text-slate-200"
                  >
                    Mezun
                  </TabsTrigger>
                  <TabsTrigger 
                    value="student" 
                    className="text-slate-400 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:font-semibold transition-all hover:text-slate-200"
                  >
                    Öğrenci
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                      {/* Öğrenci için Giriş Yöntemi Seçimi */}
                      {activeTab === 'student' && (
                        <div className="space-y-3">
                          <Label className="text-slate-200 font-medium">Giriş Yöntemi</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div 
                              onClick={() => setLoginMethod('mail')}
                              className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all ${loginMethod === 'mail' ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700 bg-slate-900/40 hover:bg-slate-800'}`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${loginMethod === 'mail' ? 'border-blue-500' : 'border-slate-400'}`}>
                                {loginMethod === 'mail' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                              </div>
                              <span className={`text-sm font-medium ${loginMethod === 'mail' ? 'text-white' : 'text-slate-300'}`}>Kurumsal Mail</span>
                            </div>
                            <div 
                              onClick={() => setLoginMethod('aksis')}
                              className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all ${loginMethod === 'aksis' ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700 bg-slate-900/40 hover:bg-slate-800'}`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${loginMethod === 'aksis' ? 'border-blue-500' : 'border-slate-400'}`}>
                                {loginMethod === 'aksis' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                              </div>
                              <span className={`text-sm font-medium ${loginMethod === 'aksis' ? 'text-white' : 'text-slate-300'}`}>AKSİS</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-slate-200 font-medium">
                            {activeTab === 'student' ? (loginMethod === 'mail' ? 'Öğrenci Maili' : 'Öğrenci Numarası') : 'E-posta Adresi'}
                          </Label>
                          <div className="relative">
                            {activeTab === 'student' && loginMethod === 'aksis' ? (
                              <Book className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            ) : (
                              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            )}
                            <Input 
                              id="email" 
                              type={activeTab === 'student' && loginMethod === 'aksis' ? "text" : "email"}
                              placeholder={activeTab === 'student' ? (loginMethod === 'mail' ? "ogrenci@ogr.iu.edu.tr" : "Örn: 202312345") : "ad.soyad@example.com"}
                              className="pl-10 h-11 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-slate-200 font-medium">
                            {activeTab === 'student' && loginMethod === 'aksis' ? 'AKSİS Şifresi' : 'Şifre'}
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <Input 
                              id="password" 
                              type="password" 
                              placeholder="••••••••" 
                              className="pl-10 h-11 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="flex justify-end">
                            <a href="#" className="text-sm text-blue-400 hover:text-blue-300 font-medium">Şifremi unuttum?</a>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="remember" 
                          className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-600 w-4 h-4" 
                        />
                        <label htmlFor="remember" className="text-sm text-slate-300 font-medium cursor-pointer">Beni hatırla</label>
                      </div>

                      <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-all shadow-lg shadow-blue-900/20" disabled={isLoading || isLinkedInLoading}>
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Giriş Yapılıyor...</span>
                          </div>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Giriş Yap <ArrowLeft className="rotate-180 w-4 h-4" />
                          </span>
                        )}
                      </Button>
                  </motion.div>
                </AnimatePresence>

              {(activeTab === 'alumni' || activeTab === 'staff') && (
                <>
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#0B1026] px-2 text-slate-400 font-medium">Veya şununla devam et</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={handleLinkedInLogin}
                    disabled={isLoading || isLinkedInLoading}
                    className="w-full h-11 bg-slate-900/60 border-slate-700 text-white hover:bg-slate-800 hover:text-white transition-all font-medium relative overflow-hidden"
                  >
                     {isLinkedInLoading ? (
                        <div className="flex items-center justify-center gap-2">
                           <div className="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
                           <span>Bağlanıyor...</span>
                        </div>
                     ) : (
                        <>
                           <Linkedin className="mr-2 h-4 w-4 text-blue-500" /> LinkedIn ile Devam Et
                        </>
                     )}
                  </Button>
                </>
              )}

              <p className="text-center text-sm text-slate-400 mt-8">
                Hesabınız yok mu?{" "}
                <button type="button" onClick={() => onRegisterClick(activeTab)} className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-all">
                  Kayıt Ol
                </button>
              </p>
            </form>
          </motion.div>
        </div>
        
        {/* Footer info - Mobilde görünür */}
        <div className="py-6 text-center lg:hidden">
           <p className="text-xs text-slate-500 font-medium">
             © 2025 Mezun Takip Sistemi.
           </p>
        </div>
      </div>
    </div>
  );
}