import React, { useState, useEffect } from 'react';
import {
  Filter,
  MapPin,
  Home,
  Tag,
  Building2,
  ChevronDown,
} from 'lucide-react';
import PropertyCard from './PropertyCard';
import { Property } from '../types';

interface CatalogProps {
  properties: Property[];
  onPropertyView: (property: Property) => void;
  visibleCount?: number;
  onLoadMore?: () => void;
}

const Catalog: React.FC<CatalogProps> = ({
  properties,
  onPropertyView,
  visibleCount: externalVisibleCount,
  onLoadMore: externalOnLoadMore,
}) => {
  const [districtFilter, setDistrictFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [internalVisibleCount, setInternalVisibleCount] = useState(6);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  // Use external state if provided, otherwise use internal state
  const visibleCount = externalVisibleCount ?? internalVisibleCount;
  const onLoadMore =
    externalOnLoadMore ?? (() => setInternalVisibleCount((prev) => prev + 6));

  const districts = Array.from(
    new Set(properties.map((p) => p.district))
  ).sort();

  useEffect(() => {
    const filtered = properties.filter((property) => {
      const matchesDistrict =
        districtFilter === 'all' || property.district === districtFilter;

      let matchesType = true;
      if (typeFilter === 'apartment') {
        matchesType =
          property.title.toLowerCase().includes('квартира') ||
          property.title.toLowerCase().includes('апартаменты');
      } else if (typeFilter === 'house') {
        matchesType =
          property.title.toLowerCase().includes('дом') ||
          property.title.toLowerCase().includes('коттедж');
      } else if (typeFilter === 'penthouse') {
        matchesType = property.title.toLowerCase().includes('пентхаус');
      } else if (typeFilter === 'loft') {
        matchesType = property.title.toLowerCase().includes('лофт');
      }

      let matchesPrice = true;
      if (priceFilter === 'low') {
        matchesPrice = property.price < 300000;
      } else if (priceFilter === 'medium') {
        matchesPrice = property.price >= 300000 && property.price < 600000;
      } else if (priceFilter === 'high') {
        matchesPrice = property.price >= 600000;
      }

      return matchesDistrict && matchesType && matchesPrice;
    });

    setFilteredProperties(filtered);
    // Reset visible count when filters change
    if (!externalVisibleCount) {
      setInternalVisibleCount(6);
    }
  }, [
    properties,
    districtFilter,
    typeFilter,
    priceFilter,
    externalVisibleCount,
  ]);

  const visibleProperties = filteredProperties.slice(0, visibleCount);
  const canLoadMore = visibleProperties.length < filteredProperties.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
            Каталог недвижимости
          </h1>
          <p className="text-xl text-gray-400">
            Полный каталог элитной недвижимости Москвы
          </p>
        </div>

        {/* Фильтры - улучшенный дизайн */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 mb-8 border border-slate-700 shadow-xl shadow-slate-900/50">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex items-center">
              <Filter className="w-6 h-6 text-yellow-500 mr-3" />
              <h3 className="text-xl font-bold text-yellow-400">
                Фильтры недвижимости
              </h3>
            </div>

            <div className="flex items-center mt-2 md:mt-0">
              <span className="text-gray-300 mr-2">Найдено:</span>
              <span className="bg-yellow-600 text-slate-900 font-bold py-1 px-3 rounded-full">
                {filteredProperties.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-yellow-500 mr-2" />
                <label className="text-sm font-medium text-gray-300">
                  Район
                </label>
              </div>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white transition-all duration-300 hover:border-yellow-500/50 appearance-none"
              >
                <option value="all">Все районы</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <div className="flex items-center mb-2">
                <Home className="w-5 h-5 text-yellow-500 mr-2" />
                <label className="text-sm font-medium text-gray-300">
                  Тип недвижимости
                </label>
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white transition-all duration-300 hover:border-yellow-500/50 appearance-none"
              >
                <option value="all">Все типы</option>
                <option value="apartment">Квартиры</option>
                <option value="penthouse">Пентхаусы</option>
                <option value="house">Дома</option>
                <option value="loft">Лофты</option>
              </select>
            </div>

            <div className="relative">
              <div className="flex items-center mb-2">
                <Tag className="w-5 h-5 text-yellow-500 mr-2" />
                <label className="text-sm font-medium text-gray-300">
                  Ценовая категория
                </label>
              </div>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white transition-all duration-300 hover:border-yellow-500/50 appearance-none"
              >
                <option value="all">Все цены</option>
                <option value="low">До 300 000 ₽</option>
                <option value="medium">300 000 - 600 000 ₽</option>
                <option value="high">От 600 000 ₽</option>
              </select>
            </div>
          </div>
        </div>

        {/* Сетка объектов с анимацией */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {visibleProperties.map((property) => (
            <div
              key={property.id}
              className="transition-transform duration-500 hover:scale-[1.02] hover:z-10"
            >
              <PropertyCard
                property={property}
                onViewDetails={onPropertyView}
              />
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700">
            <p className="text-gray-400 text-xl">
              Объекты не найдены по выбранным фильтрам
            </p>
            <button
              onClick={() => {
                setDistrictFilter('all');
                setTypeFilter('all');
                setPriceFilter('all');
              }}
              className="mt-6 bg-gradient-to-r from-slate-700 to-slate-800 text-yellow-400 px-6 py-3 rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-300 font-medium shadow-lg border border-slate-600"
            >
              Сбросить фильтры
            </button>
          </div>
        )}

        {canLoadMore && (
          <div className="text-center mt-8 mb-8">
            <button
              onClick={onLoadMore}
              className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-10 py-3 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-bold shadow-lg hover:shadow-yellow-500/30 inline-flex items-center group overflow-hidden"
            >
              <span className="relative z-10">Загрузить еще</span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
              <ChevronDown className="w-5 h-5 ml-3 relative z-10" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
