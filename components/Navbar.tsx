"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const publicRoutes = ['/', '/auth', '/sobre', '/contactos', '/privacidade', '/termos'];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!user || isPublicRoute) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/60 shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <div className="shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
                <img 
                  src="/logo.png" 
                  alt="GPE Logo" 
                  className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm" 
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent tracking-tight">
                  GPE
                </span>
              </Link>
            </div>
            
            <div className="hidden sm:flex sm:space-x-1">
              <Link 
                href="/dashboard" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  pathname === '/dashboard' 
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-3 group outline-none rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 hover:bg-gray-50 p-1 pr-3 transition-colors duration-200">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900 leading-none group-hover:text-blue-600 transition-colors">{user.name}</span>
                  <span className="text-xs text-blue-600 font-medium mt-1 uppercase tracking-wider">{user.role}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-50 to-white border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm overflow-hidden">
                  {user.avatar_url ? (
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${user.avatar_url}`} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
              </Link>
            </div>
            
            <div className="h-6 w-px bg-gray-200"></div>

            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-2 px-3"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
