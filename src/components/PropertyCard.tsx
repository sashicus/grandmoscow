import React from 'react';
import { MapPin, Bed, Bath, Square, Eye, Building2, Heart } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onViewDetails,
}) => {
  const { user, favorites, toggleFavorite } = useAuth();

  const formatPrice = (price: number, priceType: string) => {
    const formatted = new Intl.NumberFormat('ru-RU').format(price);
    const period =
      priceType === 'day' ? 'сутки' : priceType === 'month' ? 'месяц' : 'год';
    return `${formatted} ₽/${period}`;
  };

  const handleCardClick = () => {
    onViewDetails(property);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user && user.type === 'client') {
      toggleFavorite(property.id);
    }
  };

  const isFavorite = favorites.includes(property.id);

  return (
    <div
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden hover:shadow-yellow-500/10 transition-all duration-500 transform hover:-translate-y-2 border border-gray-700/50 hover:border-yellow-500/30 group cursor-pointer flex flex-col h-full"
      onClick={handleCardClick}
    >
      {/* Блок с изображением */}
      <div className="relative h-64">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}

        {/* Заглушка */}
        <div
          className={`${
            property.images && property.images.length > 0 ? 'hidden' : ''
          } w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center`}
        >
          <div className="text-center">
            <Building2 className="w-16 h-16 text-yellow-500/50 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Фото недоступно</p>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Favorite button */}
        {user && user.type === 'client' && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-4 left-4 p-2 rounded-full transition-all duration-300 ${
              isFavorite 
                ? 'bg-pink-500 text-white shadow-lg' 
                : 'bg-black/50 text-white hover:bg-pink-500/80'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
        
        <div className="absolute top-4 right-4">
          <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            Доступно
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center text-white/90 mb-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{property.location}</span>
          </div>
        </div>
      </div>

      {/* Контент карточки с flex-grow */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors duration-300">
            {property.title}
          </h3>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
          {property.description}
        </p>

        <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1 text-yellow-500" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1 text-yellow-500" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1 text-yellow-500" />
              <span>{property.area} м²</span>
            </div>
          </div>
        </div>

        {/* Блок с ценой и кнопкой (прижат к низу) */}
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <p className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent whitespace-nowrap">
                {formatPrice(property.price, property.priceType)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(property);
              }}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-6 py-2 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-medium shadow-lg hover:shadow-yellow-500/25 flex items-center space-x-2 flex-shrink-0"
            >
              <Eye className="w-4 h-4" />
              <span>Смотреть</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;