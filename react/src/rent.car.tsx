
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth as firebaseAuth } from './Firebase';

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
  imageUrls: string[];
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
    imageUrls: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&h=650&fit=crop',
    ],
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
    imageUrls: [
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=900&h=650&fit=crop',
    ],
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
    imageUrls: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=900&h=650&fit=crop',
    ],
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
    imageUrls: [
      'https://images.unsplash.com/photo-1549927681-13f288c8f4b9?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=900&h=650&fit=crop',
    ],
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
    imageUrls: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=900&h=650&fit=crop',
    ],
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
    imageUrls: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=900&h=650&fit=crop',
    ],
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
    imageUrls: [
      'https://images.unsplash.com/photo-1549924231-f129b911e442?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1493238792000-8113da705763?w=900&h=650&fit=crop',
    ],
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
    imageUrls: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&h=650&fit=crop',
    ],
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

type BookingStatus = 'pending' | 'approved' | 'rejected';

type Booking = {
  id: string;
  carId: number;
  carName: string;
  userEmail: string;
  phone: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
};

type ChatMessage = {
  id: string;
  bookingId: string;
  sender: 'admin' | 'user';
  text: string;
  time: string;
};

const BOOKINGS_KEY = 'aburent_bookings_v1';
const MESSAGES_KEY = 'aburent_messages_v1';

const readLS = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const rid = () => Math.random().toString(36).slice(2, 10);
const formatDate = (value: string) => new Date(value).toLocaleDateString('uz-UZ');

const isOverlap = (startA: string, endA: string, startB: string, endB: string) =>
  !(endA < startB || endB < startA);

