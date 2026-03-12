
import React, { useEffect, useState } from 'react';

// ============================================
// 1. MASHINALAR MA'LUMOTLARI
// ============================================

type Car = {
  id: number;
  name: string;
  category: 'Sport' | 'Premium' | 'SUV' | 'Oddiy';
  price: number;
  fuel: string;
  transmission: string;
  year: number;
  seats: number;
  img: string;
  specs: string[];
};

const initialCars: Car[] = [
  {
    id: 1,
    name: 'BMW X5 M Sport',
    category: 'Sport',
    price: 145,
    fuel: 'Petrol',
    transmission: 'Automatic',
    year: 2023,
    seats: 5,
    img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
    specs: ['🚗 5 мест', '⛽ Petrol', '⚙️ Автомат', '📅 2023'],
  },
  {
    id: 2,
    name: 'Mercedes E220',
    category: 'Premium',
    price: 125,
    fuel: 'Diesel',
    transmission: 'Automatic',
    year: 2022,
    seats: 5,
    img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop',
    specs: ['🚗 5 мест', '⛽ Diesel', '⚙️ Автомат', '📅 2022'],
  },
  {
    id: 3,
    name: 'Toyota Land Cruiser 300',
    category: 'SUV',
    price: 180,
    fuel: 'Petrol',
    transmission: 'Automatic',
    year: 2024,
    seats: 7,
    img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop',
    specs: ['🚗 7 мест', '⛽ Petrol', '⚙️ Автомат', '📅 2024'],
  },
  {
    id: 4,
    name: 'Chevrolet Malibu',
    category: 'Oddiy',
    price: 78,
    fuel: 'Petrol',
    transmission: 'Automatic',
    year: 2021,
    seats: 5,
    img: 'https://images.unsplash.com/photo-1549927681-13f288c8f4b9?w=400&h=300&fit=crop',
    specs: ['🚗 5 мест', '⛽ Petrol', '⚙️ Автомат', '📅 2021'],
  },
  {
    id: 5,
    name: 'Porsche 911 Carrera',
    category: 'Sport',
    price: 290,
    fuel: 'Petrol',
    transmission: 'Automatic',
    year: 2023,
    seats: 2,
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
    specs: ['🚗 2 мест', '⛽ Petrol', '⚙️ Автомат', '📅 2023'],
  },
  {
    id: 6,
    name: 'Lexus LX 600',
    category: 'Premium',
    price: 220,
    fuel: 'Petrol',
    transmission: 'Automatic',
    year: 2024,
    seats: 7,
    img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop',
    specs: ['🚗 7 мест', '⛽ Petrol', '⚙️ Автомат', '📅 2024'],
  },
  {
    id: 7,
    name: 'Range Rover Sport',
    category: 'SUV',
    price: 245,
    fuel: 'Petrol',
    transmission: 'Automatic',
    year: 2024,
    seats: 5,
    img: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop',
    specs: ['🚗 5 мест', '⛽ Petrol', '⚙️ Автомат', '📅 2024'],
  },
  {
    id: 8,
    name: 'Audi RS7',
    category: 'Sport',
    price: 260,
    fuel: 'Petrol',
    transmission: 'Automatic',
    year: 2023,
    seats: 5,
    img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=300&fit=crop',
    specs: ['🚗 5 мест', '⛽ Petrol', '⚙️ Автомат', '📅 2023'],
  },
];

// ============================================
// 2. TILLAR VA TARJIMALAR
// ============================================

