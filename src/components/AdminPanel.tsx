import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, Users, CheckCircle, XCircle, Edit, Eye, MessageSquare, User, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Property, User as UserType } from '../types';

interface AdminPanelProps {
  onBack: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  onViewProperty: (property: Property) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, currentView, onViewChange, onViewProperty }) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (currentView === 'admin-properties') {
      fetchProperties();
    } else if (currentView === 'admin-users') {
      fetchUsers();
    }
  }, [currentView]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:realtor_id (name, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

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
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers = data?.map(profile => ({
        id: profile.id,
        name: profile.name,
        email: '', // Will be fetched separately if needed
        phone: profile.phone || '',
        type: profile.user_type as 'client' | 'realtor' | 'admin',
        avatar: profile.avatar_url,
        whatsapp: profile.whatsapp,
        telegram: profile.telegram,
        address: profile.address,
        isApproved: profile.is_approved,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      })) || [];

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePropertyStatus = async (propertyId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          status,
          admin_notes: notes || null
        })
        .eq('id', propertyId);

      if (error) throw error;

      await fetchProperties();
      setSelectedProperty(null);
      setAdminNotes('');
      alert(`Объект ${status === 'approved' ? 'одобрен' : 'отклонен'}`);
    } catch (error) {
      console.error('Error updating property status:', error);
      alert('Ошибка при обновлении статуса');
    }
  };

  const updateUserApproval = async (userId: string, isApproved: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: isApproved })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      alert(`Пользователь ${isApproved ? 'одобрен' : 'заблокирован'}`);
    } catch (error) {
      console.error('Error updating user approval:', error);
      alert('Ошибка при обновлении статуса пользователя');
    }
  };

  const makeUserAdmin = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите сделать этого пользователя администратором?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: 'admin' })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      alert('Пользователь назначен администратором');
    } catch (error) {
      console.error('Error making user admin:', error);
      alert('Ошибка при назначении администратора');
    }
  };

  if (!user || user.type !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Доступ запрещен</h1>
          <p className="text-gray-400">У вас нет прав администратора</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      case 'pending': return 'На рассмотрении';
      default: return status;
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
          <span>Назад</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4 flex items-center">
            <Crown className="w-8 h-8 text-yellow-500 mr-3" />
            Панель администратора
          </h1>
          <p className="text-gray-400">Управление объектами и пользователями</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => onViewChange('admin-properties')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
              currentView === 'admin-properties'
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span>Объекты недвижимости</span>
          </button>
          <button
            onClick={() => onViewChange('admin-users')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
              currentView === 'admin-users'
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Пользователи</span>
          </button>
        </div>

        {/* Properties Management */}
        {currentView === 'admin-properties' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700/50">
              <h2 className="text-xl font-semibold text-yellow-400">Управление объектами</h2>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Загрузка...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Объект</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Риэлтор</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Статус</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Дата</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {properties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-800/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-600">
                              {property.images?.[0] ? (
                                <img
                                  src={property.images[0]}
                                  alt={property.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                                  <Building2 className="w-6 h-6 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">{property.title}</p>
                              <p className="text-gray-400 text-sm">{property.location}</p>
                              <p className="text-yellow-400 text-sm font-medium">
                                {new Intl.NumberFormat('ru-RU').format(property.price)} ₽
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white">{property.realtor?.name}</p>
                            <p className="text-gray-400 text-sm">{property.realtor?.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(property.status)}`}>
                            {getStatusText(property.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {formatDate(property.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => onViewProperty(property)}
                              className="p-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-300"
                              title="Просмотр"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {property.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updatePropertyStatus(property.id, 'approved')}
                                  className="p-2 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-600/30 transition-all duration-300"
                                  title="Одобрить"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedProperty(property);
                                    setAdminNotes('');
                                  }}
                                  className="p-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-all duration-300"
                                  title="Отклонить"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Management */}
        {currentView === 'admin-users' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700/50">
              <h2 className="text-xl font-semibold text-yellow-400">Управление пользователями</h2>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Загрузка...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Пользователь</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Тип</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Статус</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Дата регистрации</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {users.map((userItem) => (
                      <tr key={userItem.id} className="hover:bg-gray-800/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {userItem.avatar ? (
                              <img
                                src={userItem.avatar}
                                alt={userItem.name}
                                className="h-10 w-10 rounded-full object-cover border border-gray-600"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                            <div>
                              <p className="text-white font-medium">{userItem.name}</p>
                              <p className="text-gray-400 text-sm">{userItem.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            userItem.type === 'admin' 
                              ? 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                              : userItem.type === 'realtor'
                              ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                              : 'text-green-400 bg-green-500/10 border-green-500/20'
                          }`}>
                            {userItem.type === 'admin' ? 'Администратор' : userItem.type === 'realtor' ? 'Риэлтор' : 'Клиент'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            userItem.isApproved 
                              ? 'text-green-400 bg-green-500/10 border-green-500/20'
                              : 'text-red-400 bg-red-500/10 border-red-500/20'
                          }`}>
                            {userItem.isApproved ? 'Активен' : 'Заблокирован'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {formatDate(userItem.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            {userItem.type !== 'admin' && (
                              <>
                                <button
                                  onClick={() => updateUserApproval(userItem.id, !userItem.isApproved)}
                                  className={`p-2 border rounded-lg transition-all duration-300 ${
                                    userItem.isApproved
                                      ? 'bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30'
                                      : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'
                                  }`}
                                  title={userItem.isApproved ? 'Заблокировать' : 'Разблокировать'}
                                >
                                  {userItem.isApproved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => makeUserAdmin(userItem.id)}
                                  className="p-2 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-all duration-300"
                                  title="Сделать администратором"
                                >
                                  <Crown className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Rejection Modal */}
        {selectedProperty && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setSelectedProperty(null)} />
              
              <div className="relative inline-block bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-red-500/20">
                <div className="px-6 pt-6 pb-4">
                  <h3 className="text-xl font-bold text-red-400 mb-4">Отклонить объект</h3>
                  <p className="text-gray-300 mb-4">Объект: {selectedProperty.title}</p>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Причина отклонения (необязательно)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 transition-all duration-300"
                      rows={3}
                      placeholder="Укажите причину отклонения..."
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={() => updatePropertyStatus(selectedProperty.id, 'rejected', adminNotes)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-400 hover:to-red-500 transition-all duration-300 font-medium"
                    >
                      Отклонить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;