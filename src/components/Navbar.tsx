import React from 'react';
import { Globe, LogOut, User, Bell, Menu, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface NavbarProps {
  setView: (view: 'landing' | 'auth' | 'dashboard') => void;
  showToast: (msg: string) => void;
}

export default function Navbar({ setView, showToast }: NavbarProps) {
  const { user, language, toggleLanguage, setUser } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const t = translations[language];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setView('landing');
      showToast('Logged out successfully');
    } catch (error) {
      showToast('Error logging out');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">{t.appName}</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-medium"
            >
              <Globe size={18} />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
                </button>
                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 border border-gray-200">
                    <User size={20} />
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setView('auth')}
                  className="px-4 py-2 text-gray-700 font-medium hover:text-orange-600 transition-colors"
                >
                  {t.login}
                </button>
                <button 
                  onClick={() => setView('auth')}
                  className="px-5 py-2.5 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
                >
                  {t.signup}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleLanguage} className="p-2 text-gray-600">
              <Globe size={20} />
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-xl">
          {user ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={20} />
                <span>{t.login}</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => { setView('auth'); setIsMenuOpen(false); }}
                className="px-4 py-3 text-center text-gray-700 font-bold border border-gray-200 rounded-xl"
              >
                {t.login}
              </button>
              <button 
                onClick={() => { setView('auth'); setIsMenuOpen(false); }}
                className="px-4 py-3 text-center bg-orange-600 text-white font-bold rounded-xl"
              >
                {t.signup}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