const translations = {
  uz: {
    home: 'Bosh sahifa',
    fleet: 'Avtopark',
    about: 'Biz haqimizda',
    contacts: 'Kontaktlar',
    welcome: 'Abu Rent - Toshkent va Buxoroda avtomobil ijarasi',
    subTitle: 'Qulay, sifatli va arzon avtomobil ijarasi xizmati',
    browseFleet: 'Avtopark ko\'rish',
    reserve: 'Band qilish',
    callNow: 'Hozir qo\'ng\'iroq qiling',
    bookNow: 'Hozir band qilish',
    booking: 'Bronlash',
    pickupDate: 'Olish sanasi',
    pickupTime: 'Olish vaqti',
    returnDate: 'Qaytarish sanasi',
    returnTime: 'Qaytarish vaqti',
    pickupLocation: 'Olish joyi',
    returnLocation: 'Qaytarish joyi',
    next: 'DAVOM ETISH →',
    popular: 'Mashhur avtomobillar',
    carDetails: 'Mashinaning tafsiloti',
    specifications: 'Xususiyatlari',
    pricePerDay: 'kuniga',
    perMonth: 'oyiga',
    advantages: 'Afzalliklari',
    fairPrices: 'Adolatli narxlar',
    fairPricesDesc: 'Shaffof shartlar, yashirin to\'lovlar yo\'q',
    insurance: 'Sug\'urta kiradi',
    insuranceDesc: 'To\'liq sug\'urta va himoya',
    delivery: 'Yetkazib berish',
    deliveryDesc: 'Istalgan joyga yetkazib berish',
    service24_7: '24/7 Xizmat',
    serviceDesc: 'Tez yordam va qo\'llab-quvvatlash',
    requirements: 'Talab etiladi',
    driverLicense: 'Haydovchilik guvohnomasi',
    minAge: '21 yosh',
    minAgeDesc: 'Minimum yosh chegarasi',
    experience: '2+ yillik tajriba',
    experienceDesc: 'Haydovchilik tajribasi',
    passport: 'Pasport',
    aboutTitle: 'Abu Rent Haqida',
    aboutDesc: 'Abu Rent - Toshkent va Buxoroda eng ishonchli avtomobil ijarasi xizmati.',
    whyChooseUs: 'Nega bizni tanlaasiz?',
    advantages_list: [
      '✓ Yuqori sifatli va yangi avtomobillar',
      '✓ Juda arzoon narxlar va chegirma',
      '✓ Shahar bo\'ylab bepul yetkazib berish',
      '✓ To\'liq sug\'urta qamrovi',
      '✓ 24/7 professional qo\'llab-quvvatlash',
      '✓ Shaffof va aniq shartnoma',
    ],
    phone: '+998 99 910 03 00',
    phone2: '+998 95 420 03 00',
    address: 'Toshkent: Mirabad tumani',
    address2: 'Buxoro: Farovon MFY',
    email: 'info@aburent.uz',
    callCenter: 'Qo\'ng\'iroq markazi',
    callCenterDesc: 'Operatorlar tez javob beradi',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    messenger: 'Messenjeri',
    menu: 'Menyu',
    services: 'Xizmatlar',
    company: 'Kompaniya',
    followUs: 'Bizni kuzating',
    allRightsReserved: 'Barcha huquqlar saqlanadi © 2025 Abu Rent',
  },

  ru: {
    home: 'Главная',
    fleet: 'Автопарк',
    about: 'О нас',
    contacts: 'Контакты',
    welcome: 'Abu Rent - аренда автомобилей в Ташкенте и Бухаре',
    subTitle: 'Удобный, качественный и дешевый сервис аренды автомобилей',
    browseFleet: 'Смотреть парк',
    reserve: 'Забронировать',
    callNow: 'Позвоните сейчас',
    bookNow: 'Забронировать сейчас',
    booking: 'Бронирование',
    pickupDate: 'Дата подачи',
    pickupTime: 'Время подачи',
    returnDate: 'Дата возврата',
    returnTime: 'Время возврата',
    pickupLocation: 'Место получения',
    returnLocation: 'Место возврата',
    next: 'ДАЛЕЕ →',
    popular: 'Популярные авто',
    pricePerDay: 'в день',
    advantages: 'Преимущества',
    fairPrices: 'Справедливые цены',
    fairPricesDesc: 'Прозрачные условия без скрытых платежей',
    insurance: 'Страховка включена',
    insuranceDesc: 'Полная страховка и защита',
    delivery: 'Доставка',
    deliveryDesc: 'Доставка в любое место',
    service24_7: '24/7 Сервис',
    serviceDesc: 'Быстрая помощь и поддержка',
    requirements: 'Требования',
    driverLicense: 'Водительское удостоверение',
    minAge: '21 год',
    experience: 'Опыт 2+ года',
    passport: 'Паспорт',
    aboutTitle: 'О Abu Rent',
    aboutDesc: 'Abu Rent - самый надежный сервис аренды автомобилей.',
    whyChooseUs: 'Почему выбирают нас?',
    advantages_list: [
      '✓ Высокое качество и новые автомобили',
      '✓ Очень низкие цены и скидки',
      '✓ Бесплатная доставка по городу',
      '✓ Полное страховое покрытие',
      '✓ Профессиональная поддержка 24/7',
      '✓ Прозрачные и четкие условия',
    ],
    phone: '+998 99 910 03 00',
    phone2: '+998 95 420 03 00',
    address: 'Ташкент: Мирабадский район',
    address2: 'Бухара: Фарғона МФЙ',
    email: 'info@aburent.uz',
    callCenter: 'Центр обслуживания',
    callCenterDesc: 'Операторы отвечают быстро',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    messenger: 'Мессенджеры',
    menu: 'Меню',
    services: 'Услуги',
    company: 'Компания',
    followUs: 'Следите за нами',
    allRightsReserved: 'Все права защищены © 2025 Abu Rent',
  },
  en: {
    home: 'Home',
    fleet: 'Fleet',
    about: 'About',
    contacts: 'Contacts',
    welcome: 'Abu Rent - car rental in Tashkent and Bukhara',
    subTitle: 'Comfortable, reliable, and affordable car rental service',
    browseFleet: 'Browse fleet',
    reserve: 'Reserve',
    callNow: 'Call now',
    bookNow: 'Book now',
    booking: 'Booking',
    pickupDate: 'Pickup date',
    pickupTime: 'Pickup time',
    returnDate: 'Return date',
    returnTime: 'Return time',
    pickupLocation: 'Pickup location',
    returnLocation: 'Return location',
    next: 'CONTINUE →',
    popular: 'Popular cars',
    carDetails: 'Car details',
    specifications: 'Specifications',
    pricePerDay: 'per day',
    perMonth: 'per month',
    advantages: 'Advantages',
    fairPrices: 'Fair prices',
    fairPricesDesc: 'Transparent terms, no hidden fees',
    insurance: 'Insurance included',
    insuranceDesc: 'Full insurance and protection',
    delivery: 'Delivery',
    deliveryDesc: 'Delivery to any location',
    service24_7: '24/7 Service',
    serviceDesc: 'Fast help and support',
    requirements: 'Requirements',
    driverLicense: 'Driver license',
    minAge: 'Age 21+',
    minAgeDesc: 'Minimum age requirement',
    experience: '2+ years experience',
    experienceDesc: 'Driving experience',
    passport: 'Passport',
    aboutTitle: 'About Abu Rent',
    aboutDesc: 'Abu Rent is a trusted car rental service in Tashkent and Bukhara.',
    whyChooseUs: 'Why choose us?',
    advantages_list: [
      '✓ High-quality and new cars',
      '✓ Affordable prices and discounts',
      '✓ Free city delivery',
      '✓ Full insurance coverage',
      '✓ 24/7 professional support',
      '✓ Transparent and clear contracts',
    ],
    phone: '+998 99 910 03 00',
    phone2: '+998 95 420 03 00',
    address: 'Tashkent: Mirabad district',
    address2: 'Bukhara: Farovon MFY',
    email: 'info@aburent.uz',
    callCenter: 'Call center',
    callCenterDesc: 'Operators respond quickly',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    messenger: 'Messengers',
    menu: 'Menu',
    services: 'Services',
    company: 'Company',
    followUs: 'Follow us',
    allRightsReserved: 'All rights reserved © 2025 Abu Rent',
  },
} as const;

