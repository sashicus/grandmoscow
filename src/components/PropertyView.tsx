import React, { useState } from 'react';
import { ArrowLeft, MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight, Star, User, Building2, Phone, MessageCircle, Send, Heart } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { mockUsers, mockChats, createChat } from '../data/mockData';

interface PropertyViewProps {
  property: Property;
  onBack: () => void;
  onOpenChat: (chatId: string) => void;
  previousView?: string;
}

const PropertyView: React.FC<PropertyViewProps> = ({ property, onBack, onOpenChat, previousView = 'home' }) => {
  const { user, favorites, toggleFavorite } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number, priceType: string) => {
    const formatted = new Intl.NumberFormat('ru-RU').format(price);
    const period = priceType === 'day' ? 'сутки' : priceType === 'month' ? 'месяц' : 'год';
    return `${formatted} ₽ / ${period}`;
  };

  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleStartChat = () => {
    if (!user || user.type !== 'client') return;

    // Check if chat already exists
    let existingChat = mockChats.find(c => 
      c.propertyId === property.id && 
      c.clientId === user.id && 
      c.realtorId === property.realtorId
    );

    if (!existingChat) {
      existingChat = createChat(property.id, user.id, property.realtorId);
    }

    onOpenChat(existingChat.id);
  };

  const handleFavoriteClick = () => {
    if (user && user.type === 'client') {
      toggleFavorite(property.id);
    }
  };

  const realtor = mockUsers.find(u => u.id === property.realtorId);
  const hasImages = property.images && property.images.length > 0;
  const isFavorite = favorites.includes(property.id);

  const getBackButtonText = () => {
    switch (previousView) {
      case 'catalog':
        return 'Назад к каталогу';
      case 'dashboard':
        return 'Назад к панели';
      default:
        return 'Назад к объектам';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 mb-6 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>{getBackButtonText()}</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Images */}
          <div className="lg:col-span-2">
            <div className="relative mb-6">
              {hasImages ? (
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              
              {/* Заглушка */}
              <div className={`${hasImages ? 'hidden' : ''} w-full h-96 lg:h-[500px] bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl shadow-2xl flex items-center justify-center`}>
                <div className="text-center">
                  <Building2 className="w-24 h-24 text-yellow-500/50 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Изображения недоступны</p>
                </div>
              </div>

              {/* Favorite button */}
              {user && user.type === 'client' && (
                <button
                  onClick={handleFavoriteClick}
                  className={`absolute top-4 left-4 p-3 rounded-full transition-all duration-300 ${
                    isFavorite 
                      ? 'bg-pink-500 text-white shadow-lg' 
                      : 'bg-black/50 text-white hover:bg-pink-500/80'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              )}

              {hasImages && property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all duration-300 text-white hover:text-yellow-400"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all duration-300 text-white hover:text-yellow-400"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              
              {hasImages && property.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-yellow-500 scale-125' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {hasImages && (
              <div className="grid grid-cols-4 gap-3">
                {property.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-24 rounded-lg overflow-hidden transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-yellow-500 scale-105' 
                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-yellow-500/50" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700/50 sticky top-24">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-3">{property.title}</h1>
                <div className="flex items-center text-gray-400 mb-4">
                  <MapPin className="w-5 h-5 mr-2 text-yellow-500" />
                  <span>{property.location}</span>
                </div>

                <div className="flex items-center space-x-6 mb-6 text-gray-300">
                  <div className="flex items-center">
                    <Bed className="w-5 h-5 mr-2 text-yellow-500" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-5 h-5 mr-2 text-yellow-500" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-5 h-5 mr-2 text-yellow-500" />
                    <span>{property.area} м²</span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                    {formatPrice(property.price, property.priceType)}
                  </p>
                </div>

                {user && user.type === 'client' && (
                  <button
                    onClick={handleStartChat}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 py-3 px-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-medium shadow-lg hover:shadow-yellow-500/25 mb-4 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Написать риэлтору</span>
                  </button>
                )}

                {!user && (
                  <div className="text-gray-400 text-center bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 mb-4">
                    Войдите в систему, чтобы связаться с риэлтором
                  </div>
                )}

                {/* Realtor Info */}
                {realtor && (
                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                    <h5 className="font-semibold mb-3 text-yellow-400">Риэлтор</h5>
                    <div className="flex items-center space-x-3 mb-3">
                      {realtor.avatar ? (
                        <img
                          src={realtor.avatar}
                          alt={realtor.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500/30"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-900" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{realtor.name}</p>
                        <p className="text-sm text-gray-400">{realtor.phone}</p>
                      </div>
                    </div>
                    
                    {/* Contact buttons */}
                    <div className="space-y-2">
                      <a
                        href={`tel:${realtor.phone}`}
                        className="w-full flex items-center justify-center space-x-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 py-2 px-3 rounded-lg hover:bg-blue-600/30 transition-all duration-300 text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Позвонить</span>
                      </a>
                      
                      {realtor.whatsapp && (
                        <a
                          href={`https://wa.me/${realtor.whatsapp.replace(/[^\d]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center space-x-2 bg-green-600/20 border border-green-500/30 text-green-400 py-2 px-3 rounded-lg hover:bg-green-600/30 transition-all duration-300 text-sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      
                      {realtor.telegram && (
                        <a
                          href={`https://t.me/${realtor.telegram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center space-x-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 py-2 px-3 rounded-lg hover:bg-blue-500/30 transition-all duration-300 text-sm"
                        >
                          <Send className="w-4 h-4" />
                          <span>Telegram</span>
                        </a>
                      )}
                    </div>
                    
                    {realtor.address && (
                      <div className="mt-3 pt-3 border-t border-gray-700/50">
                        <p className="text-xs text-gray-500 mb-1">Адрес офиса:</p>
                        <p className="text-sm text-gray-400">{realtor.address}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description and Features */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700/50">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Описание</h3>
            <p className="text-gray-300 leading-relaxed">{property.description}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700/50">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Удобства</h3>
            <div className="grid grid-cols-2 gap-3">
              {property.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 text-yellow-400 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyView;