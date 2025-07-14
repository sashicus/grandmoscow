import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Square, Calendar, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (propertyId: string, startDate: string, endDate: string) => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, isOpen, onClose, onBook }) => {
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showBooking, setShowBooking] = useState(false);

  if (!isOpen || !property) return null;

  const formatPrice = (price: number, priceType: string) => {
    const formatted = new Intl.NumberFormat('ru-RU').format(price);
    const period = priceType === 'day' ? 'сутки' : priceType === 'month' ? 'месяц' : 'год';
    return `${formatted} ₽ / ${period}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleBooking = () => {
    if (startDate && endDate) {
      onBook(property.id, startDate, endDate);
      setShowBooking(false);
      setStartDate('');
      setEndDate('');
      onClose();
    }
  };

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    
    if (property.priceType === 'day') {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays * property.price;
    } else if (property.priceType === 'month') {
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      return diffMonths * property.price;
    }
    
    return property.price;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative inline-block bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">{property.title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                  <div className="relative mb-4">
                    <img
                      src={property.images[currentImageIndex]}
                      alt={property.title}
                      className="w-full h-80 object-cover rounded-xl"
                    />
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-20 h-16 rounded-lg overflow-hidden ${
                          index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <img
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div>
                  <div className="mb-6">
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{property.location}</span>
                    </div>

                    <div className="flex items-center space-x-6 mb-6 text-gray-700">
                      <div className="flex items-center">
                        <Bed className="w-5 h-5 mr-2" />
                        <span>{property.bedrooms} спальни</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-5 h-5 mr-2" />
                        <span>{property.bathrooms} ванные</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="w-5 h-5 mr-2" />
                        <span>{property.area} м²</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6">{property.description}</p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Удобства:</h4>
                      <div className="flex flex-wrap gap-2">
                        {property.features.map((feature, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-3xl font-bold text-blue-800">
                            {formatPrice(property.price, property.priceType)}
                          </p>
                        </div>
                        {user && user.type === 'client' && (
                          <button
                            onClick={() => setShowBooking(!showBooking)}
                            className="bg-blue-800 text-white px-8 py-3 rounded-full hover:bg-blue-900 transition-colors font-medium"
                          >
                            Забронировать
                          </button>
                        )}
                      </div>

                      {showBooking && user && user.type === 'client' && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h5 className="font-semibold mb-3">Выберите даты:</h5>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Дата заезда
                              </label>
                              <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Дата выезда
                              </label>
                              <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          {startDate && endDate && (
                            <div className="mb-4">
                              <p className="font-semibold text-lg">
                                Общая стоимость: {new Intl.NumberFormat('ru-RU').format(calculateTotal())} ₽
                              </p>
                            </div>
                          )}

                          <button
                            onClick={handleBooking}
                            disabled={!startDate || !endDate}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Подтвердить бронирование
                          </button>
                        </div>
                      )}

                      {!user && (
                        <p className="text-gray-600 text-center bg-gray-50 p-4 rounded-xl">
                          Войдите в систему, чтобы забронировать объект
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;