type Lang = keyof typeof translations;

// ============================================
// 3. MAIN COMPONENT
// ============================================

export default function AbuRentApp() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('aburent-theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('aburent-lang') as Lang) || 'uz';
    }
    return 'uz';
  });

  const [page, setPage] = useState<'home' | 'fleet' | 'about' | 'contacts'>('home');
  const [cars] = useState<Car[]>(initialCars);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('aburent-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('aburent-lang', lang);
  }, [lang]);

  const t = translations[lang];

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value as Lang);
  };

  const handleNavigate = (newPage: 'home' | 'fleet' | 'about' | 'contacts') => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  return (
    <div className={`abu-rent-app theme-${theme}`}>
      {/* ========== HEADER ========== */}
      <header className="header">
        <div className="header-top">
          <div className="logo" onClick={() => handleNavigate('home')}>
            <span className="logo-icon">🚗</span>
            <span className="logo-text">Abu Rent</span>
          </div>

          <div className="header-controls">
            <select className="lang-selector" value={lang} onChange={handleLanguageChange}>
              <option value="uz">🇺🇿 UZ</option>
              <option value="ru">🇷🇺 RU</option>
              <option value="en">🇬🇧 EN</option>
            </select>

            <button className="theme-toggle" onClick={handleThemeToggle}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <nav className="navigation">
          <button className={`nav-link ${page === 'home' ? 'active' : ''}`} onClick={() => handleNavigate('home')}>
            {t.home}
          </button>
          <button className={`nav-link ${page === 'fleet' ? 'active' : ''}`} onClick={() => handleNavigate('fleet')}>
            {t.fleet}
          </button>
          <button className={`nav-link ${page === 'about' ? 'active' : ''}`} onClick={() => handleNavigate('about')}>
            {t.about}
          </button>
          <button
            className={`nav-link ${page === 'contacts' ? 'active' : ''}`}
            onClick={() => handleNavigate('contacts')}
          >
            {t.contacts}
          </button>
        </nav>

        <div className="header-contact">
          <span className="phone-icon">📞</span>
          <span className="phone-text">{t.phone}</span>
        </div>
      </header>
      {/* ========== MAIN CONTENT ========== */}
      <main className="main-content">
        {/* HOME PAGE */}
        {page === 'home' && (
          <div className="page page-home">
            {/* Hero Section */}
            <section className="hero">
              <div className="hero-content">
                <h1>{t.welcome}</h1>
                <p className="hero-subtitle">{t.subTitle}</p>
                <button className="btn btn-primary" onClick={() => handleNavigate('fleet')}>
                  {t.browseFleet} →
                </button>
              </div>
              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&h=400&fit=crop"
                  alt="Hero Car"
                  loading="lazy"
                />
              </div>
            </section>

            {/* Booking Form Section */}
            <section className="booking-section">
              <div className="booking-form">
                <h3>{t.booking}</h3>

                <div className="booking-grid">
                  <div className="form-group">
                    <label>{t.pickupDate}</label>
                    <input type="date" defaultValue={today} />
                  </div>

                  <div className="form-group">
                    <label>{t.pickupTime}</label>
                    <input type="time" defaultValue="11:00" />
                  </div>

                  <div className="form-group">
                    <label>{t.returnDate}</label>
                    <input type="date" defaultValue={tomorrow} />
                  </div>

                  <div className="form-group">
                    <label>{t.returnTime}</label>
                    <input type="time" defaultValue="11:00" />
                  </div>

                  <div className="form-group">
                    <label>{t.pickupLocation}</label>
                    <select>
                      <option>Toshkent</option>
                      <option>Buxoro</option>
                      <option>Samarqand</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>{t.returnLocation}</label>
                    <select>
                      <option>Toshkent</option>
                      <option>Buxoro</option>
                      <option>Samarqand</option>
                    </select>
                  </div>
                </div>

                <button className="btn btn-primary btn-full">{t.next}</button>
              </div>
            </section>

            {/* Popular Cars */}
            <section className="section popular-cars">
              <h2>{t.popular}</h2>
              <div className="cars-grid">
                {cars.slice(0, 4).map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    t={t}
                    onHover={setHoveredCard}
                    isHovered={hoveredCard === car.id}
                  />
                ))}
              </div>
            </section>

            {/* Advantages */}
            <section className="section advantages">
              <h2>{t.advantages}</h2>
              <div className="advantages-grid">
                <AdvantageCard icon="💰" title={t.fairPrices} desc={t.fairPricesDesc} />
                <AdvantageCard icon="🛡️" title={t.insurance} desc={t.insuranceDesc} />
                <AdvantageCard icon="🚚" title={t.delivery} desc={t.deliveryDesc} />
                <AdvantageCard icon="⭐" title={t.service24_7} desc={t.serviceDesc} />
              </div>
            </section>

            {/* Requirements */}
            <section className="section requirements">
              <h2>{t.requirements}</h2>
              <div className="requirements-grid">
                <RequirementCard number="1" title={t.driverLicense} desc="Kerak" />
                <RequirementCard number="2" title={t.minAge} desc={t.minAge} />
                <RequirementCard number="3" title={t.experience} desc={t.experience} />
                <RequirementCard number="4" title={t.passport} desc="Kerak" />
              </div>
            </section>
          </div>
        )}

        {/* FLEET PAGE */}
        {page === 'fleet' && (
          <div className="page page-fleet">
            <div className="page-header">
              <h2>{t.fleet}</h2>
              <p>
                {cars.length} {t.popular}
              </p>
            </div>

            <div className="cars-grid-large">
              {cars.map((car) => (
                <CarCardLarge
                  key={car.id}
                  car={car}
                  t={t}
                  onHover={setHoveredCard}
                  isHovered={hoveredCard === car.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* ABOUT PAGE */}
        {page === 'about' && (
          <div className="page page-about">
            <div className="page-header">
              <h2>{t.aboutTitle}</h2>
            </div>

            <div className="about-content">
              <p className="about-desc">{t.aboutDesc}</p>

              <h3>{t.whyChooseUs}</h3>
              <div className="advantages-list">
                {t.advantages_list.map((advantage, idx) => (
                  <p key={idx} className="advantage-item">
                    {advantage}
                  </p>
                ))}
              </div>

              <div className="about-info">
                <div className="info-card">
                  <h4>📞 Tez murojaat</h4>
                  <p>Savollaringizga tez javob beramiz</p>
                </div>
                <div className="info-card">
                  <h4>💼 Professional jamoasi</h4>
                  <p>Tajribali va sog'lom jamoasi</p>
                </div>
                <div className="info-card">
                  <h4>🌟 Yuqori sifat</h4>
                  <p>Eng yaxshi avtomobil va xizmat</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTACTS PAGE */}
        {page === 'contacts' && (
          <div className="page page-contacts">
            <div className="page-header">
              <h2>{t.contacts}</h2>
            </div>

            <div className="contacts-grid">
              <div className="contact-card">
                <h3>📞 {t.callCenter}</h3>
                <p>{t.callCenterDesc}</p>
                <div className="contact-items">
                  <a href="tel:+99899910030" className="contact-link">
                    {t.phone}
                  </a>
                  <a href="tel:+99895420030" className="contact-link">
                    {t.phone2}
                  </a>
                </div>
                <button className="btn btn-primary">{t.callNow}</button>
              </div>

              <div className="contact-card">
                <h3>📍 {t.address}</h3>
                <p>{t.address}</p>
                <p>{t.address2}</p>
              </div>

              <div className="contact-card">
                <h3>💬 {t.messenger}</h3>
                <p>24/7 aloqa:</p>
                <div className="contact-items">
                  <a href="https://wa.me/99899910030" className="contact-link">
                    {t.whatsapp}
                  </a>
                  <a href="https://t.me/aburent" className="contact-link">
                    {t.telegram}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========== FOOTER ========== */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4>{t.company}</h4>
            <p>Abu Rent - {t.subTitle}</p>
          </div>

          <div className="footer-column">
            <h4>{t.menu}</h4>
            <a href="#home" onClick={() => handleNavigate('home')}>
              {t.home}
            </a>
            <a href="#fleet" onClick={() => handleNavigate('fleet')}>
              {t.fleet}
            </a>
            <a href="#about" onClick={() => handleNavigate('about')}>
              {t.about}
            </a>
            <a href="#contacts" onClick={() => handleNavigate('contacts')}>
              {t.contacts}
            </a>
          </div>

          <div className="footer-column">
            <h4>{t.services}</h4>
            <a href="#service1">Avtomobil ijarasi</a>
            <a href="#service2">Shahar bo'ylab yetkazish</a>
            <a href="#service3">Xodim orqali ijarasi</a>
            <a href="#service4">Uzoq muddatli ijara</a>
          </div>

          <div className="footer-column">
            <h4>{t.followUs}</h4>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://telegram.com" target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t.allRightsReserved}</p>
          <p>Email: {t.email}</p>
        </div>
      </footer>

      <style>{globalStyles}</style>
    </div>
  );
}
// ============================================
// 4. SUB-COMPONENTS WITH HOVER
// ============================================

type CarCardProps = {
  car: Car;
  t: (typeof translations)[Lang];
  onHover: (id: number | null) => void;
  isHovered: boolean;
};

type AdvantageProps = { icon: string; title: string; desc: string };

type RequirementProps = { number: string; title: string; desc: string };

function CarCard({ car, t, onHover, isHovered }: CarCardProps) {
  return (
    <div
      className={`car-card ${isHovered ? 'hover-active' : ''}`}
      onMouseEnter={() => onHover(car.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="car-badge">{car.category}</div>
      <div className="car-image-wrapper">
        <img src={car.img} alt={car.name} loading="lazy" className="car-image" />
        <div className="image-overlay"></div>
      </div>
      <div className="car-info">
        <h4>{car.name}</h4>
        <p className="year">{car.year}</p>
        <div className="specs">
          <span>🚗 {car.seats}</span>
          <span>⛽ {car.fuel}</span>
        </div>
        <div className="price">
          <span className="price-value">от ${car.price}</span>
          <span className="price-period">/{t.pricePerDay}</span>
        </div>
      </div>
    </div>
  );
}

function CarCardLarge({ car, t, onHover, isHovered }: CarCardProps) {
  return (
    <div
      className={`car-card-large ${isHovered ? 'hover-active' : ''}`}
      onMouseEnter={() => onHover(car.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="car-badge">{car.category}</div>
      <div className="car-image-wrapper">
        <img src={car.img} alt={car.name} loading="lazy" className="car-image" />
        <div className="image-overlay-large"></div>
      </div>
      <div className="car-info-large">
        <h3>{car.name}</h3>
        <p className="year">{car.year}</p>
        <div className="specs-large">
          {car.specs.map((spec, idx) => (
            <span key={idx}>{spec}</span>
          ))}
        </div>
        <div className="price-large">
          <span className="price-value">от ${car.price}</span>
          <span className="price-period">/{t.pricePerDay}</span>
        </div>
      </div>
    </div>
  );
}

function AdvantageCard({ icon, title, desc }: AdvantageProps) {
  return (
    <div className="advantage-card">
      <div className="adv-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}

function RequirementCard({ number, title, desc }: RequirementProps) {
  return (
    <div className="requirement-card">
      <div className="req-number">{number}</div>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}



const globalStyles = `


  :root {
    --color-primary: #ff6b35;
    --color-primary-light: #ff8c42;
    --color-secondary: #004e89;
    --color-success: #06d6a0;
    --color-error: #ef476f;

    --bg-dark: #0f1419;
    --bg-dark-secondary: #1a1f2e;
    --bg-dark-tertiary: #252d3d;
    --text-dark: #ffffff;
    --text-dark-secondary: #b0b8c1;
    --border-dark: rgba(255, 255, 255, 0.1);

    --bg-light: #f5f7fa;
    --bg-light-secondary: #ffffff;
    --bg-light-tertiary: #f0f2f5;
    --text-light: #1a1f2e;
    --text-light-secondary: #5a6370;
    --border-light: #e0e4e9;
  }

  [data-theme="light"] {
    --bg-primary: var(--bg-light);
    --bg-secondary: var(--bg-light-secondary);
    --bg-tertiary: var(--bg-light-tertiary);
    --text-primary: var(--text-light);
    --text-secondary: var(--text-light-secondary);
    --border-color: var(--border-light);
  }

  [data-theme="dark"] {
    --bg-primary: var(--bg-dark);
    --bg-secondary: var(--bg-dark-secondary);
    --bg-tertiary: var(--bg-dark-tertiary);
    --text-primary: var(--text-dark);
    --text-secondary: var(--text-dark-secondary);
    --border-color: var(--border-dark);
  }

  /* ============================================
     GLOBAL STYLES
     ============================================ */

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
    line-height: 1.6;
  }

  .abu-rent-app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ============================================
     HEADER STYLES WITH HOVER
     ============================================ */

  .header {
    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
    padding: 20px 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .header:hover {
    box-shadow: 0 8px 30px rgba(255, 107, 53, 0.3);
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 28px;
    font-weight: 800;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform-origin: left center;
  }

  .logo:hover {
    transform: scale(1.08) translateX(5px);
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.3);
  }

  .logo-icon {
    font-size: 36px;
    display: inline-block;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .logo:hover .logo-icon {
    transform: scale(1.2) rotate(10deg);
  }

  .logo-text {
    letter-spacing: 0.5px;
  }

  .header-controls {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .lang-selector,
  .theme-toggle {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    backdrop-filter: blur(10px);
  }

  .lang-selector:hover,
  .theme-toggle:hover {
    background: rgba(255, 255, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.7);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }

  .lang-selector:active,
  .theme-toggle:active {
    transform: translateY(0);
  }

  .lang-selector {
    min-width: 100px;
  }

  .theme-toggle {
    padding: 10px 12px;
    font-size: 18px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .theme-toggle:hover {
    transform: translateY(-2px) rotate(15deg);
  }

  .navigation {
    display: flex;
    gap: 30px;
    max-width: 1400px;
    margin: 0 auto;
    flex-wrap: wrap;
  }

  .nav-link {
    background: transparent;
    border: none;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    padding: 8px 0;
    border-bottom: 3px solid transparent;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
  }

  .nav-link::before {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 3px;
    background: white;
    transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .nav-link:hover::before,
  .nav-link.active::before {
    width: 100%;
  }

  .nav-link:hover {
    transform: translateY(-3px);
  }

  .header-contact {
    max-width: 1400px;
    margin: 0 auto;
    text-align: right;
    color: white;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .header-contact:hover {
    transform: scale(1.05);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  .phone-icon {
    font-size: 20px;
    display: inline-block;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .header-contact:hover .phone-icon {
    transform: scale(1.3) rotate(-15deg);
  }

  /* ============================================
     MAIN CONTENT
     ============================================ */

  .main-content {
    flex: 1;
  }

  .page {
    min-height: 100vh;
    animation: fadeIn 0.5s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .page-header {
    text-align: center;
    padding: 60px 40px 40px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .page-header h2 {
    font-size: 42px;
    margin-bottom: 15px;
    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .page-header:hover h2 {
    transform: scale(1.05);
    filter: drop-shadow(0 0 10px rgba(255, 107, 53, 0.3));
  }

  /* ============================================
     HERO SECTION WITH HOVER
     ============================================ */

  .hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    align-items: center;
    padding: 80px 40px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .hero-content h1 {
    font-size: 56px;
    margin-bottom: 20px;
    line-height: 1.2;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .hero-content:hover h1 {
    color: #ff6b35;
    transform: translateX(10px);
  }

  .hero-subtitle {
    font-size: 18px;
    color: var(--text-secondary);
    margin-bottom: 30px;
    line-height: 1.6;
    transition: all 0.3s ease;
  }

  .hero-content:hover .hero-subtitle {
    color: var(--text-primary);
    transform: translateX(5px);
  }

  .hero-image {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
  }

  .hero-image img {
    width: 100%;
    border-radius: 16px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .hero-image:hover img {
    transform: scale(1.08) rotate(1deg);
    box-shadow: 0 30px 80px rgba(255, 107, 53, 0.3);
  }

  /* ============================================
     BOOKING FORM WITH HOVER
     ============================================ */

  .booking-section {
    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
    padding: 60px 40px;
    text-align: center;
    transition: all 0.4s ease;
  }

  .booking-section:hover {
    background: linear-gradient(135deg, #ff5722 0%, #ff7043 100%);
    box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.1);
  }

  .booking-form {
    background: var(--bg-secondary);
    max-width: 1000px;
    margin: 0 auto;
    padding: 50px;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .booking-form:hover {
    transform: translateY(-8px);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  }

  .booking-form h3 {
    font-size: 32px;
    color: var(--text-primary);
    margin-bottom: 40px;
    border-bottom: 4px solid #ff6b35;
    padding-bottom: 20px;
    transition: all 0.3s ease;
  }

  .booking-form:hover h3 {
    border-bottom-color: #ff8c42;
    transform: translateY(-3px);
  }

  .booking-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 25px;
    margin-bottom: 30px;
  }

  .form-group {
    text-align: left;
    transition: all 0.3s ease;
  }

  .form-group:hover {
    transform: translateY(-3px);
  }

  .form-group label {
    display: block;
    font-weight: 700;
    margin-bottom: 10px;
    color: var(--text-primary);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
  }

  .form-group:hover label {
    color: #ff6b35;
    transform: translateX(3px);
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 14px;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 15px;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .form-group input:hover,
  .form-group select:hover {
    border-color: #ff6b35;
    box-shadow: 0 0 8px rgba(255, 107, 53, 0.2);
    transform: translateY(-2px);
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 15px rgba(255, 107, 53, 0.4);
    transform: translateY(-3px);
  }

  /* ============================================
     BUTTON STYLES WITH HOVER
     ============================================ */

  .btn {
    border: none;
    padding: 14px 28px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: inline-block;
    text-decoration: none;
    position: relative;
    overflow: hidden;
  }

  .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
    transition: left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 1;
  }

  .btn:hover::before {
    left: 100%;
  }

  .btn-primary {
    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
    color: white;
    box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
  }

  .btn-primary:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 15px 40px rgba(255, 107, 53, 0.5);
  }

  .btn-primary:active {
    transform: translateY(-1px) scale(0.98);
  }

  .btn-full {
    width: 100%;
  }

  /* ============================================
     CARS GRID WITH HOVER
     ============================================ */

  .cars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 25px;
    padding: 0;
  }

  .cars-grid-large {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    padding: 0;
  }

  .car-card,
  .car-card-large {
    background: rgba(255, 107, 53, 0.08);
    border: 1px solid rgba(255, 107, 53, 0.2);
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    cursor: pointer;
  }

  [data-theme="light"] .car-card,
  [data-theme="light"] .car-card-large {
    background: rgba(255, 107, 53, 0.05);
    border-color: rgba(255, 107, 53, 0.15);
  }

  .car-card:hover,
  .car-card.hover-active,
  .car-card-large:hover,
  .car-card-large.hover-active {
    transform: translateY(-12px) scale(1.02);
    border-color: #ff6b35;
    box-shadow: 0 25px 50px rgba(255, 107, 53, 0.25);
  }

  .car-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 25px;
    font-size: 12px;
    font-weight: 700;
    z-index: 2;
    text-transform: uppercase;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .car-card:hover .car-badge,
  .car-card.hover-active .car-badge,
  .car-card-large:hover .car-badge,
  .car-card-large.hover-active .car-badge {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
  }

  .car-image-wrapper,
  .car-image-wrapper-large {
    position: relative;
    overflow: hidden;
    height: 200px;
  }

  .car-card-large .car-image-wrapper {
    height: 240px;
  }

  .car-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .car-card:hover .car-image,
  .car-card.hover-active .car-image,
  .car-card-large:hover .car-image,
  .car-card-large.hover-active .car-image {
    transform: scale(1.15) rotate(3deg);
  }

  .image-overlay,
  .image-overlay-large {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 30%, rgba(255, 107, 53, 0.2), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .car-card:hover .image-overlay,
  .car-card.hover-active .image-overlay,
  .car-card-large:hover .image-overlay-large,
  .car-card-large.hover-active .image-overlay-large {
    opacity: 1;
  }

  .car-info,
  .car-info-large {
    padding: 20px;
    transition: all 0.3s ease;
  }

  .car-card-large .car-info-large {
    padding: 25px;
  }

  .car-card:hover .car-info,
  .car-card.hover-active .car-info,
  .car-card-large:hover .car-info-large,
  .car-card-large.hover-active .car-info-large {
    transform: translateY(3px);
  }

  .car-info h4,
  .car-info-large h3 {
    font-size: 18px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
  }

  .car-card-large h3 {
    font-size: 20px;
  }

  .car-card:hover .car-info h4,
  .car-card.hover-active .car-info h4,
  .car-card-large:hover .car-info-large h3,
  .car-card-large.hover-active .car-info-large h3 {
    color: #ff6b35;
    transform: translateX(5px);
  }

  .year {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 15px;
    transition: all 0.3s ease;
  }

  .car-card:hover .year,
  .car-card.hover-active .year {
    color: #ff6b35;
  }

  .specs,
  .specs-large {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 15px;
    font-size: 13px;
    transition: all 0.3s ease;
  }

  .specs-large {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .specs span,
  .specs-large span {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .car-card:hover .specs span,
  .car-card.hover-active .specs span,
  .car-card-large:hover .specs-large span,
  .car-card-large.hover-active .specs-large span {
    transform: scale(1.1);
    text-shadow: 0 0 10px rgba(255, 107, 53, 0.3);
  }

  .price,
  .price-large {
    display: flex;
    align-items: baseline;
    gap: 5px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 107, 53, 0.3);
    transition: all 0.3s ease;
  }

  .price-large {
    padding-top: 20px;
  }

  .car-card:hover .price,
  .car-card.hover-active .price,
  .car-card-large:hover .price-large,
  .car-card-large.hover-active .price-large {
    border-top-color: #ff6b35;
  }

  .price-value {
    font-weight: 700;
    color: #ff6b35;
    font-size: 18px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .price-large .price-value {
    font-size: 22px;
  }

  .car-card:hover .price-value,
  .car-card.hover-active .price-value,
  .car-card-large:hover .price-value,
  .car-card-large.hover-active .price-value {
    transform: scale(1.15);
  }

  .price-period {
    font-size: 13px;
    color: var(--text-secondary);
    transition: all 0.3s ease;
  }

  /* ============================================
     SECTION STYLES WITH HOVER
     ============================================ */

  .section {
    padding: 80px 40px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    transition: all 0.4s ease;
  }

  .section:hover {
    transform: translateY(-2px);
  }

  .section h2 {
    text-align: center;
    font-size: 42px;
    margin-bottom: 50px;
    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .section:hover h2 {
    transform: scale(1.05);
    filter: drop-shadow(0 0 10px rgba(255, 107, 53, 0.2));
  }

  /* ============================================
     ADVANTAGES SECTION WITH HOVER
     ============================================ */

  .advantages {
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);
    transition: all 0.4s ease;
  }

  .advantages:hover {
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(255, 107, 53, 0.08) 100%);
  }

  .advantages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
  }

  .advantage-card {
    background: var(--bg-secondary);
    padding: 35px;
    border-radius: 14px;
    text-align: center;
    border: 1px solid var(--border-color);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }

  .advantage-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%);
    transition: left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 0;
  }

  .advantage-card:hover::before {
    left: 100%;
  }

  .advantage-card:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 50px rgba(255, 107, 53, 0.2);
    border-color: #ff6b35;
  }

  .adv-icon {
    font-size: 48px;
    margin-bottom: 20px;
    display: inline-block;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    z-index: 1;
  }

  .advantage-card:hover .adv-icon {
    transform: scale(1.2) rotate(15deg) translateY(-10px);
    filter: drop-shadow(0 10px 20px rgba(255, 107, 53, 0.3));
  }

  .advantage-card h4 {
    font-size: 18px;
    margin-bottom: 12px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  .advantage-card:hover h4 {
    color: #ff6b35;
    transform: translateY(-3px);
  }

  .advantage-card p {
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.6;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  .advantage-card:hover p {
    color: var(--text-primary);
  }

  /* ============================================
     REQUIREMENTS SECTION WITH HOVER
     ============================================ */

  .requirements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 25px;
  }

  .requirement-card {
    background: rgba(255, 107, 53, 0.1);
    border: 2px solid rgba(255, 107, 53, 0.3);
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }

  .requirement-card::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: 50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, transparent 60%);
    transition: all 0.4s ease;
    transform: translateX(-50%);
  }

  .requirement-card:hover {
    border-color: #ff6b35;
    box-shadow: 0 15px 40px rgba(255, 107, 53, 0.2);
    transform: translateY(-10px) scale(1.02);
  }

  .requirement-card:hover::after {
    bottom: -20%;
  }

  .req-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
    color: white;
    border-radius: 50%;
    font-weight: 700;
    font-size: 26px;
    margin-bottom: 20px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    z-index: 1;
  }

  .requirement-card:hover .req-number {
    transform: scale(1.2) rotate(360deg);
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);
  }

  .requirement-card h4 {
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 700;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  .requirement-card:hover h4 {
    color: #ff6b35;
    transform: translateY(-3px);
  }

  .requirement-card p {
    font-size: 14px;
    color: var(--text-secondary);
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  .requirement-card:hover p {
    color: var(--text-primary);
  }

  /* ============================================
     ABOUT PAGE WITH HOVER
     ============================================ */

  .page-about {
    padding-bottom: 80px;
  }

  .about-content {
    background: rgba(255, 107, 53, 0.1);
    border: 1px solid rgba(255, 107, 53, 0.2);
    padding: 40px;
    border-radius: 14px;
    max-width: 900px;
    margin: 40px auto;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .about-content:hover {
    border-color: #ff6b35;
    box-shadow: 0 20px 60px rgba(255, 107, 53, 0.15);
    transform: translateY(-5px);
  }

  .about-desc {
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 30px;
    color: var(--text-secondary);
    transition: all 0.3s ease;
  }

  .about-content:hover .about-desc {
    color: var(--text-primary);
  }

  .about-content h3 {
    font-size: 24px;
    color: #ff6b35;
    margin: 30px 0 20px 0;
    transition: all 0.3s ease;
  }

  .about-content:hover h3 {
    transform: translateX(10px);
    text-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
  }

  .advantages-list {
    display: grid;
    gap: 12px;
    margin-bottom: 40px;
  }

  .advantage-item {
    font-size: 16px;
    line-height: 1.6;
    padding: 12px 0;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .advantage-item:hover {
    color: #ff6b35;
    transform: translateX(10px);
    padding-left: 10px;
  }

  .about-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
    margin-top: 40px;
  }

  .info-card {
    background: var(--bg-secondary);
    padding: 30px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    text-align: center;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .info-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 40px rgba(255, 107, 53, 0.15);
    border-color: #ff6b35;
  }

  .info-card h4 {
    font-size: 18px;
    margin-bottom: 10px;
    transition: all 0.3s ease;
  }

  .info-card:hover h4 {
    color: #ff6b35;
    transform: scale(1.1);
  }

  .info-card p {
    color: var(--text-secondary);
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .info-card:hover p {
    color: var(--text-primary);
  }

  /* ============================================
     CONTACTS PAGE WITH HOVER
     ============================================ */

  .page-contacts {
    padding-bottom: 80px;
  }

  .contacts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    max-width: 1200px;
    margin: 40px auto;
  }

  .contact-card {
    background: rgba(255, 107, 53, 0.1);
    border: 1px solid rgba(255, 107, 53, 0.2);
    padding: 35px;
    border-radius: 14px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }

  .contact-card::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 60%);
    transition: all 0.4s ease;
  }

  .contact-card:hover::before {
    top: -20%;
    right: -20%;
  }

  .contact-card:hover {
    transform: translateY(-12px) scale(1.02);
    border-color: #ff6b35;
    box-shadow: 0 20px 50px rgba(255, 107, 53, 0.2);
  }

  .contact-card h3 {
    font-size: 20px;
    color: #ff6b35;
    margin-bottom: 15px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  .contact-card:hover h3 {
    transform: translateX(5px);
    text-shadow: 0 0 15px rgba(255, 107, 53, 0.3);
  }

  .contact-card p {
    color: var(--text-secondary);
    font-size: 14px;
    margin-bottom: 10px;
    line-height: 1.6;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  .contact-card:hover p {
    color: var(--text-primary);
  }

  .contact-items {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .contact-link {
    color: #ff6b35;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: inline-block;
  }

  .contact-link:hover {
    color: #ff8c42;
    text-decoration: underline;
    transform: translateX(5px) scale(1.05);
  }

  /* ============================================
     FOOTER WITH HOVER
     ============================================ */

  .footer {
    background: linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%);
    color: white;
    padding: 60px 40px 30px;
    margin-top: 80px;
    transition: all 0.4s ease;
  }

  [data-theme="light"] .footer {
    background: linear-gradient(135deg, #f0f2f5 0%, #e8eaef 100%);
    color: #1a1f2e;
  }

  .footer:hover {
    box-shadow: inset 0 20px 60px rgba(255, 107, 53, 0.1);
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 40px;
    max-width: 1400px;
    margin: 0 auto 40px;
  }

  .footer-column h4 {
    font-size: 16px;
    margin-bottom: 20px;
    color: #ff6b35;
    font-weight: 700;
    transition: all 0.3s ease;
  }

  .footer-column:hover h4 {
    transform: translateX(5px);
    text-shadow: 0 0 15px rgba(255, 107, 53, 0.3);
  }

  .footer-column p {
    font-size: 14px;
    line-height: 1.8;
    margin-bottom: 10px;
    opacity: 0.8;
    transition: all 0.3s ease;
  }

  .footer-column:hover p {
    opacity: 1;
  }

  .footer-column a {
    display: block;
    color: inherit;
    text-decoration: none;
    font-size: 14px;
    margin-bottom: 10px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    opacity: 0.8;
    position: relative;
    padding-left: 0;
  }

  .footer-column a::before {
    content: '→ ';
    opacity: 0;
    transition: all 0.3s ease;
    position: absolute;
    left: 0;
  }

  .footer-column a:hover {
    color: #ff6b35;
    opacity: 1;
    padding-left: 15px;
  }

  .footer-column a:hover::before {
    opacity: 1;
  }

  .footer-bottom {
    text-align: center;
    padding-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 13px;
    opacity: 0.7;
    transition: all 0.3s ease;
  }

  .footer-bottom:hover {
    opacity: 1;
  }

  .footer-bottom p {
    margin-bottom: 8px;
    transition: all 0.3s ease;
  }

  .footer-bottom:hover p {
    transform: translateY(-2px);
  }

  /* ============================================
     RESPONSIVE STYLES
     ============================================ */

  @media (max-width: 1024px) {
    .hero {
      grid-template-columns: 1fr;
      padding: 60px 30px;
      gap: 40px;
    }

    .booking-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .section {
      padding: 60px 30px;
    }

    .page-header {
      padding: 40px 30px 30px;
    }
  }

  @media (max-width: 768px) {
    .header {
      padding: 15px 20px;
    }

    .nav-link:hover {
      transform: none;
    }

    .btn:hover {
      transform: scale(1.02);
    }

    .car-card:hover,
    .car-card-large:hover {
      transform: translateY(-8px);
    }

    .advantage-card:hover {
      transform: translateY(-8px);
    }

    .requirement-card:hover {
      transform: translateY(-8px);
    }
  }

  @media (max-width: 480px) {
    .logo:hover {
      transform: scale(1.02);
    }

    .btn:hover {
      transform: none;
    }

    .car-card:hover,
    .car-card-large:hover {
      transform: none;
    }
  }
`;
