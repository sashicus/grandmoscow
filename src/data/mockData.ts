import { Property, User, Message, Chat } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Александр Петров',
    email: 'alexander@grand.moscow',
    phone: '+7 (495) 123-45-67',
    type: 'realtor',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    whatsapp: '+7 (903) 123-45-67',
    telegram: '@alexander_petrov',
    address: 'Москва, ул. Тверская, 15, офис 301'
  },
  {
    id: '2',
    name: 'Елена Смирнова',
    email: 'elena@grand.moscow',
    phone: '+7 (495) 234-56-78',
    type: 'realtor',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
    whatsapp: '+7 (903) 234-56-78',
    telegram: '@elena_smirnova',
    address: 'Москва, ул. Арбат, 25, офис 205'
  },
  {
    id: '3',
    name: 'Михаил Иванов',
    email: 'mikhail@client.com',
    phone: '+7 (903) 123-45-67',
    type: 'client',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    whatsapp: '+7 (903) 123-45-67',
    telegram: '@mikhail_ivanov'
  },
  {
    id: '4',
    name: 'Анна Козлова',
    email: 'anna@client.com',
    phone: '+7 (903) 234-56-78',
    type: 'client',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    whatsapp: '+7 (903) 234-56-78',
    telegram: '@anna_kozlova'
  }
];

