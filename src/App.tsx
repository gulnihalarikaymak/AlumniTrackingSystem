import React, { useState } from 'react';
import { AlumniDashboard } from './components/dashboards/AlumniDashboard';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { StaffDashboard } from './components/dashboards/StaffDashboard';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import atsLogo from 'figma:asset/e53d33bd8a04eb6599952774279c21a71eb10311.png';

type UserRole = 'alumni' | 'student' | 'admin' | 'staff' | null;
type AuthStep = 'welcome' | 'login' | 'register';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  const [authStep, setAuthStep] = useState<AuthStep>('welcome');
  const [registerRole, setRegisterRole] = useState<'student' | 'alumni' | 'staff'>('student');

  const handleLogout = () => {
    setCurrentRole(null);
    setAuthStep('welcome');
  };

  const handleLoginSuccess = (role: 'student' | 'alumni' | 'admin' | 'staff') => {
    setCurrentRole(role);
  };

  const handleRegisterSuccess = () => {
    // Kayıt olduktan sonra giriş ekranına yönlendir
    setAuthStep('login');
  };

  // Kullanıcı giriş yapmı��sa Dashboard'u göster
  if (currentRole === 'alumni') {
    return <AlumniDashboard onLogout={handleLogout} />;
  }

  if (currentRole === 'student') {
    return <StudentDashboard onLogout={handleLogout} />;
  }

  if (currentRole === 'staff') {
    return <StaffDashboard onLogout={handleLogout} />;
  }

  if (currentRole === 'admin') {
    return (
      <div className="relative">
        <AdminDashboard onLogout={handleLogout} />
      </div>
    );
  }

  // Auth Akışı
  if (authStep === 'login') {
    return (
      <LoginPage 
        onLogin={handleLoginSuccess}
        onRegisterClick={(role) => {
          setRegisterRole(role as 'student' | 'alumni' | 'staff');
          setAuthStep('register');
        }}
        onBack={() => setAuthStep('welcome')}
      />
    );
  }

  if (authStep === 'register') {
    return (
      <RegisterPage 
        role={registerRole as 'student' | 'alumni'} // RegisterPage henüz staff desteklemiyor olabilir, kontrol edeceğiz
        onRegisterSuccess={handleRegisterSuccess}
        onLoginClick={() => setAuthStep('login')}
        onBack={() => setAuthStep('welcome')}
      />
    );
  }

  // Landing Page (Karşılama Ekranı)
  return (
    <LandingPage 
      onLoginClick={() => setAuthStep('login')} 
      onRegisterClick={(role) => {
        setRegisterRole(role);
        setAuthStep('register');
      }}
      logoSrc={atsLogo} 
    />
  );
}
