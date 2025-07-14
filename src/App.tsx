import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import PropertyCard from './components/PropertyCard';
import PropertyView from './components/PropertyView';
import Dashboard from './components/Dashboard';
import AddProperty from './components/AddProperty';
import EditProperty from './components/EditProperty';
import ProfileSettings from './components/ProfileSettings';
import Catalog from './components/Catalog';
import Chat from './components/Chat';
import AdminPanel from './components/AdminPanel';
import { Property, ViewType, Chat as ChatType } from './types';
import { supabase } from './lib/supabase';
import {
  Search,
  Filter,
  Star,
  Building2,
  Shield,
  Clock,
  ChevronDown,
  Database,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [previousView, setPreviousView] = useState<ViewType>('home');
  const [activeChat, setActiveChat] = useState<ChatType | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [catalogVisibleCount, setCatalogVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Check database connection on mount
  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  // Fetch properties on component mount
  useEffect(() => {
    if (dbStatus === 'connected') {
      fetchProperties();
    }
  }, [dbStatus]);

  // src/App.tsx
// ...
const checkDatabaseConnection = async () => {
  try {
    // Промис, который будет отклонен через 15 секунд
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase connection timed out after 15 seconds.')), 15000)
    );

    const connectionAttempt = supabase
      .from('test_connection') // Измените 'profiles' на 'test_connection'
      .select('count')
      .limit(1);

    // Ждем либо успешного подключения, либо таймаута
    const { data, error } = await Promise.race([connectionAttempt, timeoutPromise]);

    if (error) {
      console.error('Database connection error:', error.message || error);
      setDbStatus('error');
    } else {
      console.log('Database connected successfully');
      setDbStatus('connected');
    }
  } catch (error) {
    console.error('Database connection failed:', error instanceof Error ? error.message : error);
    setDbStatus('error');
  }
};
// ...


  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:realtor_id (name, phone, whatsapp, telegram, address, avatar_url)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }

      const formattedProperties = data?.map(prop => ({
        id: prop.id,
        title: prop.title,
        description: prop.description,
        price: prop.price,
        priceType: prop.price_type as 'day' | 'month' | 'year',
        location: prop.location,
        district: prop.district,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        area: prop.area,
        images: prop.images || [],
        features: prop.features || [],
        realtorId: prop.realtor_id,
        status: prop.status as 'pending' | 'approved' | 'rejected',
        adminNotes: prop.admin_notes,
        available: prop.available,
        createdAt: prop.created_at,
        updatedAt: prop.updated_at,
        realtor: prop.profiles
      })) || [];

      setProperties(formattedProperties);
      console.log(`Loaded ${formattedProperties.length} properties`);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for navigation events
  useEffect(() => {
    const handleNavigateToAddProperty = () => {
      setCurrentView('add-property');
    };

    window.addEventListener('navigate-to-add-property', handleNavigateToAddProperty);

    return () => {
      window.removeEventListener('navigate-to-add-property', handleNavigateToAddProperty);
    };
  }, []);

  // Auto scroll to top when changing views (except chat)
  useEffect(() => {
    if (currentView !== 'chat') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [currentView]);

  const handlePropertyView = (property: Property) => {
    setPreviousView(currentView);
    setSelectedProperty(property);
    setCurrentView('property');
  };

  const handleEditProperty = (property: Property) => {
    setPreviousView(currentView);
    setEditingProperty(property);
    setCurrentView('edit-property');
  };

  const handleUpdateProperty = async (updatedProperty: Property) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: updatedProperty.title,
          description: updatedProperty.description,
          price: updatedProperty.price,
          price_type: updatedProperty.priceType,
          location: updatedProperty.location,
          district: updatedProperty.district,
          bedrooms: updatedProperty.bedrooms,
          bathrooms: updatedProperty.bathrooms,
          area: updatedProperty.area,
          images: updatedProperty.images,
          features: updatedProperty.features,
          available: updatedProperty.available
        })
        .eq('id', updatedProperty.id);

      if (error) throw error;

      await fetchProperties();
      setEditingProperty(null);
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleOpenChat = async (chatId: string) => {
    try {
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .eq('id', chatId)
        .single();

      if (chatError) throw chatError;

      if (chatData) {
        const chat: ChatType = {
          id: chatData.id,
          propertyId: chatData.property_id,
          clientId: chatData.client_id,
          realtorId: chatData.realtor_id,
          createdAt: chatData.created_at,
          updatedAt: chatData.updated_at
        };

        setPreviousView(currentView);
        setActiveChat(chat);
        setCurrentView('chat');
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  const handleAddProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('properties')
        .insert({
          title: propertyData.title,
          description: propertyData.description,
          price: propertyData.price,
          price_type: propertyData.priceType,
          location: propertyData.location,
          district: propertyData.district,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          area: propertyData.area,
          images: propertyData.images,
          features: propertyData.features,
          realtor_id: user.id,
          available: propertyData.available
        });

      if (error) throw error;

      setCurrentView('properties');
      alert('Объект успешно добавлен и отправлен на модерацию!');
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Ошибка при добавлении объекта');
    }
  };

  const loadMoreProperties = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleBackFromProperty = () => {
    if (previousView === 'home') {
      setCurrentView('catalog');
    } else {
      setCurrentView(previousView);
    }
    setSelectedProperty(null);
  };

  const handleBackFromEditProperty = () => {
    setCurrentView(previousView);
    setEditingProperty(null);
  };

  const handleBackFromChat = () => {
    setCurrentView(previousView);
    setActiveChat(null);
  };

  const handleBackFromAddProperty = () => {
    setCurrentView(previousView);
  };

  const handleBackFromProfileSettings = () => {
    setCurrentView(previousView);
  };

  const handleBackFromAdmin = () => {
    setCurrentView('home');
  };

  // Show database connection status
  if (dbStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Подключение к базе данных...</h2>
          <p className="text-gray-400">Проверяем соединение с Supabase</p>
        </div>
      </div>
    );
  }

  if (dbStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-4">Ошибка подключения к базе данных</h2>
          <p className="text-gray-400 mb-6">
            Не удается подключиться к Supabase. Проверьте настройки подключения.
          </p>
          <div className="bg-gray-800 rounded-lg p-4 text-left text-sm">
            <p className="text-yellow-400 mb-2">Проверьте:</p>
            <ul className="text-gray-300 space-y-1">
              <li>• Переменные окружения VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY</li>
              <li>• Настройки проекта в Supabase Dashboard</li>
              <li>• Выполнены ли миграции базы данных</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-6 py-3 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-medium"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // Admin Panel Views
  if (currentView === 'admin' || currentView === 'admin-properties' || currentView === 'admin-users') {
    return (
      <>
        <Header
          onAuthClick={() => setIsAuthModalOpen(true)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <AdminPanel
          onBack={handleBackFromAdmin}
          currentView={currentView}
          onViewChange={setCurrentView}
          onViewProperty={handlePropertyView}
        />
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  if (currentView === 'chat' && activeChat) {
    return (
      <>
        <Header
          onAuthClick={() => setIsAuthModalOpen(true)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <Chat
          chat={activeChat}
          onBack={handleBackFromChat}
          onViewProperty={handlePropertyView}
        />
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  if (currentView === 'property' && selectedProperty) {
    return (
      <>
        <Header
          onAuthClick={() => setIsAuthModalOpen(true)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <PropertyView
          property={selectedProperty}
          onBack={handleBackFromProperty}
          onOpenChat={handleOpenChat}
          previousView={previousView}
        />
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  if (currentView === 'edit-property' && editingProperty) {
    return (
      <>
        <Header
          onAuthClick={() => setIsAuthModalOpen(true)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <EditProperty
          property={editingProperty}
          onBack={handleBackFromEditProperty}
          onUpdateProperty={handleUpdateProperty}
        />
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  if (currentView === 'catalog') {
    return (
      <>
        <Header
          onAuthClick={() => setIsAuthModalOpen(true)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <Catalog
          properties={properties}
          onPropertyView={handlePropertyView}
          visibleCount={catalogVisibleCount}
          onLoadMore={() => setCatalogVisibleCount((prev) => prev + 6)}
        />
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  if (
    currentView === 'favorites' ||
    currentView === 'properties' ||
    currentView === 'messages'
  ) {
    return (
      <>
        <Header
          onAuthClick={() => setIsAuthModalOpen(true)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <Dashboard
          onEditProperty={handleEditProperty}
          onViewProperty={handlePropertyView}
          onOpenChat={handleOpenChat}
          currentView={currentView}
        />
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  if (currentView === 'add-property') {
    return (
      <>
        <Header
          onAuthClick={() => setIsAuthModalOpen(true)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <AddProperty
          onBack={handleBackFromAddProperty}
          onAddProperty={handleAddProperty}
        />
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  if (currentView === 'profile-settings') {
    return (
      <>
        <Header
          onAuthClick={() => setIsAuthModalOpen(true)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <ProfileSettings onBack={handleBackFromProfileSettings} />
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  // Show only first visibleCount properties on home page
  const featuredProperties = properties.slice(0, visibleCount);
  const canLoadMore = visibleCount < properties.length;

  return (
    <>
      <Header
        onAuthClick={() => setIsAuthModalOpen(true)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Hero Section */}
      <section
        className="relative text-white py-20 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.pexels.com/photos/19032688/pexels-photo-19032688.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920")',
        }}
      >
        <div className="absolute inset-0 bg-black/65 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 z-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl z-10"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl z-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Элитная недвижимость <br />
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Москвы
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Эксклюзивные предложения премиальной аренды в лучших районах столицы
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user && (
              <button
                onClick={() =>
                  setCurrentView(
                    user.type === 'realtor' ? 'properties' : 
                    user.type === 'admin' ? 'admin' : 'messages'
                  )
                }
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-8 py-4 rounded-full text-lg font-medium hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105"
              >
                {user.type === 'realtor' ? 'Панель риэлтора' : 
                 user.type === 'admin' ? 'Админ-панель' : 'Личный кабинет'}
              </button>
            )}

            <button
              onClick={() => setCurrentView('catalog')}
              className="bg-transparent border-2 border-yellow-500 text-yellow-400 px-8 py-4 rounded-full text-lg font-medium hover:bg-yellow-500 hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              Смотреть каталог
            </button>
          </div>

          {/* Database Status Indicator */}
          <div className="mt-8 flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-400">База данных подключена</span>
            <span className="text-xs text-gray-500">({properties.length} объектов загружено)</span>
          </div>

          {/* Test Users Info */}
          {!user && (
            <div className="mt-12 bg-black/30 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-yellow-400 mb-4">🧪 Тестовые аккаунты для демонстрации:</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
                  <div className="font-medium text-purple-300">👑 Администратор</div>
                  <div className="text-gray-300">admin@grand.moscow</div>
                  <div className="text-gray-400">samsung230</div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                  <div className="font-medium text-blue-300">🏢 Риэлтор</div>
                  <div className="text-gray-300">realtor@grand.moscow</div>
                  <div className="text-gray-400">samsung230</div>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                  <div className="font-medium text-green-300">👤 Клиент</div>
                  <div className="text-gray-300">client@grand.moscow</div>
                  <div className="text-gray-400">samsung230</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Properties Section */}
      <section
        id="properties"
        className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
              Рекомендуемые объекты
            </h2>
            <p className="text-xl text-gray-400 mb-6">
              Тщательно отобранные объекты премиум-класса
            </p>
            <button
              onClick={() => setCurrentView('catalog')}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-6 py-3 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-medium shadow-lg hover:shadow-yellow-500/25"
            >
              Посмотреть все объекты
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Загрузка объектов...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {featuredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onViewDetails={handlePropertyView}
                  />
                ))}
              </div>

              {canLoadMore && (
                <div className="text-center mt-8">
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
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-500/5 to-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-xl text-gray-400">
              Профессиональный подход к элитной недвижимости
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-2xl group-hover:shadow-yellow-500/30">
                  <Star className="w-10 h-10 text-gray-900" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 w-20 h-20 rounded-2xl mx-auto blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-yellow-400 transition-colors duration-300">
                Премиальный сервис
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Индивидуальный подход к каждому клиенту и персональное
                сопровождение
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-2xl group-hover:shadow-blue-500/30">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 w-20 h-20 rounded-2xl mx-auto blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">
                Тщательный отбор
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Только проверенные объекты высокого класса с полной юридической
                чистотой
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-2xl group-hover:shadow-green-500/30">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/20 w-20 h-20 rounded-2xl mx-auto blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-green-400 transition-colors duration-300">
                Быстрый поиск
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Удобные фильтры, детальные описания и мгновенная связь с
                риэлтором
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;