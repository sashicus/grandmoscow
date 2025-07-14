import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Send,
  User,
  Building2,
  Phone,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Chat, Message, Property } from '../types';
import {
  mockMessages,
  mockUsers,
  mockProperties,
  addMessage,
  markMessagesAsRead,
} from '../data/mockData';

interface ChatProps {
  chat: Chat;
  onBack: () => void;
  onViewProperty?: (property: Property) => void;
}

const ChatComponent: React.FC<ChatProps> = ({
  chat,
  onBack,
  onViewProperty,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const property = mockProperties.find((p) => p.id === chat.propertyId);
  const otherUser =
    user?.type === 'client'
      ? mockUsers.find((u) => u.id === chat.realtorId)
      : mockUsers.find((u) => u.id === chat.clientId);

  useEffect(() => {
    const chatMessages = mockMessages.filter((m) => m.chatId === chat.id);
    setMessages(chatMessages);
    if (user) markMessagesAsRead(chat.id, user.id);
  }, [chat.id, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    setIsLoading(true);

    const message = addMessage({
      chatId: chat.id,
      senderId: user.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    });

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
    setIsLoading(false);
  };

  const handlePropertyClick = () => {
    if (property && onViewProperty) onViewProperty(property);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    return diffInHours < 24
      ? date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  };

  if (!user || !otherUser || !property) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4 sm:gap-0">
            {/* Назад */}
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="hidden sm:inline">Назад</span>
            </button>

            {/* Кнопка с названием объекта */}
            <button
              onClick={handlePropertyClick}
              className="flex items-center space-x-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/30 rounded-lg px-4 py-2 flex-1 mx-4 hover:border-yellow-500/30 transition-all duration-300 group min-w-0"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                {property.images?.[0] ? (
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
                <div
                  className={`${
                    property.images?.[0] ? 'hidden' : ''
                  } w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center`}
                >
                  <Building2 className="w-5 h-5 text-yellow-500/50" />
                </div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4 className="font-medium text-white text-sm flex items-center space-x-2 group-hover:text-yellow-400 transition-colors duration-300">
                  <span className="truncate max-w-[100px] sm:max-w-[200px] md:max-w-none">
                    {property.title}
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </h4>
                <p className="text-xs text-gray-400 truncate">
                  {property.location}
                </p>
              </div>
            </button>

            {/* Риэлтор и контакты */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 max-w-[150px] sm:max-w-none overflow-hidden">
                {otherUser.avatar ? (
                  <img
                    src={otherUser.avatar}
                    alt={otherUser.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-yellow-500/30 flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div className="hidden md:block truncate">
                  <h3 className="font-medium text-white text-sm truncate">
                    {otherUser.name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">
                    {otherUser.type === 'realtor' ? 'Риэлтор' : 'Клиент'}
                  </p>
                </div>
              </div>

              {otherUser.phone && (
                <div className="flex space-x-2">
                  <a
                    href={`tel:${otherUser.phone}`}
                    className="p-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition"
                    title="Позвонить"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  {otherUser.whatsapp && (
                    <a
                      href={`https://wa.me/${otherUser.whatsapp.replace(
                        /[^\d]/g,
                        ''
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-600/30 transition hidden sm:inline-flex"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                  {otherUser.telegram && (
                    <a
                      href={`https://t.me/${otherUser.telegram.replace(
                        '@',
                        ''
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition hidden md:inline-flex"
                      title="Telegram"
                    >
                      <Send className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Message List */}
          <div
            ref={scrollContainerRef}
            className="h-[60vh] overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar"
          >
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600/50">
                  <Building2 className="w-12 h-12 text-yellow-500/50 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Начните общение по поводу этого объекта
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => {
                  const isOwn = message.senderId === user.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isOwn ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className="max-w-xs lg:max-w-md">
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            isOwn
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900'
                              : 'bg-gradient-to-br from-gray-700 to-gray-800 text-white border border-gray-600/50'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div
                          className={`flex items-center mt-1 space-x-2 text-xs ${
                            isOwn ? 'justify-end' : 'justify-start'
                          } text-gray-500`}
                        >
                          <span>{formatTime(message.timestamp)}</span>
                          {isOwn && (
                            <span
                              className={
                                message.isRead
                                  ? 'text-green-400'
                                  : 'text-gray-500'
                              }
                            >
                              {message.isRead ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-700/50 p-6">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-400 transition"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isLoading}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-6 py-3 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition font-medium shadow-lg disabled:opacity-50 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Отправить</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(253, 224, 71, 0.5); /* yellow-400 */
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default ChatComponent;
