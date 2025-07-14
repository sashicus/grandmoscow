import React from 'react';
import { Building2, Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Grand Moscow
              </h3>
            </div>
            <p className="text-gray-400">
              Элитная недвижимость Москвы. Эксклюзивные предложения для взыскательных клиентов.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Контакты</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-2 text-yellow-500" />
                <span>+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2 text-yellow-500" />
                <span>info@grand.moscow</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-2 text-yellow-500" />
                <span>Москва, ул. Тверская, 1</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Услуги</h4>
            <ul className="text-gray-400 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Долгосрочная аренда
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Краткосрочная аренда
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Управление недвижимостью
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Консультации
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Режим работы</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                <div>
                  <p>Пн-Пт: 9:00 - 21:00</p>
                  <p>Сб-Вс: 10:00 - 18:00</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Социальные сети:</p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                    <span className="sr-only">Telegram</span>
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500/20">
                      <span className="text-xs font-bold">TG</span>
                    </div>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                    <span className="sr-only">WhatsApp</span>
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500/20">
                      <span className="text-xs font-bold">WA</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Grand Moscow. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;