const getToday = () => new Date().toISOString().slice(0, 10);
const getTomorrow = () => new Date(Date.now() + 86400000).toISOString().slice(0, 10);

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
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [newCarName, setNewCarName] = useState('');
  const [newCarCategory, setNewCarCategory] = useState<Car['category']>('Premium');
  const [newCarPrice, setNewCarPrice] = useState(150);
  const [newCarFuel, setNewCarFuel] = useState('Petrol');
  const [newCarTransmission, setNewCarTransmission] = useState('Automatic');
  const [newCarYear, setNewCarYear] = useState(new Date().getFullYear());
  const [newCarSeats, setNewCarSeats] = useState(5);
  const [newCarImage, setNewCarImage] = useState('');
  const [newCarImages, setNewCarImages] = useState('');

  const [bookings, setBookings] = useState<Booking[]>(() => readLS<Booking[]>(BOOKINGS_KEY, []));
  const [messages, setMessages] = useState<ChatMessage[]>(() => readLS<ChatMessage[]>(MESSAGES_KEY, []));
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingStart, setBookingStart] = useState(getToday());
  const [bookingEnd, setBookingEnd] = useState(getTomorrow());
  const [bookingError, setBookingError] = useState('');
  const [activeChatBookingId, setActiveChatBookingId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [hoverImageIndex, setHoverImageIndex] = useState<Record<number, number>>({});
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('aburent-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('aburent-lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  const t = translations[lang];
  const isAdmin = (user?.email || '').toLowerCase() === 'admin123@gamil.com';

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

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

  const today = getToday();
  const tomorrow = getTomorrow();

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(firebaseAuth, authEmail, authPassword);
      } else {
        await createUserWithEmailAndPassword(firebaseAuth, authEmail, authPassword);
      }
      setAuthPassword('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Auth error';
      setAuthError(message);
    }
  };

  const handleLogout = async () => {
    await signOut(firebaseAuth);
    setAuthEmail('');
    setAuthPassword('');
    setPage('home');
  };

  const handleAddCar = () => {
    const imageList = newCarImages
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 10);
    const finalImages = imageList.length ? imageList : newCarImage.trim() ? [newCarImage.trim()] : [];
    if (!newCarName.trim() || finalImages.length === 0) return;
    const nextId = Math.max(0, ...cars.map((car) => car.id)) + 1;
    const newCar: Car = {
      id: nextId,
      name: newCarName.trim(),
      category: newCarCategory,
      price: Number(newCarPrice) || 0,
      fuel: newCarFuel.trim(),
      transmission: newCarTransmission.trim(),
      year: Number(newCarYear) || new Date().getFullYear(),
      seats: Number(newCarSeats) || 4,
      imageUrls: finalImages,
      specs: [
        `🚗 ${Number(newCarSeats) || 4} мест`,
        `⛽ ${newCarFuel.trim() || 'Petrol'}`,
        `⚙️ ${newCarTransmission.trim() || 'Automatic'}`,
        `📅 ${Number(newCarYear) || new Date().getFullYear()}`,
      ],
    };
    setCars((prev) => [newCar, ...prev]);
    setNewCarName('');
    setNewCarImage('');
    setNewCarImages('');
  };

  const isCarUnavailable = (carId: number, start: string, end: string) =>
    bookings.some(
      (booking) =>
        booking.carId === carId &&
        booking.status !== 'rejected' &&
        isOverlap(start, end, booking.startDate, booking.endDate),
    );

  const openBooking = (car: Car) => {
    setSelectedCar(car);
    setBookingStart(today);
    setBookingEnd(tomorrow);
    setBookingPhone('');
    setBookingError('');
  };

  const closeBooking = () => {
    setSelectedCar(null);
    setBookingError('');
  };

  const handleBookingSubmit = () => {
    if (!selectedCar) return;
    if (!bookingPhone.trim()) {
      setBookingError('Telefon raqamni kiriting.');
      return;
    }
    if (bookingEnd < bookingStart) {
      setBookingError('Qaytarish sanasi noto‘g‘ri.');
      return;
    }
    if (isCarUnavailable(selectedCar.id, bookingStart, bookingEnd)) {
      setBookingError('Bu muddatga mashina band.');
      return;
    }
    const dayCount =
      Math.max(1, Math.ceil((new Date(bookingEnd).getTime() - new Date(bookingStart).getTime()) / 86400000)) || 1;
    const totalPrice = dayCount * selectedCar.price;
    const booking: Booking = {
      id: rid(),
      carId: selectedCar.id,
      carName: selectedCar.name,
      userEmail: user?.email || 'unknown',
      phone: bookingPhone.trim(),
      startDate: bookingStart,
      endDate: bookingEnd,
      totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [booking, ...prev]);
    setSelectedCar(null);
  };

  const handleBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)));
  };

  const handleSendMessage = (bookingId: string, sender: 'admin' | 'user') => {
    if (!chatInput.trim()) return;
    const message: ChatMessage = {
      id: rid(),
      bookingId,
      sender,
      text: chatInput.trim(),
      time: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, message]);
    setChatInput('');
  };

  const userBookings = bookings.filter((booking) => booking.userEmail === user?.email);

  const handleImageMove = (carId: number, imageCount: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (imageCount <= 1) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
    const nextIndex = Math.min(imageCount - 1, Math.floor((x / bounds.width) * imageCount));
    setHoverImageIndex((prev) => ({ ...prev, [carId]: nextIndex }));
  };

  const isCarBookedAny = (carId: number) =>
    bookings.some((booking) => booking.carId === carId && booking.status !== 'rejected');

  if (authLoading) {
    return (
      <div className={`abu-rent-app theme-${theme}`}>
        <div className="auth-screen">
          <div className="auth-card">
            <p>Loading...</p>
          </div>
        </div>
        <style>{globalStyles}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`abu-rent-app theme-${theme}`}>
        <div className="auth-screen">
          <div className="auth-card">
            <div className="auth-brand">
              <span className="brand-text">ABURENT</span>
              <img className="brand-logo" src="/abu-rent-logo.png" alt="Abu Rent logo" />
            </div>
            <p className="auth-note">
              Admin email: <b>Admin123@gamil.com</b> | Parol: <b>Admin123</b>
            </p>
            <div className="auth-tabs">
              <button
                className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
                type="button"
              >
                Log In
              </button>
              <button
                className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
                type="button"
              >
                Sign Up
              </button>
            </div>
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              <label>
                Email
                <input
                  type="email"
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  required
                />
              </label>
              <label>
                Parol
                <input
                  type="password"
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  required
                />
              </label>
              {authError && <p className="auth-error">{authError}</p>}
              <button className="btn btn-primary btn-full" type="submit">
                {authMode === 'login' ? 'Kirish' : 'Ro‘yxatdan o‘tish'}
              </button>
            </form>
          </div>
        </div>
        <style>{globalStyles}</style>
      </div>
    );
  }

  return (
    <div className={`abu-rent-app theme-${theme}`}>
      {/* ========== HEADER ========== */}
      <header className="header">
        <div className="header-top">
          <div className="logo" onClick={() => handleNavigate('home')}>
            <span className="logo-text">ABURENT</span>
            <img className="logo-image" src="/abu-rent-logo.png" alt="Abu Rent logo" />
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

            <div className="user-chip">
              <span>{user?.email}</span>
              {isAdmin && <span className="admin-badge">ADMIN</span>}
            </div>
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
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
                    imageIndex={hoverImageIndex[car.id] || 0}
                    onImageMove={handleImageMove}
                    onImageLeave={(carId) => setHoverImageIndex((prev) => ({ ...prev, [carId]: 0 }))}
                    onBook={openBooking}
                    isBooked={isCarBookedAny(car.id)}
                    onZoom={setZoomImage}
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

            {isAdmin && (
              <section className="admin-panel">
                <h3>Admin: Mashina qo'shish</h3>
                <div className="admin-grid">
                  <label>
                    Nomi
                    <input value={newCarName} onChange={(event) => setNewCarName(event.target.value)} />
                  </label>
                  <label>
                    Kategoriya
                    <select value={newCarCategory} onChange={(event) => setNewCarCategory(event.target.value as Car['category'])}>
                      <option value="Premium">Premium</option>
                      <option value="Sport">Sport</option>
                      <option value="SUV">SUV</option>
                      <option value="Oddiy">Oddiy</option>
                    </select>
                  </label>
                  <label>
                    Narx (kuniga)
                    <input
                      type="number"
                      value={newCarPrice}
                      onChange={(event) => setNewCarPrice(Number(event.target.value))}
                    />
                  </label>
                  <label>
                    Yoqilg'i
                    <input value={newCarFuel} onChange={(event) => setNewCarFuel(event.target.value)} />
                  </label>
                  <label>
                    Transmissiya
                    <input value={newCarTransmission} onChange={(event) => setNewCarTransmission(event.target.value)} />
                  </label>
                  <label>
                    Yili
                    <input
                      type="number"
                      value={newCarYear}
                      onChange={(event) => setNewCarYear(Number(event.target.value))}
                    />
                  </label>
                  <label>
                    O'rindiqlar
                    <input
                      type="number"
                      value={newCarSeats}
                      onChange={(event) => setNewCarSeats(Number(event.target.value))}
                    />
                  </label>
                  <label className="admin-span">
                    Rasm URL
                    <input value={newCarImage} onChange={(event) => setNewCarImage(event.target.value)} />
                  </label>
                  <label className="admin-span">
                    10 ta rasm (har qatorda bitta URL)
                    <textarea
                      value={newCarImages}
                      onChange={(event) => setNewCarImages(event.target.value)}
                      rows={4}
                    />
                  </label>
                </div>
                <div className="admin-actions">
                  <button className="btn btn-primary" onClick={handleAddCar}>
                    Qo'shish
                  </button>
                </div>
              </section>
            )}

            <div className="cars-grid-large">
              {cars.map((car) => (
                <CarCardLarge
                  key={car.id}
                  car={car}
                  t={t}
                  onHover={setHoveredCard}
                  isHovered={hoveredCard === car.id}
                  imageIndex={hoverImageIndex[car.id] || 0}
                  onImageMove={handleImageMove}
                  onImageLeave={(carId) => setHoverImageIndex((prev) => ({ ...prev, [carId]: 0 }))}
                  onBook={openBooking}
                  isBooked={isCarBookedAny(car.id)}
                  onZoom={setZoomImage}
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

        {userBookings.length > 0 && (
          <section className="section booking-list">
            <h2>Mening bandlarim</h2>
            <div className="booking-list-grid">
              {userBookings.map((booking) => (
                <div className="booking-card" key={booking.id}>
                  <h4>{booking.carName}</h4>
                  <p>
                    Sana: {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </p>
                  <p>Telefon: {booking.phone}</p>
                  <p>Narx: ${booking.totalPrice}</p>
                  <p className={`booking-status status-${booking.status}`}>Holat: {booking.status}</p>
                  <button
                    className="btn btn-outline"
                    onClick={() => setActiveChatBookingId(booking.id)}
                  >
                    Chat
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {isAdmin && (
          <section className="section booking-list">
            <h2>Admin: Bandlar</h2>
            <div className="booking-list-grid">
              {bookings.map((booking) => (
                <div className="booking-card" key={booking.id}>
                  <h4>{booking.carName}</h4>
                  <p>User: {booking.userEmail}</p>
                  <p>
                    Sana: {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </p>
                  <p>Telefon: {booking.phone}</p>
                  <p>Narx: ${booking.totalPrice}</p>
                  <p className={`booking-status status-${booking.status}`}>Holat: {booking.status}</p>
                  <div className="booking-actions">
                    <button className="btn btn-primary" onClick={() => handleBookingStatus(booking.id, 'approved')}>
                      Ruxsat
                    </button>
                    <button className="btn btn-outline" onClick={() => handleBookingStatus(booking.id, 'rejected')}>
                      Rad etish
                    </button>
                    <button className="btn btn-outline" onClick={() => setActiveChatBookingId(booking.id)}>
                      Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {selectedCar && (
        <div className="modal-backdrop" onClick={closeBooking}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>Band qilish: {selectedCar.name}</h3>
            <div className="modal-grid">
              <label>
                Telefon
                <input value={bookingPhone} onChange={(event) => setBookingPhone(event.target.value)} />
              </label>
              <label>
                Olish sanasi
                <input type="date" value={bookingStart} onChange={(event) => setBookingStart(event.target.value)} />
              </label>
              <label>
                Qaytarish sanasi
                <input type="date" value={bookingEnd} onChange={(event) => setBookingEnd(event.target.value)} />
              </label>
            </div>
            <p className="price-preview">
              Kuniga: ${selectedCar.price} | Jami:{' '}
              {Math.max(
                1,
                Math.ceil((new Date(bookingEnd).getTime() - new Date(bookingStart).getTime()) / 86400000) || 1,
              ) * selectedCar.price}
            </p>
            {bookingError && <p className="auth-error">{bookingError}</p>}
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={closeBooking}>
                Bekor
              </button>
              <button className="btn btn-primary" onClick={handleBookingSubmit}>
                Band qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {activeChatBookingId && (
        <div className="modal-backdrop" onClick={() => setActiveChatBookingId(null)}>
          <div className="modal-card chat-card" onClick={(event) => event.stopPropagation()}>
            <h3>Chat</h3>
            <div className="chat-messages">
              {messages
                .filter((msg) => msg.bookingId === activeChatBookingId)
                .map((msg) => (
                  <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                    <p>{msg.text}</p>
                    <span>{new Date(msg.time).toLocaleTimeString()}</span>
                  </div>
                ))}
            </div>
            <div className="chat-compose">
              <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} />
              <button
                className="btn btn-primary"
                onClick={() => handleSendMessage(activeChatBookingId, isAdmin ? 'admin' : 'user')}
              >
                Yuborish
              </button>
            </div>
          </div>
        </div>
      )}

      {zoomImage && (
        <div className="modal-backdrop" onClick={() => setZoomImage(null)}>
          <div className="modal-card image-zoom" onClick={(event) => event.stopPropagation()}>
            <img src={zoomImage} alt="Zoom" />
          </div>
        </div>
      )}

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
  imageIndex: number;
  onImageMove: (carId: number, imageCount: number, event: React.MouseEvent<HTMLDivElement>) => void;
  onImageLeave: (carId: number) => void;
  onBook: (car: Car) => void;
  isBooked: boolean;
  onZoom: (src: string) => void;
};

type AdvantageProps = { icon: string; title: string; desc: string };

type RequirementProps = { number: string; title: string; desc: string };

function CarCard({ car, t, onHover, isHovered, imageIndex, onImageMove, onImageLeave, onBook, isBooked, onZoom }: CarCardProps) {
  const currentImage = car.imageUrls[imageIndex] || car.imageUrls[0];
  return (
    <div
      className={`car-card ${isHovered ? 'hover-active' : ''}`}
      onMouseEnter={() => onHover(car.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="car-badge">{car.category}</div>
      {isBooked && <div className="car-booked">Band</div>}
      <div
        className="car-image-wrapper"
        onMouseMove={(event) => onImageMove(car.id, car.imageUrls.length, event)}
        onMouseLeave={() => onImageLeave(car.id)}
        onClick={() => onZoom(currentImage)}
      >
        <img src={currentImage} alt={car.name} loading="lazy" className="car-image" />
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
        <button className="btn btn-primary btn-full" disabled={isBooked} onClick={() => onBook(car)}>
          {isBooked ? 'Band' : t.reserve}
        </button>
      </div>
    </div>
  );
}

function CarCardLarge({ car, t, onHover, isHovered, imageIndex, onImageMove, onImageLeave, onBook, isBooked, onZoom }: CarCardProps) {
  const currentImage = car.imageUrls[imageIndex] || car.imageUrls[0];
  return (
    <div
      className={`car-card-large ${isHovered ? 'hover-active' : ''}`}
      onMouseEnter={() => onHover(car.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="car-badge">{car.category}</div>
      {isBooked && <div className="car-booked">Band</div>}
      <div
        className="car-image-wrapper"
        onMouseMove={(event) => onImageMove(car.id, car.imageUrls.length, event)}
        onMouseLeave={() => onImageLeave(car.id)}
        onClick={() => onZoom(currentImage)}
      >
        <img src={currentImage} alt={car.name} loading="lazy" className="car-image" />
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
        <button className="btn btn-primary btn-full" disabled={isBooked} onClick={() => onBook(car)}>
          {isBooked ? 'Band' : t.reserve}
        </button>
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
    --color-primary: #f0a215;
    --color-primary-light: #ffd670;
    --color-secondary: #1f9d8b;
    --color-success: #16a34a;
    --color-error: #ef476f;

    --bg-dark: #0b0f14;
    --bg-dark-secondary: #12161d;
    --bg-dark-tertiary: #1a2029;
    --text-dark: #f8fafc;
    --text-dark-secondary: #b7c0cc;
    --border-dark: rgba(255, 255, 255, 0.1);

    --bg-light: #fff6d8;
    --bg-light-secondary: #fffaf0;
    --bg-light-tertiary: #f5e7c1;
    --text-light: #1a1a1a;
    --text-light-secondary: #4b4b4b;
    --border-light: #e5d6ac;
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

  .auth-screen {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 40px 16px;
    background: radial-gradient(circle at top, rgba(240, 162, 21, 0.18), transparent 50%),
      linear-gradient(180deg, #0b0f14 0%, #11161e 100%);
  }

  .auth-card {
    width: min(520px, 95vw);
    background: rgba(15, 19, 26, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
    color: var(--text-dark);
  }

  .auth-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .auth-brand .brand-text {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 2px;
  }

  .auth-brand .brand-logo {
    width: 54px;
    height: 54px;
    border-radius: 14px;
    object-fit: cover;
  }

  .auth-note {
    text-align: center;
    font-size: 13px;
    color: var(--text-dark-secondary);
    margin-bottom: 18px;
  }

  .auth-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 18px;
  }

  .auth-tab {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-dark);
    padding: 10px;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .auth-tab.active {
    background: var(--color-primary);
    color: #1a1204;
    border-color: var(--color-primary-light);
  }

  .auth-form {
    display: grid;
    gap: 12px;
  }

  .auth-form label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: var(--text-dark-secondary);
  }

  .auth-form input {
    border-radius: 12px;
    background: #121723;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: var(--text-dark);
    padding: 12px;
  }

  .auth-error {
    color: var(--color-error);
    font-size: 13px;
  }

  /* ============================================
     HEADER STYLES WITH HOVER
     ============================================ */

  .header {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    padding: 20px 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .header:hover {
    box-shadow: 0 8px 30px rgba(240, 162, 21, 0.3);
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

  .logo-image {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    object-fit: cover;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .logo:hover .logo-image {
    transform: scale(1.08) rotate(6deg);
    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.45);
  }

  .logo-text {
    letter-spacing: 0.5px;
  }

  .header-controls {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .user-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: white;
    font-size: 12px;
    font-weight: 600;
  }

  .admin-badge {
    background: var(--color-primary-light);
    color: #1a1204;
    padding: 2px 8px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 11px;
    text-transform: uppercase;
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
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .page-header:hover h2 {
    transform: scale(1.05);
    filter: drop-shadow(0 0 10px rgba(240, 162, 21, 0.3));
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
    color: var(--color-primary);
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
    box-shadow: 0 30px 80px rgba(240, 162, 21, 0.3);
  }

  /* ============================================
     BOOKING FORM WITH HOVER
     ============================================ */

  .booking-section {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    padding: 60px 40px;
    text-align: center;
    transition: all 0.4s ease;
  }

  .booking-section:hover {
    background: linear-gradient(135deg, #d4880f 0%, #ffcc55 100%);
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
    border-bottom: 4px solid var(--color-primary);
    padding-bottom: 20px;
    transition: all 0.3s ease;
  }

  .booking-form:hover h3 {
    border-bottom-color: var(--color-primary-light);
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
    color: var(--color-primary);
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
    border-color: var(--color-primary);
    box-shadow: 0 0 8px rgba(240, 162, 21, 0.2);
    transform: translateY(-2px);
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 15px rgba(240, 162, 21, 0.4);
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
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    color: white;
    box-shadow: 0 8px 20px rgba(240, 162, 21, 0.3);
  }

  .btn-primary:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 15px 40px rgba(240, 162, 21, 0.5);
  }

  .btn-primary:active {
    transform: translateY(-1px) scale(0.98);
  }

  .btn-full {
    width: 100%;
  }

  .btn-outline {
    background: transparent;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: none;
  }

  .btn-outline:hover {
    transform: translateY(-2px);
    border-color: var(--color-primary-light);
    color: var(--color-primary-light);
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
    background: rgba(240, 162, 21, 0.08);
    border: 1px solid rgba(240, 162, 21, 0.2);
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    cursor: pointer;
  }

  [data-theme="light"] .car-card,
  [data-theme="light"] .car-card-large {
    background: rgba(240, 162, 21, 0.05);
    border-color: rgba(240, 162, 21, 0.15);
  }

  .car-card:hover,
  .car-card.hover-active,
  .car-card-large:hover,
  .car-card-large.hover-active {
    transform: translateY(-12px) scale(1.02);
    border-color: var(--color-primary);
    box-shadow: 0 25px 50px rgba(240, 162, 21, 0.25);
  }

  .car-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
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
    box-shadow: 0 8px 20px rgba(240, 162, 21, 0.4);
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
    background: radial-gradient(circle at 30% 30%, rgba(240, 162, 21, 0.2), transparent);
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
    color: var(--color-primary);
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
    color: var(--color-primary);
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
    text-shadow: 0 0 10px rgba(240, 162, 21, 0.3);
  }

  .price,
  .price-large {
    display: flex;
    align-items: baseline;
    gap: 5px;
    padding-top: 15px;
    border-top: 1px solid rgba(240, 162, 21, 0.3);
    transition: all 0.3s ease;
  }

  .price-large {
    padding-top: 20px;
  }

  .car-card:hover .price,
  .car-card.hover-active .price,
  .car-card-large:hover .price-large,
  .car-card-large.hover-active .price-large {
    border-top-color: var(--color-primary);
  }

  .price-value {
    font-weight: 700;
    color: var(--color-primary);
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

  .car-info .btn,
  .car-info-large .btn {
    margin-top: 10px;
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
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .section:hover h2 {
    transform: scale(1.05);
    filter: drop-shadow(0 0 10px rgba(240, 162, 21, 0.2));
  }

  .admin-panel {
    max-width: 1200px;
    margin: 0 auto 30px;
    background: rgba(15, 20, 28, 0.9);
    border: 1px solid rgba(240, 162, 21, 0.3);
    border-radius: 16px;
    padding: 24px;
    color: var(--text-primary);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  }

  .admin-panel h3 {
    margin-bottom: 16px;
    color: var(--color-primary);
  }

  .admin-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
  }

  .admin-grid label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .admin-grid input,
  .admin-grid select,
  .admin-grid textarea {
    background: var(--bg-tertiary);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 10px;
    color: var(--text-primary);
  }

  .admin-span {
    grid-column: 1 / -1;
  }

  .admin-actions {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .booking-list .booking-list-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
  }

  .booking-card {
    background: rgba(15, 19, 26, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 14px;
    padding: 16px;
    display: grid;
    gap: 6px;
  }

  .booking-status {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 12px;
  }

  .status-pending {
    color: var(--color-primary-light);
  }

  .status-approved {
    color: var(--color-success);
  }

  .status-rejected {
    color: var(--color-error);
  }

  .booking-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .car-booked {
    position: absolute;
    top: 15px;
    left: 15px;
    background: rgba(239, 71, 111, 0.9);
    color: white;
    padding: 6px 10px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 12px;
    z-index: 3;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    display: grid;
    place-items: center;
    z-index: 200;
    padding: 20px;
  }

  .modal-card {
    background: #0f141c;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 20px;
    width: min(520px, 95vw);
    color: var(--text-dark);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  }

  .modal-grid {
    display: grid;
    gap: 12px;
    margin: 14px 0;
  }

  .modal-grid label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: var(--text-dark-secondary);
  }

  .modal-grid input {
    border-radius: 10px;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: #121723;
    color: var(--text-dark);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 12px;
  }

  .price-preview {
    font-weight: 600;
  }

  .chat-card {
    width: min(620px, 95vw);
  }

  .chat-messages {
    max-height: 260px;
    overflow: auto;
    display: grid;
    gap: 8px;
    margin: 12px 0;
  }

  .chat-bubble {
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    display: grid;
    gap: 4px;
  }

  .chat-bubble.admin {
    border: 1px solid rgba(240, 162, 21, 0.5);
  }

  .chat-bubble.user {
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .chat-bubble span {
    font-size: 11px;
    color: var(--text-dark-secondary);
  }

  .chat-compose {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
  }

  .chat-compose input {
    padding: 10px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: #121723;
    color: var(--text-dark);
  }

  .image-zoom {
    width: min(900px, 95vw);
    padding: 10px;
  }

  .image-zoom img {
    width: 100%;
    border-radius: 12px;
  }

  /* ============================================
     ADVANTAGES SECTION WITH HOVER
     ============================================ */

  .advantages {
    background: linear-gradient(135deg, rgba(240, 162, 21, 0.1) 0%, rgba(240, 162, 21, 0.05) 100%);
    transition: all 0.4s ease;
  }

  .advantages:hover {
    background: linear-gradient(135deg, rgba(240, 162, 21, 0.15) 0%, rgba(240, 162, 21, 0.08) 100%);
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
    background: radial-gradient(circle, rgba(240, 162, 21, 0.1) 0%, transparent 70%);
    transition: left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 0;
  }

  .advantage-card:hover::before {
    left: 100%;
  }

  .advantage-card:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 50px rgba(240, 162, 21, 0.2);
    border-color: var(--color-primary);
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
    filter: drop-shadow(0 10px 20px rgba(240, 162, 21, 0.3));
  }

  .advantage-card h4 {
    font-size: 18px;
    margin-bottom: 12px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  .advantage-card:hover h4 {
    color: var(--color-primary);
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
    background: rgba(240, 162, 21, 0.1);
    border: 2px solid rgba(240, 162, 21, 0.3);
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
    background: radial-gradient(circle, rgba(240, 162, 21, 0.15) 0%, transparent 60%);
    transition: all 0.4s ease;
    transform: translateX(-50%);
  }

  .requirement-card:hover {
    border-color: var(--color-primary);
    box-shadow: 0 15px 40px rgba(240, 162, 21, 0.2);
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
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
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
    box-shadow: 0 10px 30px rgba(240, 162, 21, 0.4);
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
    color: var(--color-primary);
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
    background: rgba(240, 162, 21, 0.1);
    border: 1px solid rgba(240, 162, 21, 0.2);
    padding: 40px;
    border-radius: 14px;
    max-width: 900px;
    margin: 40px auto;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .about-content:hover {
    border-color: var(--color-primary);
    box-shadow: 0 20px 60px rgba(240, 162, 21, 0.15);
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
    color: var(--color-primary);
    margin: 30px 0 20px 0;
    transition: all 0.3s ease;
  }

  .about-content:hover h3 {
    transform: translateX(10px);
    text-shadow: 0 0 20px rgba(240, 162, 21, 0.3);
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
    color: var(--color-primary);
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
    box-shadow: 0 15px 40px rgba(240, 162, 21, 0.15);
    border-color: var(--color-primary);
  }

  .info-card h4 {
    font-size: 18px;
    margin-bottom: 10px;
    transition: all 0.3s ease;
  }

  .info-card:hover h4 {
    color: var(--color-primary);
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
    background: rgba(240, 162, 21, 0.1);
    border: 1px solid rgba(240, 162, 21, 0.2);
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
    background: radial-gradient(circle, rgba(240, 162, 21, 0.1) 0%, transparent 60%);
    transition: all 0.4s ease;
  }

  .contact-card:hover::before {
    top: -20%;
    right: -20%;
  }

  .contact-card:hover {
    transform: translateY(-12px) scale(1.02);
    border-color: var(--color-primary);
    box-shadow: 0 20px 50px rgba(240, 162, 21, 0.2);
  }

  .contact-card h3 {
    font-size: 20px;
    color: var(--color-primary);
    margin-bottom: 15px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  .contact-card:hover h3 {
    transform: translateX(5px);
    text-shadow: 0 0 15px rgba(240, 162, 21, 0.3);
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
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: inline-block;
  }

  .contact-link:hover {
    color: var(--color-primary-light);
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
    box-shadow: inset 0 20px 60px rgba(240, 162, 21, 0.1);
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
    color: var(--color-primary);
    font-weight: 700;
    transition: all 0.3s ease;
  }

  .footer-column:hover h4 {
    transform: translateX(5px);
    text-shadow: 0 0 15px rgba(240, 162, 21, 0.3);
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
    color: var(--color-primary);
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


