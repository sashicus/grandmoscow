/*
  # Insert Test Data

  This migration adds comprehensive test data including:
  1. Test user profiles (will be linked when users register)
  2. Sample properties with different statuses
  3. Sample chats and messages
  4. Sample favorites

  Note: User profiles will be created automatically when users register
  through the auth system, but we can pre-populate some data.
*/

-- =============================================
-- SAMPLE PROPERTIES DATA
-- =============================================

-- Note: We'll insert properties after users register, or create them via the app
-- This is just a reference for the data structure

-- Sample property data that will be inserted via the application:
/*
Properties to be created:
1. Элитная квартира на Патриарших прудах - 350,000₽/месяц
2. Пентхаус в Москва-Сити - 850,000₽/месяц  
3. Историческая квартира в Замоскворечье - 280,000₽/месяц
4. Современные апартаменты на Остоженке - 420,000₽/месяц
5. Загородный дом в Рублевке - 1,200,000₽/месяц
6. Квартира в Хамовниках - 320,000₽/месяц
7. Лофт в Красном Октябре - 450,000₽/месяц
8. Апартаменты в Сокольниках - 180,000₽/месяц
*/

-- Create a function to insert sample data (will be called after users register)
CREATE OR REPLACE FUNCTION insert_sample_properties(realtor_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Insert sample properties
  INSERT INTO properties (
    title, description, price, price_type, location, district, 
    bedrooms, bathrooms, area, images, features, realtor_id, status
  ) VALUES 
  (
    'Элитная квартира на Патриарших прудах',
    'Роскошная квартира с панорамными окнами и дизайнерским ремонтом в самом сердце Москвы. Полностью меблирована и готова к проживанию.',
    350000, 'month', 'Патриаршие пруды, ЦАО', 'ЦАО',
    3, 2, 120,
    ARRAY[
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    ARRAY['Панорамные окна', 'Дизайнерский ремонт', 'Кондиционер', 'Паркинг', 'Консьерж', 'Gym'],
    realtor_user_id, 'approved'
  ),
  (
    'Пентхаус в Москва-Сити',
    'Эксклюзивный пентхаус на 55 этаже с потрясающим видом на город. Премиальная отделка и эксклюзивные интерьеры.',
    850000, 'month', 'Москва-Сити, Пресненский район', 'Пресненский',
    4, 3, 200,
    ARRAY[
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    ARRAY['Панорамный вид', 'Премиум отделка', 'Терраса', 'Паркинг', 'Консьерж', 'SPA', 'Винный погреб'],
    realtor_user_id, 'approved'
  ),
  (
    'Историческая квартира в Замоскворечье',
    'Уникальная квартира в историческом здании XIX века с сохранившимися элементами архитектуры и современными удобствами.',
    280000, 'month', 'Замоскворечье, ЦАО', 'ЦАО',
    2, 2, 95,
    ARRAY[
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2029670/pexels-photo-2029670.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    ARRAY['Историческое здание', 'Высокие потолки', 'Камин', 'Паркет', 'Охрана'],
    realtor_user_id, 'approved'
  ),
  (
    'Современные апартаменты на Остоженке',
    'Стильные апартаменты в престижном районе с современным дизайном и качественной отделкой.',
    420000, 'month', 'Остоженка, ЦАО', 'ЦАО',
    3, 2, 140,
    ARRAY[
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571439/pexels-photo-1571439.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2111768/pexels-photo-2111768.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    ARRAY['Современный дизайн', 'Smart Home', 'Балкон', 'Паркинг', 'Фитнес-центр'],
    realtor_user_id, 'approved'
  ),
  (
    'Загородный дом в Рублевке',
    'Роскошный коттедж в элитном поселке с собственным участком, бассейном и всеми удобствами для комфортной жизни.',
    1200000, 'month', 'Рублево-Успенское шоссе', 'Рублевка',
    5, 4, 350,
    ARRAY[
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571452/pexels-photo-1571452.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    ARRAY['Собственный участок', 'Бассейн', 'Гараж на 3 машины', 'Охрана 24/7', 'Сауна', 'Винный погреб'],
    realtor_user_id, 'approved'
  );
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION insert_sample_properties(uuid) TO authenticated;