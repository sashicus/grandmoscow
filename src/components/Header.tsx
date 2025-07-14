import React, { useState } from 'react';
import { Building2, User, LogOut, Home, Grid3X3, Menu, X, MessageSquare, Heart, Plus, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ViewType } from '../types';

interface HeaderProps {
  onAuthClick: () => void;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick, currentView, onViewChange }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleViewChange = (view: ViewType) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    onViewChange('home');
  };

  const handleProfileClick = () => {
    onViewChange('profile-settings');
  };

  const handleAddProperty = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-add-property'));
  };

  const navigationItems = [
    { key: 'home', label: 'Главная', icon: Home, priority: 1 },
    { key: 'catalog', label: 'Каталог', icon: Grid3X3, priority: 2 },
    ...(user ? [
      ...(user.type === 'admin' ? [
        { 
          key: 'admin', 
          label: 'Админ-панель', 
          icon: Crown, 
          priority: 3
        }
      ] : []),
      ...(user.type === 'realtor' ? [
        { key: 'properties', label: 'Объекты', icon: Building2, priority: user.type === 'admin' ? 4 : 3 },
        { 
          key: 'messages', 
          label: 'Сообщения', 
          icon: MessageSquare,
          priority: user.type === 'admin' ? 5 : 4
        },
        { 
          key: 'add-property', 
          label: 'Добавить', 
          icon: Plus, 
          priority: user.type === 'admin' ? 6 : 5,
          action: handleAddProperty
        }
      ] : user.type === 'client' ? [
        { 
          key: 'messages', 
          label: 'Сообщения', 
          icon: MessageSquare,
          priority: user.type === 'admin' ? 4 : 3
        },
        { key: 'favorites', label: 'Избранное', icon: Heart, priority: user.type === 'admin' ? 5 : 4 }
      ] : [])
    ] : [])
  ];

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl sticky top-0 z-50 border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Always visible */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
            onClick={() => handleViewChange('home')}
          >
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-lg group-hover:from-yellow-300 group-hover:to-yellow-500 transition-all duration-300">
              <Building2 className="h-6 w-6 text-gray-900" />
            </div>
            {/* Site name - Always visible */}
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Grand Moscow
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">Элитная недвижимость</p>
            </div>
          </div>

          {/* Desktop Navigation - Progressive hiding based on screen size */}
          <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-1 justify-center">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.key;
              
              return (
                <button
                  key={item.key}
                  onClick={() => item.action ? item.action() : handleViewChange(item.key as ViewType)}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-300 relative text-sm xl:text-base ${
                    isActive
                      ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                      : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Tablet Navigation - Hide "Добавить" first */}
          <nav className="hidden md:flex lg:hidden items-center space-x-2 flex-1 justify-center">
            {navigationItems.filter(item => item.priority <= 5).map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.key;
              
              return (
                <button
                  key={item.key}
                  onClick={() => item.action ? item.action() : handleViewChange(item.key as ViewType)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 relative text-sm ${
                    isActive
                      ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                      : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </nav>

          {/* Small tablet Navigation - Hide "Избранное"/"Добавить" */}
          <nav className="hidden sm:flex md:hidden items-center space-x-2 flex-1 justify-center">
            {navigationItems.filter(item => item.priority <= 4).map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.key;
              
              return (
                <button
                  key={item.key}
                  onClick={() => item.action ? item.action() : handleViewChange(item.key as ViewType)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 relative text-sm ${
                    isActive
                      ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                      : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </nav>

          {/* Right side - User section and mobile menu - Always visible */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* User section - Always visible when logged in */}
            {user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-3 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-yellow-500/30"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-900" />
                    </div>
                  )}
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-yellow-400 capitalize">
                      {user.type === 'realtor' ? 'Риэлтор' : user.type === 'admin' ? 'Администратор' : 'Клиент'}
                    </p>
                  </div>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-800/50 rounded-lg transition-all duration-300"
                  title="Выйти"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Login button - Always visible when not logged in */
              <button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-4 lg:px-6 py-2 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-medium shadow-lg hover:shadow-yellow-500/25 text-sm lg:text-base"
              >
                Войти
              </button>
            )}

            {/* Mobile menu button - Always visible on mobile */}
            <button
              onClick={toggleMobileMenu}
              className="sm:hidden p-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-800/50 rounded-lg transition-all duration-300 relative"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-700/50 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.key;
                
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        handleViewChange(item.key as ViewType);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 relative ${
                      isActive
                        ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                        : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;