export let mockProperties: Property[] = [
  {
    id: '1',
    title: 'Элитная квартира на Патриарших прудах',
    description: 'Роскошная квартира с панорамными окнами и дизайнерским ремонтом в самом сердце Москвы. Полностью меблирована и готова к проживанию.',
    price: 350000,
    priceType: 'month',
    location: 'Патриаршие пруды, ЦАО',
    district: 'ЦАО',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Панорамные окна', 'Дизайнерский ремонт', 'Кондиционер', 'Паркинг', 'Консьерж', 'Gym'],
    realtorId: '1',
    available: true
  },
  {
    id: '2',
    title: 'Пентхаус в Москва-Сити',
    description: 'Эксклюзивный пентхаус на 55 этаже с потрясающим видом на город. Премиальная отделка и эксклюзивные интерьеры.',
    price: 850000,
    priceType: 'month',
    location: 'Москва-Сити, Пресненский район',
    district: 'Пресненский',
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    images: [
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Панорамный вид', 'Премиум отделка', 'Терраса', 'Паркинг', 'Консьерж', 'SPA', 'Винный погреб'],
    realtorId: '1',
    available: true
  },
  {
    id: '3',
    title: 'Историческая квартира в Замоскворечье',
    description: 'Уникальная квартира в историческом здании XIX века с сохранившимися элементами архитектуры и современными удобствами.',
    price: 280000,
    priceType: 'month',
    location: 'Замоскворечье, ЦАО',
    district: 'ЦАО',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    images: [
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2029670/pexels-photo-2029670.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Историческое здание', 'Высокие потолки', 'Камин', 'Паркет', 'Охрана'],
    realtorId: '2',
    available: true
  },
  {
    id: '4',
    title: 'Современные апартаменты на Остоженке',
    description: 'Стильные апартаменты в престижном районе с современным дизайном и качественной отделкой.',
    price: 420000,
    priceType: 'month',
    location: 'Остоженка, ЦАО',
    district: 'ЦАО',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    images: [
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571439/pexels-photo-1571439.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2111768/pexels-photo-2111768.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Современный дизайн', 'Smart Home', 'Балкон', 'Паркинг', 'Фитнес-центр'],
    realtorId: '2',
    available: true
  },
  {
    id: '5',
    title: 'Загородный дом в Рублевке',
    description: 'Роскошный коттедж в элитном поселке с собственным участком, бассейном и всеми удобствами для комфортной жизни.',
    price: 1200000,
    priceType: 'month',
    location: 'Рублево-Успенское шоссе',
    district: 'Рублевка',
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571452/pexels-photo-1571452.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Собственный участок', 'Бассейн', 'Гараж на 3 машины', 'Охрана 24/7', 'Сауна', 'Винный погреб'],
    realtorId: '1',
    available: true
  },
  {
    id: '6',
    title: 'Квартира в Хамовниках',
    description: 'Элегантная квартира в тихом районе с развитой инфраструктурой.',
    price: 320000,
    priceType: 'month',
    location: 'Хамовники, ЦАО',
    district: 'Хамовники',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Тихий район', 'Близко к метро', 'Паркинг'],
    realtorId: '1',
    available: true
  },
  {
    id: '7',
    title: 'Лофт в Красном Октябре',
    description: 'Стильный лофт в арт-кластере с высокими потолками и панорамными окнами.',
    price: 450000,
    priceType: 'month',
    location: 'Красный Октябрь, ЦАО',
    district: 'ЦАО',
    bedrooms: 1,
    bathrooms: 1,
    area: 110,
    images: [
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Лофт', 'Высокие потолки', 'Арт-кластер', 'Панорамные окна'],
    realtorId: '2',
    available: true
  },
  {
    id: '8',
    title: 'Апартаменты в Сокольниках',
    description: 'Уютные апартаменты рядом с парком Сокольники.',
    price: 180000,
    priceType: 'month',
    location: 'Сокольники, ВАО',
    district: 'Сокольники',
    bedrooms: 2,
    bathrooms: 1,
    area: 70,
    images: [
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Рядом с парком', 'Тихий район', 'Хорошая транспортная доступность'],
    realtorId: '2',
    available: true
  }
];

export let mockMessages: Message[] = [
  {
    id: '1',
    chatId: '1',
    senderId: '3',
    content: 'Здравствуйте! Меня интересует эта квартира на Патриарших прудах. Можно ли посмотреть её завтра?',
    timestamp: '2024-01-20T10:30:00Z',
    isRead: false
  },
  {
    id: '2',
    chatId: '1',
    senderId: '1',
    content: 'Добрый день! Конечно, с удовольствием покажу квартиру. Завтра в 15:00 вам подойдет?',
    timestamp: '2024-01-20T11:15:00Z',
    isRead: true
  },
  {
    id: '3',
    chatId: '1',
    senderId: '3',
    content: 'Отлично! Буду завтра в 15:00. Какие документы нужно взять с собой?',
    timestamp: '2024-01-20T11:20:00Z',
    isRead: false
  },
  {
    id: '4',
    chatId: '2',
    senderId: '4',
    content: 'Добрый день! Интересует пентхаус в Москва-Сити. Какие условия аренды?',
    timestamp: '2024-01-19T14:45:00Z',
    isRead: false
  },
  {
    id: '5',
    chatId: '2',
    senderId: '1',
    content: 'Здравствуйте! Аренда от 6 месяцев, залог 2 месяца. Можем обсудить детали при встрече.',
    timestamp: '2024-01-19T15:30:00Z',
    isRead: true
  }
];

export let mockChats: Chat[] = [
  {
    id: '1',
    propertyId: '1',
    clientId: '3',
    realtorId: '1',
    lastMessage: mockMessages.find(m => m.id === '3'),
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T11:20:00Z'
  },
  {
    id: '2',
    propertyId: '2',
    clientId: '4',
    realtorId: '1',
    lastMessage: mockMessages.find(m => m.id === '5'),
    createdAt: '2024-01-19T14:45:00Z',
    updatedAt: '2024-01-19T15:30:00Z'
  }
];

export const updateProperty = (updatedProperty: Property) => {
  const index = mockProperties.findIndex(p => p.id === updatedProperty.id);
  if (index !== -1) {
    mockProperties[index] = updatedProperty;
  }
};

export const deleteProperty = (propertyId: string) => {
  // Remove property
  mockProperties = mockProperties.filter(p => p.id !== propertyId);
  
  // Remove related chats
  const chatsToRemove = mockChats.filter(c => c.propertyId === propertyId);
  const chatIdsToRemove = chatsToRemove.map(c => c.id);
  
  // Remove chats
  mockChats = mockChats.filter(c => c.propertyId !== propertyId);
  
  // Remove messages from those chats
  mockMessages = mockMessages.filter(m => !chatIdsToRemove.includes(m.chatId));
};

export const addMessage = (message: Omit<Message, 'id'>) => {
  const newMessage: Message = {
    ...message,
    id: Date.now().toString()
  };
  mockMessages.push(newMessage);
  
  // Update chat's last message and timestamp
  const chatIndex = mockChats.findIndex(c => c.id === message.chatId);
  if (chatIndex !== -1) {
    mockChats[chatIndex].lastMessage = newMessage;
    mockChats[chatIndex].updatedAt = message.timestamp;
  }
  
  return newMessage;
};

export const markMessagesAsRead = (chatId: string, userId: string) => {
  mockMessages.forEach(message => {
    if (message.chatId === chatId && message.senderId !== userId) {
      message.isRead = true;
    }
  });
};

export const createChat = (propertyId: string, clientId: string, realtorId: string): Chat => {
  const newChat: Chat = {
    id: Date.now().toString(),
    propertyId,
    clientId,
    realtorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockChats.push(newChat);
  return newChat;
};