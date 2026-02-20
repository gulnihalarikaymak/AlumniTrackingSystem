import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { GraduationCap, ArrowLeft, Mail, Lock, User, Calendar, Book, Building, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import atsLogo from 'figma:asset/e53d33bd8a04eb6599952774279c21a71eb10311.png';

interface RegisterPageProps {
  role: 'student' | 'alumni' | 'staff';
  onRegisterSuccess: () => void;
  onLoginClick: () => void;
  onBack: () => void;
}

export function RegisterPage({ role, onRegisterSuccess, onLoginClick, onBack }: RegisterPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isStudent = role === 'student';
  const isStaff = role === 'staff';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock register delay
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0B1026] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://cdn.istanbul.edu.tr/FileHandler.ashx?f=R-L-Y6xTU0iJqPq0m5yRzA')] bg-cover bg-center opacity-10 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md z-10"
      >
        <Button variant="ghost" className="text-slate-400 hover:text-white mb-4 pl-0" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Ana Sayfaya Dön
        </Button>

        <Card className="bg-slate-900/95 border-slate-800 text-slate-100 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-900/50 p-2 overflow-hidden">
              <img 
                src={atsLogo} 
                alt="Alumni Tracking System" 
                className="w-full h-full object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold">
              {isStudent ? "Öğrenci Kaydı" : isStaff ? "Personel Kaydı" : "Mezun Kaydı"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              İstanbul Üniversitesi ailesine katılın.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input 
                      id="name" 
                      placeholder="Adınız" 
                      className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Soyad</Label>
                  <Input 
                    id="surname" 
                    placeholder="Soyadınız" 
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{isStudent ? 'Öğrenci Maili' : 'E-posta Adresi'}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder={isStudent ? "no@ogr.iu.edu.tr" : "ad.soyad@example.com"} 
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              {isStudent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="studentNo">Öğrenci Numarası</Label>
                    <div className="relative">
                      <Book className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input 
                        id="studentNo" 
                        placeholder="Örn: 2023..." 
                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty">Fakülte</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input 
                        id="faculty" 
                        placeholder="Örn: Mühendislik Fakültesi" 
                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : isStaff ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="department">Departman / Birim</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input 
                        id="department" 
                        placeholder="Örn: Bilgi İşlem Daire Bşk." 
                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Ünvan</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input 
                        id="title" 
                        placeholder="Örn: Yazılım Uzmanı" 
                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="gradYear">Mezuniyet Yılı</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input 
                        id="gradYear" 
                        placeholder="Örn: 2020" 
                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Mezun Olunan Bölüm</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input 
                        id="department" 
                        placeholder="Örn: Bilgisayar Mühendisliği" 
                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold" disabled={isLoading}>
                {isLoading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-800 pt-6">
            <p className="text-sm text-slate-400">
              Zaten hesabınız var mı?{" "}
              <button onClick={onLoginClick} className="text-green-400 hover:text-green-300 font-medium hover:underline">
                Giriş Yap
              </button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}