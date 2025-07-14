import React, { useState, useEffect } from 'react';
import { MessageSquare, Building2, Users, TrendingUp, Clock, Eye, Filter, Edit, ExternalLink, User, ChevronDown, Plus, Heart, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockProperties, mockChats, mockMessages, mockUsers, deleteProperty } from '../data/mockData';
import { Property, Chat, Message, ViewType } from '../types';

interface DashboardProps {
  onEditProperty: (property: Property) => void;
  onViewProperty: (property: Property) => void;
  onOpenChat: (chatId: string) => void;
  currentView: ViewType;
}

const Dashboard: React.FC<DashboardProps> = ({ onEditProperty, onViewProperty, onOpenChat, currentView }) => {
  const { user, favorites, toggleFavorite } = useAuth();
  const [visiblePropertiesCount, setVisiblePropertiesCount] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) return null;

  // Force refresh when properties change
  const userChats = user.type === 'client' 
    ? mockChats.filter(c => c.clientId === user.id)
    : mockChats.filter(c => c.realtorId === user.id);

  const userProperties = user.type === 'realtor' 
    ? mockProperties.filter(p => p.realtorId === user.id)
    : [];

  const favoriteProperties = mockProperties.filter(p => favorites.includes(p.id));

  const getUnreadCount = (chatId: string): number => {
    return mockMessages.filter(m => 
      m.chatId === chatId && 
      m.senderId !== user.id && 
      !m.isRead
    ).length;
  };

  const getTotalUnreadCount = (): number => {
    return userChats.reduce((total, chat) => total + getUnreadCount(chat.id), 0);
  };

  const getChatProperty = (propertyId: string): Property | undefined => {
    return mockProperties.find(p => p.id === propertyId);
  };

  const getChatUser = (chat: Chat) => {
    const userId = user.type === 'client' ? chat.realtorId : chat.clientId;
    return mockUsers.find(u => u.id === userId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Только что';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} ч назад`;
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const visibleProperties = userProperties.slice(0, visiblePropertiesCount);
  const canLoadMoreProperties = visiblePropertiesCount < userProperties.length;

  const loadMoreProperties = () => {
    setVisiblePropertiesCount(prev => prev + 10);
  };

  const handleAddProperty = () => {
    // Trigger navigation to add property page
    window.dispatchEvent(new CustomEvent('navigate-to-add-property'));
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот объект? Это действие нельзя отменить. Все связанные чаты также будут удалены.')) {
      deleteProperty(propertyId);
      // Force refresh by updating refresh key
      setRefreshKey(prev => prev + 1);
      alert('Объект и связанные чаты успешно удалены!');
    }
  };

  // Show favorites view
  if (currentView === 'favorites') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
              Избранное
            </h1>
            <p className="text-gray-400">Ваши любимые объекты недвижимости</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-yellow-400">Избранные объекты</h2>
              </div>
            </div>
            
            <div className="p-4">
              {favoriteProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProperties.map((property) => (
                    <div key={property.id} className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700/30 hover:border-yellow-500/30 transition-all duration-300">
                      <div className="relative h-48">
                        {property.images && property.images.length > 0 ? (
                          <img
                            className="w-full h-full object-cover"
                            src={property.images[0]}
                            alt={property.title}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`${property.images && property.images.length > 0 ? 'hidden' : ''} w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center`}>
                          <Building2 className="w-12 h-12 text-yellow-500/50" />
                        </div>
                        
                        <button
                          onClick={() => toggleFavorite(property.id)}
                          className="absolute top-3 right-3 p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all duration-300"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      
                      <div className="p-4">
                        <button
                          onClick={() => onViewProperty(property)}
                          className="text-left hover:text-yellow-400 transition-colors duration-300 w-full mb-2"
                        >
                          <h3 className="text-white font-medium mb-1 flex items-center space-x-2">
                            <span className="truncate">{property.title}</span>
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          </h3>
                        </button>
                        <p className="text-gray-400 text-sm mb-3">{property.location}</p>
                        <p className="text-yellow-400 font-medium">
                          {formatPrice(property.price)} ₽/{property.priceType === 'month' ? 'мес' : property.priceType === 'day' ? 'день' : 'год'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">В избранном пока ничего нет</p>
                  <p className="text-gray-500 text-sm">Добавляйте понравившиеся объекты в избранное</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show properties view for realtors
  if (currentView === 'properties') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" key={refreshKey}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
              Мои объекты
            </h1>
            <p className="text-gray-400">Управление вашими объектами недвижимости</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-yellow-400">Мои объекты</h2>
              <button
                onClick={handleAddProperty}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-4 py-2 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-medium text-sm flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Добавить</span>
              </button>
            </div>
            
            <div className="p-4">
              {userProperties.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6">
                    {visibleProperties.map((property) => (
                      <div key={property.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30 hover:border-yellow-500/30 transition-all duration-300">
                        <div className="flex flex-col space-y-4">
                          {/* Mobile and Desktop Layout */}
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                            {/* Image */}
                            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                              {property.images && property.images.length > 0 ? (
                                <img
                                  className="h-full w-full object-cover"
                                  src={property.images[0]}
                                  alt={property.title}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={`${property.images && property.images.length > 0 ? 'hidden' : ''} h-full w-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center`}>
                                <Building2 className="w-8 h-8 text-yellow-500/50" />
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => onViewProperty(property)}
                                className="text-left hover:text-yellow-400 transition-colors duration-300 w-full mb-2"
                              >
                                <h3 className="text-white font-medium mb-1 flex items-center space-x-2">
                                  <span className="truncate">{property.title}</span>
                                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                </h3>
                              </button>
                              <p className="text-gray-400 text-sm truncate mb-2">{property.location}</p>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                                <span>{property.bedrooms} спальни</span>
                                <span>{property.area} м²</span>
                                <span className="text-yellow-400 font-medium">
                                  {formatPrice(property.price)} ₽/{property.priceType === 'month' ? 'мес' : property.priceType === 'day' ? 'день' : 'год'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Status and Actions */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                              property.available 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {property.available ? 'Доступно' : 'Недоступно'}
                            </span>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => onEditProperty(property)}
                                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-4 py-2 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-medium text-sm flex items-center justify-center space-x-2 flex-1 sm:flex-none"
                              >
                                <Edit className="w-4 h-4" />
                                <span>Редактировать</span>
                              </button>
                              
                              <button
                                onClick={() => handleDeleteProperty(property.id)}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-400 hover:to-red-500 transition-all duration-300 font-medium text-sm flex items-center justify-center space-x-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Удалить</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Load More Button */}
                  {canLoadMoreProperties && (
                    <div className="text-center">
                      <button
                        onClick={loadMoreProperties}
                        className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-10 py-3 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-bold shadow-lg hover:shadow-yellow-500/30 inline-flex items-center group overflow-hidden"
                      >
                        <span className="relative z-10">Загрузить еще</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
                        <ChevronDown className="w-5 h-5 ml-3 relative z-10" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">У вас пока нет объектов</p>
                  <p className="text-gray-500 text-sm">Добавьте свой первый объект недвижимости</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show messages view
  if (currentView === 'messages' || currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
              Сообщения
            </h1>
            <p className="text-gray-400">Общение с {user.type === 'client' ? 'риэлторами' : 'клиентами'}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-yellow-400">Сообщения</h2>
                {getTotalUnreadCount() > 0 && (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <div className="min-h-[600px] max-h-[700px] overflow-y-auto">
                {userChats.length > 0 ? (
                  <div className="space-y-1 p-4">
                    {userChats
                      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                      .map((chat) => {
                        const property = getChatProperty(chat.propertyId);
                        const chatUser = getChatUser(chat);
                        const unreadCount = getUnreadCount(chat.id);
                        
                        return (
                          <div 
                            key={chat.id} 
                            className="bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-yellow-500/30 transition-all duration-300 cursor-pointer overflow-hidden"
                            onClick={() => onOpenChat(chat.id)}
                          >
                            {/* Combined header with realtor and property info */}
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  {chatUser?.avatar ? (
                                    <img
                                      src={chatUser.avatar}
                                      alt={chatUser.name}
                                      className="w-10 h-10 rounded-full object-cover border border-gray-600"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                                      <User className="w-5 h-5 text-gray-300" />
                                    </div>
                                  )}
                                  <div>
                                    <h3 className="text-white font-medium">{chatUser?.name}</h3>
                                    <p className="text-xs text-gray-500">{chatUser?.type === 'realtor' ? 'Риэлтор' : 'Клиент'}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  {unreadCount > 0 && (
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {formatDate(chat.updatedAt)}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Property info in same line */}
                              <div className="flex items-center space-x-3 bg-gray-800/30 rounded-lg p-3">
                                {property && (
                                  <>
                                    <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                                      {property.images && property.images.length > 0 ? (
                                        <img
                                          className="h-full w-full object-cover"
                                          src={property.images[0]}
                                          alt={property.title}
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.nextElementSibling?.classList.remove('hidden');
                                          }}
                                        />
                                      ) : null}
                                      <div className={`${property.images && property.images.length > 0 ? 'hidden' : ''} h-full w-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center`}>
                                        <Building2 className="w-6 h-6 text-yellow-500/50" />
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-medium text-gray-300 truncate">
                                        {property.title}
                                      </h4>
                                      <p className="text-xs text-gray-500 truncate">{property.location}</p>
                                    </div>
                                    
                                    <div className="text-right">
                                      <p className="text-sm text-yellow-400 font-medium">
                                        {formatPrice(property.price)} ₽
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        /{property.priceType === 'month' ? 'мес' : property.priceType === 'day' ? 'день' : 'год'}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                              
                              {/* Last message */}
                              {chat.lastMessage && (
                                <div className="mt-3 pt-3 border-t border-gray-700/30">
                                  <p className="text-sm text-gray-400 truncate">
                                    {chat.lastMessage.senderId === user.id ? 'Вы: ' : ''}
                                    {chat.lastMessage.content}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-2">Сообщений пока нет</p>
                    <p className="text-gray-500 text-sm">
                      {user.type === 'client' 
                        ? 'Начните общение с риэлтором, нажав "Написать" на странице объекта'
                        : 'Клиенты смогут связаться с вами через страницы ваших объектов'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;