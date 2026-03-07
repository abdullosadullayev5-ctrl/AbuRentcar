import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { createUserWithEmailAndPassword, getRedirectResult, onAuthStateChanged, signInWithEmailAndPassword, signInWithRedirect, signOut } from 'firebase/auth';
import { auth as firebaseAuth, providers } from './Firebase';

const abuRentLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%25' stop-color='%23ffd773'/><stop offset='55%25' stop-color='%23f0a215'/><stop offset='100%25' stop-color='%237a4e00'/></linearGradient><radialGradient id='bg' cx='50%25' cy='40%25' r='65%25'><stop offset='0%25' stop-color='%232a1c06'/><stop offset='100%25' stop-color='%230d0f14'/></radialGradient></defs><rect width='220' height='220' rx='28' fill='url(%23bg)'/><circle cx='110' cy='92' r='70' fill='none' stroke='url(%23g)' stroke-width='4' opacity='0.8'/><path d='M58 132 L96 52 L126 52 L164 132 L144 132 L133 108 L88 108 L78 132 Z M96 92 H124 L110 64 Z' fill='url(%23g)'/><text x='110' y='176' fill='url(%23g)' font-size='30' font-family='Segoe UI, Arial, sans-serif' text-anchor='middle' font-weight='700'>ABU RENT</text></svg>";


type Page = 'login' | 'home' | 'fleet' | 'detail' | 'bookings' | 'contacts' | 'about' | 'admin';
type Role = 'admin' | 'user' | '';
type Lang = 'uz' | 'ru' | 'en';
type Sender = 'admin' | 'user';
type CarCategory = 'Premium' | 'Sport' | 'SUV' | 'Oddiy';

type Car = {
  id: string;
  name: string;
  category: CarCategory;
  pricePerDay: number;
  fuelType: string;
  transmission: 'Automatic' | 'Manual';
  seats: number;
  modelYear: number;
  quantity: number;
  imageUrls: string[];
};

type Booking = {
  id: string;
  carId: string;
  carName: string;
  userName: string;
  loginId?: string;
  loginPassword?: string;
  phone: string;
  pickupDate: string;
  returnDate: string;
};

type Message = { id: string; bookingId: string; sender: Sender; text: string; time: string };
type LoginRecord = { id: string; user: string; password: string; action: 'login' | 'register' | 'admin' | 'social'; time: string };

const MAX_IMAGES = 10;
const AUTH_KEY = 'aburent_auth_v2';
const CARS_KEY = 'aburent_cars_v2';
const BOOKINGS_KEY = 'aburent_bookings_v2';
const MESSAGES_KEY = 'aburent_messages_v2';
const LOGIN_HISTORY_KEY = 'aburent_login_history_v1';
const LANG_KEY = 'aburent_lang_v2';
const THEME_KEY = 'aburent_theme_v2';
const CAR_CATEGORIES: CarCategory[] = ['Premium', 'Sport', 'SUV', 'Oddiy'];

const txt = {
  uz: {
    home: 'Bosh sahifa', fleet: 'Avtopark', bookings: 'Bandlar', contacts: 'Kontaktlar', about: 'Biz haqimizda',
    admin: 'Admin', logout: 'Chiqish', login: 'Kirish', welcome: 'Qaytganingizdan xursandmiz',
    userOrMail: 'Foydalanuvchi nomi yoki email', pass: 'Parol', google: 'Google orqali kirish', apple: 'Apple orqali kirish', microsoft: 'Microsoft orqali kirish',
    emailLogin: 'Email bilan kirish', emailRegister: 'Email bilan ro‘yxatdan o‘tish',
    browse: 'Mashinalarni ko‘rish', reserve: 'Band qilish', out: 'Mavjud emas', phone: 'Telefon', pickup: 'Olish sanasi',
    ret: 'Qaytarish sanasi', addCar: 'Yangi mashina qo‘shish', save: 'Saqlash', del: 'O‘chirish', lang: 'Til',
    search: 'Nomi yoki yoqilg‘i bo‘yicha qidirish', upload: 'Mashina rasmlari (10 tagacha)', imageLinks: 'Rasm URLlari (har qatorga bitta)',
    myBookings: 'Mening bandlarim', allBookings: 'Barcha bandlar', openChat: 'Chat ochish', closeChat: 'Chat yopish', send: 'Yuborish', deleteMsg: "SMS o'chirish",
    aboutText: 'Abu Rent qulay va tez avtomobil ijarasi xizmati.',
  },
  ru: {
    home: 'Главная', fleet: 'Автопарк', bookings: 'Брони', contacts: 'Контакты', about: 'О нас',
    admin: 'Админ', logout: 'Выйти', login: 'Войти', welcome: 'С возвращением',
    userOrMail: 'Имя пользователя или email', pass: 'Пароль', google: 'Войти через Google', apple: 'Войти через Apple', microsoft: 'Войти через Microsoft',
    emailLogin: 'Вход по email', emailRegister: 'Регистрация по email',
    browse: 'Смотреть авто', reserve: 'Забронировать', out: 'Нет в наличии', phone: 'Телефон', pickup: 'Дата получения',
    ret: 'Дата возврата', addCar: 'Добавить авто', save: 'Сохранить', del: 'Удалить', lang: 'Язык',
    search: 'Поиск по названию или топливу', upload: 'Изображения авто (до 10)', imageLinks: 'URL изображений (по одному в строке)',
    myBookings: 'Мои брони', allBookings: 'Все брони', openChat: 'Открыть чат', closeChat: 'Закрыть чат', send: 'Отправить', deleteMsg: 'Удалить SMS',
    aboutText: 'Abu Rent - удобный и быстрый сервис аренды автомобилей.',
  },
  en: {
    home: 'Home', fleet: 'Fleet', bookings: 'Bookings', contacts: 'Contacts', about: 'About',
    admin: 'Admin', logout: 'Logout', login: 'Sign In', welcome: 'Welcome Back',
    userOrMail: 'Username or email', pass: 'Password', google: 'Sign in with Google', apple: 'Sign in with Apple', microsoft: 'Sign in with Microsoft',
    emailLogin: 'Sign in with email', emailRegister: 'Register with email',
    browse: 'Browse Cars', reserve: 'Reserve now', out: 'Out of stock', phone: 'Phone', pickup: 'Pickup date',
    ret: 'Return date', addCar: 'Add New Car', save: 'Save', del: 'Delete', lang: 'Language',
    search: 'Search by name or fuel', upload: 'Car images (up to 10)', imageLinks: 'Image URLs (one per line)',
    myBookings: 'My Bookings', allBookings: 'All Bookings', openChat: 'Open chat', closeChat: 'Close chat', send: 'Send', deleteMsg: 'Delete message',
    aboutText: 'Abu Rent is a fast and comfortable car rental service.',
  },
} as const;

const initialCars: Car[] = [
  {
    id: '1', name: 'BMW X5 M Sport', category: 'Sport', pricePerDay: 145, fuelType: 'Petrol', transmission: 'Automatic', seats: 5, modelYear: 2023, quantity: 3,
    imageUrls: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=80',
    ],
  },
  {
    id: '2', name: 'Mercedes E220', category: 'Premium', pricePerDay: 125, fuelType: 'Diesel', transmission: 'Automatic', seats: 5, modelYear: 2022, quantity: 2,
    imageUrls: [
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=80',
    ],
  },
  {
    id: '3', name: 'Toyota Land Cruiser 300', category: 'SUV', pricePerDay: 180, fuelType: 'Petrol', transmission: 'Automatic', seats: 7, modelYear: 2024, quantity: 4,
    imageUrls: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&w=1400&q=80',
    ],
  },
  {
    id: '4', name: 'Porsche 911 Carrera', category: 'Sport', pricePerDay: 290, fuelType: 'Petrol', transmission: 'Automatic', seats: 2, modelYear: 2023, quantity: 2,
    imageUrls: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1400&q=80',
    ],
  },
  {
    id: '5', name: 'Lexus LX 600', category: 'Premium', pricePerDay: 220, fuelType: 'Petrol', transmission: 'Automatic', seats: 7, modelYear: 2024, quantity: 2,
    imageUrls: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1400&q=80',
    ],
  },
  {
    id: '6', name: 'Chevrolet Malibu', category: 'Oddiy', pricePerDay: 78, fuelType: 'Petrol', transmission: 'Automatic', seats: 5, modelYear: 2021, quantity: 6,
    imageUrls: [
      'https://images.unsplash.com/photo-1549927681-13f288c8f4b9?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1400&q=80',
    ],
  },
  {
    id: '7', name: 'Kia K5', category: 'Oddiy', pricePerDay: 82, fuelType: 'Petrol', transmission: 'Automatic', seats: 5, modelYear: 2022, quantity: 5,
    imageUrls: [
      'https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=80',
    ],
  },
  {
    id: '8', name: 'Range Rover Sport', category: 'SUV', pricePerDay: 245, fuelType: 'Petrol', transmission: 'Automatic', seats: 5, modelYear: 2024, quantity: 3,
    imageUrls: [
      'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=80',
    ],
  },
  {
    id: '9', name: 'Audi RS7', category: 'Sport', pricePerDay: 260, fuelType: 'Petrol', transmission: 'Automatic', seats: 5, modelYear: 2023, quantity: 2,
    imageUrls: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80',
    ],
  },
];

const serviceHighlights = [
  '24/7 buyurtma qabul qilish va tezkor javob',
  'Shahar ichida yetkazib berish va olib ketish xizmati',
  'Kunlik, haftalik, oylik ijara paketlari',
  'Oilaviy, biznes va premium avtomobillar tanlovi',
  'Texnik ko‘rikdan o‘tgan xavfsiz park',
  'Shartnoma va to‘lov bo‘yicha aniq va shaffof tizim',
  'Qo‘llab-quvvatlash: bronlashdan topshirishgacha',
  'Doimiy mijozlar uchun chegirma tizimi',
];

const serviceHighlightImages = [
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1549921296-3a6b6fcd16d3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80',
];
const serviceHighlightStickers = ['24/7', 'Delivery', 'Paket', 'Choice', 'Safe', 'Clear', 'Support', 'Bonus'];

const rentalRules = [
  'Haydovchilik guvohnomasi va shaxsni tasdiqlovchi hujjat talab qilinadi.',
  'Mashina toza va to‘liq yoqilg‘i holatida topshirilishi kerak.',
  'Yo‘l harakati qoidalari buzilishiga haydovchi javobgar bo‘ladi.',
  'Mashina ijarasi muddatidan oldin uzaytirilsa oldindan xabar beriladi.',
  'Uzoq safar va viloyatlararo yurish oldindan kelishiladi.',
  'Kechikish holatida tarif bo‘yicha qo‘shimcha hisob-kitob qilinadi.',
  'Favqulodda holatda call-markazga zudlik bilan murojaat qilinadi.',
  'YTH yoki texnik nosozlikda servis ko‘rsatmasiga amal qilinadi.',
];

const faqItems = [
  { q: 'Bron qilish uchun nima kerak?', a: 'Telefon raqam, haydovchilik guvohnomasi va ijara sanalari yetarli bo‘ladi.' },
  { q: 'Oldindan to‘lov bormi?', a: 'Band qilish uchun paketga qarab avans to‘lovi bo‘lishi mumkin.' },
  { q: 'Bir necha kunlik chegirma bormi?', a: 'Ha, 3+ kun, 7+ kun va 30+ kun paketlarda narx pasayadi.' },
  { q: 'Boshqa shaharda qaytarish mumkinmi?', a: 'Maxsus xizmat sifatida oldindan kelishuv bilan tashkil qilinadi.' },
  { q: 'Haydovchi bilan ijaraga berasizmi?', a: 'Talab bo‘lsa professional haydovchi xizmati alohida taklif qilinadi.' },
  { q: 'Sug‘urta bormi?', a: 'Mashinalar asosiy sug‘urta qamrovida, shartlar shartnomada ko‘rsatiladi.' },
];

const roadTips = [
  'Safardan oldin marshrut va yo‘l holatini tekshiring.',
  'Kechki va uzoq yo‘lda dam olish intervalini rejalang.',
  'Shinalar bosimi va yoqilg‘i darajasini nazorat qiling.',
  'Yomg‘ir va tuman vaqtida tezlikni pasaytiring.',
  'Telefon navigatsiya bilan birga oflayn xaritani ham saqlang.',
  'Bolalar bilan safarda xavfsizlik kamarlarini doim tekshiring.',
];
const categoryBadgeClass = (category: CarCategory) => `badge-${category.toLowerCase()}`;

const today = new Date().toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const rid = () => Math.random().toString(36).slice(2, 11);
const readLS = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const readFilesAsDataUrls = (files: File[]) =>
  Promise.all(
    files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        }),
    ),
  );

const getThirtyDayPrice = (pricePerDay: number) => pricePerDay * 30;

function DLRentApp() {
  const authState = readLS<{ role: Role; userName: string; page: Page; loginId?: string; loginPassword?: string }>(
    AUTH_KEY,
    { role: '', userName: '', page: 'login', loginId: '', loginPassword: '' },
  );

  const [page, setPage] = useState<Page>(authState.role ? authState.page : 'login');
  const [role, setRole] = useState<Role>(authState.role);
  const [lang, setLang] = useState<Lang>(readLS<Lang>(LANG_KEY, 'uz'));
  const [theme, setTheme] = useState<'dark' | 'light'>(readLS<'dark' | 'light'>(THEME_KEY, 'dark'));
  const [userName, setUserName] = useState(authState.userName);
  const [currentLoginId, setCurrentLoginId] = useState(authState.loginId || '');
  const [currentLoginPassword, setCurrentLoginPassword] = useState(authState.loginPassword || '');
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [reserveNotice, setReserveNotice] = useState('');
  const [cars, setCars] = useState<Car[]>(() =>
    readLS<Car[]>(CARS_KEY, initialCars).map((car) => ({ ...car, category: car.category || 'Oddiy' })),
  );
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CarCategory | 'Barchasi'>('Barchasi');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [phone, setPhone] = useState('');
  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState(tomorrow);
  const [bookings, setBookings] = useState<Booking[]>(readLS<Booking[]>(BOOKINGS_KEY, []));
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>(readLS<LoginRecord[]>(LOGIN_HISTORY_KEY, []));
  const [activeBookingId, setActiveBookingId] = useState('');
  const [messages, setMessages] = useState<Message[]>(readLS<Message[]>(MESSAGES_KEY, []));
  const [chatText, setChatText] = useState('');

  const [carName, setCarName] = useState('');
  const [carPrice, setCarPrice] = useState(100);
  const [carQty, setCarQty] = useState(1);
  const [carFuel, setCarFuel] = useState('Petrol');
  const [carTransmission, setCarTransmission] = useState<Car['transmission']>('Automatic');
  const [carCategory, setCarCategory] = useState<CarCategory>('Oddiy');
  const [carSeats, setCarSeats] = useState(5);
  const [carYear, setCarYear] = useState(new Date().getFullYear());
  const [carImageLinks, setCarImageLinks] = useState('');
  const [carImages, setCarImages] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ role, userName, page, loginId: currentLoginId, loginPassword: currentLoginPassword }));
  }, [role, userName, page, currentLoginId, currentLoginPassword]);

  useEffect(() => {
    localStorage.setItem(CARS_KEY, JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(loginHistory));
  }, [loginHistory]);

  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, JSON.stringify(lang));
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!role && page !== 'login') setPage('login');
  }, [role, page]);

  useEffect(() => {
    setReserveNotice('');
  }, [selectedCarId, pickupDate, returnDate]);

  useEffect(() => {
    // Complete OAuth redirect flow without popup window close warnings.
    void getRedirectResult(firebaseAuth)
      .then((cred) => {
        if (!cred) return;
        const name = cred.user.displayName || cred.user.email || 'user';
        setRole('user');
        setUserName(name);
        setCurrentLoginId(cred.user.email || name);
        setCurrentLoginPassword('social-login');
        setLoginHistory((p) => [{ id: rid(), user: cred.user.email || name, password: 'social-login', action: 'social' as const, time: new Date().toLocaleString() }, ...p].slice(0, 50));
        setPage('home');
      })
      .catch((error) => {
        console.error('Redirect login error:', error);
      });
  }, []);

  useEffect(() => {
    // Keep UI in sync with Firebase auth state across redirects and reloads.
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user) return;
      const name = user.displayName || user.email || 'user';
      setRole('user');
      setUserName(name);
      if (!currentLoginId) setCurrentLoginId(user.email || name);
      if (page === 'login') setPage('home');
    });
    return () => unsub();
  }, [currentLoginId, page]);

  const t = txt[lang];
  const selectedCar = useMemo(() => cars.find((c) => c.id === selectedCarId) || null, [cars, selectedCarId]);
  const rentalDays = useMemo(() => {
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
    const diff = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
    return Math.max(1, diff);
  }, [pickupDate, returnDate]);
  const rentalTotal = useMemo(() => (selectedCar ? selectedCar.pricePerDay * rentalDays : 0), [selectedCar, rentalDays]);
  const visibleCars = useMemo(
    () =>
      cars.filter((c) => {
        const q = `${c.name} ${c.fuelType} ${c.category}`.toLowerCase();
        const isSearchMatch = q.includes(search.toLowerCase());
        const isCategoryMatch = categoryFilter === 'Barchasi' || c.category === categoryFilter;
        return isSearchMatch && isCategoryMatch;
      }),
    [cars, search, categoryFilter],
  );
  const myBookings = useMemo(() => (role === 'admin' ? bookings : bookings.filter((b) => b.userName === userName)), [bookings, role, userName]);
  const activeMessages = useMemo(() => messages.filter((m) => m.bookingId === activeBookingId), [messages, activeBookingId]);

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = loginInput.trim();
    const pass = passwordInput.trim();
    if (!name || !pass) return;

    const nextRole: Role = name === 'Admin234' && pass === 'Admin123' ? 'admin' : 'user';
    if (nextRole === 'admin') {
      setRole(nextRole);
      setUserName(name);
      setCurrentLoginId(name);
      setCurrentLoginPassword(pass);
      setLoginHistory((p) => [{ id: rid(), user: name, password: pass, action: 'admin' as const, time: new Date().toLocaleString() }, ...p].slice(0, 50));
      setPage('admin');
      return;
    }

    if (!name.includes('@')) {
      alert('Email kiriting. Masalan: user@gmail.com');
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, name, pass);
      const displayName = credential.user.displayName || credential.user.email || name;
      setRole('user');
      setUserName(displayName);
      setCurrentLoginId(name);
      setCurrentLoginPassword(pass);
      setLoginHistory((p) => [{ id: rid(), user: name, password: pass, action: 'login' as const, time: new Date().toLocaleString() }, ...p].slice(0, 50));
      setPage('home');
    } catch (error) {
      console.error('Email/password auth error:', error);
      alert('Email/parol auth bajarilmadi. Firebase Console > Authentication > Sign-in method > Email/Password ni yoqing.');
    }
  };

  const registerAccount = async () => {
    const email = loginInput.trim();
    const pass = passwordInput.trim();
    if (!email || !pass) return;
    if (!email.includes('@')) {
      alert('Ro‘yxatdan o‘tish uchun email kiriting. Masalan: user@gmail.com');
      return;
    }
    try {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email, pass);
      const displayName = credential.user.displayName || credential.user.email || email;
      setRole('user');
      setUserName(displayName);
      setCurrentLoginId(email);
      setCurrentLoginPassword(pass);
      setLoginHistory((p) => [{ id: rid(), user: email, password: pass, action: 'register' as const, time: new Date().toLocaleString() }, ...p].slice(0, 50));
      setPage('home');
      alert("Yangi account yaratildi va tizimga kirdingiz.");
    } catch (error) {
      console.error('Register error:', error);
      alert("Ro'yxatdan o'tish bajarilmadi. Firebase Authentication Email/Password yoqilganini tekshiring.");
    }
  };

  const socialLogin = async (provider: 'google' | 'apple') => {
    try {
      await signInWithRedirect(firebaseAuth, providers[provider]);
    } catch (error) {
      const code = (error as { code?: string })?.code || 'unknown';
      console.error('Social redirect login error:', error);
      const host = typeof window !== 'undefined' ? window.location.hostname : 'current-domain';
      alert(`Google/Apple login bajarilmadi (${code}). Firebase > Authentication > Settings > Authorized domains ga ${host} ni qo'shing.`);
    }
  };

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error('Logout error:', error);
    }
    setRole('');
    setUserName('');
    setCurrentLoginId('');
    setCurrentLoginPassword('');
    setLoginInput('');
    setPasswordInput('');
    setPage('login');
  };

  const reserve = () => {
    if (!selectedCar || !phone.trim() || selectedCar.quantity <= 0) return;
    const booking: Booking = {
      id: rid(),
      carId: selectedCar.id,
      carName: selectedCar.name,
      userName,
      loginId: currentLoginId || userName,
      loginPassword: currentLoginPassword || '-',
      phone: phone.trim(),
      pickupDate,
      returnDate,
    };
    setBookings((p) => [...p, booking]);
    setCars((p) => p.map((c) => (c.id === selectedCar.id ? { ...c, quantity: c.quantity - 1 } : c)));
    setPhone('');
    setReserveNotice(`Band qilindi: ${selectedCar.name}. ${rentalDays} kun, jami EUR ${rentalTotal}.`);
    alert('Band qilindi!');
    setPage('bookings');
  };

  const addCar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!carName.trim()) return;
    const urlLines = carImageLinks.split(/\r?\n|,|;/).map((s) => s.trim()).filter(Boolean);
    const allImages = [...carImages, ...urlLines].slice(0, MAX_IMAGES);
    if (allImages.length === 0) allImages.push('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80');

    const car: Car = {
      id: rid(),
      name: carName.trim(),
      category: carCategory,
      pricePerDay: Math.max(1, carPrice),
      fuelType: carFuel,
      transmission: carTransmission,
      seats: Math.max(2, carSeats),
      modelYear: Math.max(1990, carYear),
      quantity: Math.max(1, carQty),
      imageUrls: allImages,
    };
    setCars((p) => [...p, car]);
    setCarName('');
    setCarPrice(100);
    setCarQty(1);
    setCarFuel('Petrol');
    setCarTransmission('Automatic');
    setCarCategory('Oddiy');
    setCarSeats(5);
    setCarYear(new Date().getFullYear());
    setCarImageLinks('');
    setCarImages([]);
  };

  const onUploadImages = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/')).slice(0, MAX_IMAGES);
    const dataUrls = (await readFilesAsDataUrls(files)).filter(Boolean).slice(0, MAX_IMAGES);
    setCarImages(dataUrls);
    e.target.value = '';
  };

  const sendMessage = () => {
    if (!activeBookingId || !chatText.trim()) return;
    setMessages((p) => [...p, {
      id: rid(), bookingId: activeBookingId, sender: role === 'admin' ? 'admin' : 'user', text: chatText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setChatText('');
  };

  const deleteMessage = (id: string) => {
    setMessages((p) => p.filter((m) => m.id !== id));
  };

  return (
    <div className="app">
      <style>{styles}</style>

      <header className="topbar">
        <div className="info-strip">
          <span>24/7 ishlaymiz</span>
          <span>Buxoro va Toshkent bo'ylab yetkazib berish</span>
          <span>Manzil: Buxoro, Farovon MFY (Lubot yaqinida)</span>
          <span>Telefon: +998 99 910 03 00</span>
        </div>
        <div className="top-main">
          <button className="brand" onClick={() => setPage(role === 'admin' ? 'admin' : 'home')}>
            <img src={abuRentLogo} alt="Abu Rent logo" />
            <span>Abu Rent</span>
          </button>

          <div className="controls">
            <label className="lang">
              <span>{t.lang}</span>
              <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
                <option value="uz">UZ</option><option value="ru">RU</option><option value="en">EN</option>
              </select>
            </label>

            {role !== '' && (
              <nav className="nav">
                {role !== 'admin' && <button className="nav-link" onClick={() => setPage('home')}>{t.home}</button>}
                <button className="nav-link" onClick={() => setPage('fleet')}>{t.fleet}</button>
                <button className="nav-link" onClick={() => setPage('bookings')}>{t.bookings}</button>
                <button className="nav-link" onClick={() => setPage('contacts')}>{t.contacts}</button>
                <button className="nav-link" onClick={() => setPage('about')}>{t.about}</button>
                {role === 'admin' && <button className="nav-link" onClick={() => setPage('admin')}>{t.admin}</button>}
                <button className="nav-link" onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}>
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
                <button className="nav-link" onClick={logout}>{t.logout}</button>
              </nav>
            )}
          </div>
        </div>
      </header>

      {page === 'login' && (
        <div className="video-section" aria-hidden="true">
          <div className="bg-video-wrap">
            <video className="bg-video" autoPlay muted loop playsInline>
              <source src="/SaveVid_Net_AQPMHbjYflrmPvVJGhiQzxHVAoqhtNRRaataSfpIUXrG2LXZp8RqQ.mp4" type="video/mp4" />
            </video>
            <div className="bg-overlay" />
          </div>
        </div>
      )}

      {page === 'login' && (
        <main className="center">
          <form className="panel login" onSubmit={login}>
            <h1>{t.welcome}</h1>
            <input name="login" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} placeholder={t.userOrMail} required />
            <input name="password" type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder={t.pass} required />
            <button type="submit">{t.login}</button>
            <button type="button" onClick={registerAccount}>{t.emailRegister}</button>
            <div className="social-row">
              <button type="button" className="social google" onClick={() => socialLogin('google')}>{t.google}</button>
              <button type="button" className="social apple" onClick={() => socialLogin('apple')}>{t.apple}</button>
            </div>
            <small>Admin: Admin234 / Admin123</small>
          </form>
        </main>
      )}

      {page === 'home' && (
        <main className="page">
          <section className="hero panel">
            <h1>{cars[0]?.name}</h1>
            <p>EUR {cars[0]?.pricePerDay}/day</p>
            <button onClick={() => setPage('fleet')}>{t.browse}</button>
          </section>

          <section className="panel info-block">
            <h2>Abu Rent afzalliklari</h2>
            <div className="info-grid">
              {serviceHighlights.map((item, idx) => (
                <article className="info-card" key={item}>
                  <div className="sticker">{serviceHighlightStickers[idx % serviceHighlightStickers.length]}</div>
                  <img className="info-media" src={serviceHighlightImages[idx % serviceHighlightImages.length]} alt={item} />
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel info-block">
            <h2>Ijara qoidalari va tartiblar</h2>
            <ul className="feature-list">
              {rentalRules.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className="panel info-block">
            <h2>Yo‘lga chiqishdan oldin tavsiyalar</h2>
            <ul className="feature-list">
              {roadTips.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </main>
      )}

      {page === 'fleet' && (
        <main className="page">
          <div className="row between">
            <h2>{t.fleet}</h2>
            <div className="fleet-filters">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} />
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as CarCategory | 'Barchasi')}>
                <option value="Barchasi">Barchasi</option>
                {CAR_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
          </div>
          <section className="grid">
            {visibleCars.map((car) => (
              <article className="card" key={car.id}>
                <span className={`cat-badge ${categoryBadgeClass(car.category)}`}>{car.category}</span>
                <img src={car.imageUrls[0]} alt={car.name} />
                <h3>{car.name}</h3>
                <p>EUR {car.pricePerDay}/day</p>
                <p>1 kun: EUR {car.pricePerDay} | 30 kun: EUR {getThirtyDayPrice(car.pricePerDay)}</p>
                <p>{car.fuelType} | {car.transmission} | {car.seats}</p>
                <p>{car.modelYear} | Qty: {car.quantity}</p>
                <button onClick={() => { setSelectedCarId(car.id); setSelectedImage(0); setPage('detail'); }}>View</button>
              </article>
            ))}
          </section>
        </main>
      )}

      {page === 'detail' && selectedCar && (
        <main className="page detail-wrap">
          <section className="detail">
            <div>
              <img src={selectedCar.imageUrls[selectedImage]} alt={selectedCar.name} />
              <div className="thumbs">
                {selectedCar.imageUrls.map((img, i) => (
                  <button key={`${selectedCar.id}-${i}`} className={`thumb ${selectedImage === i ? 'active' : ''}`} onClick={() => setSelectedImage(i)}>
                    <img src={img} alt={`${selectedCar.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="panel">
              <h2>{selectedCar.name}</h2>
              <p>EUR {selectedCar.pricePerDay}/day</p>
              <p>Tur: {selectedCar.category}</p>
              <p>1 kun: EUR {selectedCar.pricePerDay}</p>
              <p>30 kun: EUR {getThirtyDayPrice(selectedCar.pricePerDay)}</p>
              <label>{t.phone}<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
              <label>{t.pickup}<input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} /></label>
              <label>{t.ret}<input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} /></label>
              <p>Ijara muddati: {rentalDays} kun</p>
              <p>Jami narx: EUR {rentalTotal}</p>
              {reserveNotice && <p className="ok-note">{reserveNotice}</p>}
              <button onClick={reserve} disabled={selectedCar.quantity <= 0}>{selectedCar.quantity <= 0 ? t.out : t.reserve}</button>
            </div>
          </section>
        </main>
      )}

      {page === 'bookings' && (
        <main className="page">
          <h2>{role === 'admin' ? t.allBookings : t.myBookings}</h2>
          {reserveNotice && <p className="ok-note">{reserveNotice}</p>}
          <section className="grid">
            {myBookings.map((b) => (
              <article className="card" key={b.id}>
                <h3>{b.carName}</h3>
                <span className="booking-sticker">Band qilindi</span>
                <p>{b.userName}</p>
                <p>{b.phone}</p>
                <p>{b.pickupDate} - {b.returnDate}</p>
                <button onClick={() => setActiveBookingId(activeBookingId === b.id ? '' : b.id)}>
                  {activeBookingId === b.id ? t.closeChat : t.openChat}
                </button>
              </article>
            ))}
          </section>

          {activeBookingId && (
            <section className="panel chat">
              <div className="messages">
                {activeMessages.map((m) => (
                  <div key={m.id} className={`chat-msg ${m.sender === 'admin' ? 'from-admin' : 'from-user'}`}>
                    <div className="chat-msg-head">
                      <b>{m.sender}</b>
                      <small>{m.time}</small>
                    </div>
                    <p>{m.text}</p>
                    {role === 'admin' && (
                      <button type="button" className="danger chat-del" onClick={() => deleteMessage(m.id)}>
                        {t.deleteMsg}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="row chat-compose">
                <input value={chatText} onChange={(e) => setChatText(e.target.value)} placeholder="Message" />
                <button onClick={sendMessage}>{t.send}</button>
              </div>
            </section>
          )}
        </main>
      )}

      {page === 'contacts' && (
        <main className="page panel">
          <h2>{t.contacts}</h2>
          <p>Telefon: +998 99 910 03 00, +998 95 420 03 00</p>
          <p>Qo‘shimcha aloqa: +998 97 309 42 99</p>
          <p>Email: info@dlrent.uz</p>
          <p>24/7 xizmat ko'rsatamiz, kechasi ham buyurtma qabul qilinadi.</p>
          <p>Buxoro: Farovon MFY (Lubot yaqinida)</p>
          <p>Toshkent: Mirabad tumani, Sayhun ko'chasi 170A</p>
          <p>Samarqand: Registon yaqinida yetkazib berish nuqtasi</p>
          <p>Farg‘ona vodiysi: oldindan bron orqali yuborish xizmati</p>
          <p>Korxona mijozlari uchun maxsus shartnoma asosida flot xizmatlari mavjud.</p>
          <p>Telegram, Instagram va telefon orqali bir xil narx siyosati qo‘llanadi.</p>
        </main>
      )}
      {page === 'about' && (
        <main className="page panel">
          <h2>{t.about}</h2>
          <p>{t.aboutText}</p>
          <p>Bizning xizmat rent car ehtiyojlariga mos: kunlik, haftalik va uzoq muddatli ijara.</p>
          <p>Shartnomalar shaffof, narxlar oldindan aniq ko'rsatiladi.</p>
          <p>Har bir avtomobil ichki va tashqi tozalashdan o‘tkazilib mijozga topshiriladi.</p>
          <p>Mijoz tajribasini yaxshilash uchun bronlash, tasdiqlash va topshirish jarayonlari standartlashtirilgan.</p>
          <p>Talab yuqori mavsumda ham navbatni kamaytirish uchun oldindan bron tizimi ishlatiladi.</p>
          <p>Uzoq muddatli ijaralarda servis va texnik xizmat rejalari alohida boshqariladi.</p>
          <p>Biznes segmenti uchun shofyor bilan xizmat, aeroport transfer va korporativ tariflar mavjud.</p>
          <p>Xavfsizlik uchun mashinalarda davriy texnik diagnostika va yo‘lga chiqishdan oldingi tekshiruvlar qilinadi.</p>
          <h3>Ko‘p so‘raladigan savollar</h3>
          <div className="info-grid">
            {faqItems.map((item) => (
              <article className="info-card" key={item.q}>
                <h4>{item.q}</h4>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </main>
      )}

      {page === 'admin' && role === 'admin' && (
        <main className="page">
          <form className="panel admin" onSubmit={addCar}>
            <h3>{t.addCar}</h3>
            <div className="grid form-grid">
              <input value={carName} onChange={(e) => setCarName(e.target.value)} placeholder="Car name" required />
              <input type="number" value={carPrice} onChange={(e) => setCarPrice(Number(e.target.value) || 0)} placeholder="Price/day" required />
              <input type="number" value={carQty} onChange={(e) => setCarQty(Number(e.target.value) || 1)} placeholder="Quantity" required />
              <input value={carFuel} onChange={(e) => setCarFuel(e.target.value)} placeholder="Fuel" required />
              <select value={carTransmission} onChange={(e) => setCarTransmission(e.target.value as Car['transmission'])}><option>Automatic</option><option>Manual</option></select>
              <select value={carCategory} onChange={(e) => setCarCategory(e.target.value as CarCategory)}>
                {CAR_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <input type="number" value={carSeats} onChange={(e) => setCarSeats(Number(e.target.value) || 5)} placeholder="Seats" required />
              <input type="number" value={carYear} onChange={(e) => setCarYear(Number(e.target.value) || 2024)} placeholder="Year" required />
              <textarea value={carImageLinks} onChange={(e) => setCarImageLinks(e.target.value)} placeholder={t.imageLinks} rows={3} />
              <label className="upload">{t.upload}<input type="file" accept="image/*" multiple onChange={onUploadImages} /></label>
            </div>
            {carImages.length > 0 && <div className="preview-grid">{carImages.map((src, i) => <img key={i} src={src} className="preview" alt={`preview ${i+1}`} />)}</div>}
            <button type="submit">{t.save}</button>
          </form>

          <section className="grid">
            {cars.map((car) => (
              <article className="card" key={car.id}>
                <span className={`cat-badge ${categoryBadgeClass(car.category)}`}>{car.category}</span>
                <img src={car.imageUrls[0]} alt={car.name} />
                <h3>{car.name}</h3>
                <p>Qty: {car.quantity}</p>
                <button className="danger" onClick={() => setCars((p) => p.filter((x) => x.id !== car.id))}>{t.del}</button>
              </article>
            ))}
          </section>
          <section className="panel info-block">
            <h3>Kirish tarixi (login / parol)</h3>
            {loginHistory.length === 0 && <p>Hozircha kirish ma'lumoti yo'q.</p>}
            <div className="info-grid">
              {loginHistory.map((item) => (
                <article className="info-card" key={item.id}>
                  <p><b>Vaqt:</b> {item.time}</p>
                  <p><b>User:</b> {item.user}</p>
                  <p><b>Parol:</b> {item.password}</p>
                  <p><b>Turi:</b> {item.action}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="panel info-block">
            <h3>Kim qaysi mashinani oldi</h3>
            {bookings.length === 0 && <p>Hozircha band qilingan mashina yo'q.</p>}
            <div className="info-grid">
              {bookings.map((b) => (
                <article className="info-card" key={b.id}>
                  <p><b>User:</b> {b.userName}</p>
                  <p><b>Login:</b> {b.loginId || '-'}</p>
                  <p><b>Parol:</b> {b.loginPassword || '-'}</p>
                  <p><b>Mashina:</b> {b.carName}</p>
                  <p><b>Sana:</b> {b.pickupDate} - {b.returnDate}</p>
                </article>
              ))}
            </div>
          </section>
        </main>
      )}

      {page !== 'login' && (
        <footer className="footer">
          <div className="footer-brand">
            <p>Abu Rent</p>
            <a className="footer-call" href="tel:+998973094299">
              +998 97 309 42 99
            </a>
          </div>
          <div className="footer-map">
            <iframe
              title="Abu Rent manzil"
              src="https://maps.google.com/maps?q=Buxoro%20Farovon%20MFY%20Lubot&t=&z=14&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="footer-social-links">
            <a className="footer-social-btn" href="https://www.instagram.com/23_0w0/" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a className="footer-social-btn" href="https://www.youtube.com/@Anime_uz-m5e" target="_blank" rel="noreferrer">
              YouTube
            </a>
            <a className="footer-social-btn" href="https://t.me/frontendflowers" target="_blank" rel="noreferrer">
              Telegram
            </a>
          </div>
        </footer>
      )}
    </div>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
  :root {
    --bg:#0b0f14; --surface:#161b23; --line:#2c3442; --text:#f5f7fb; --muted:#9aa3b2;
    --accent:#f0a215; --input:#1f2632; --inputLine:#394255; --top:#0d121ae6;
    --page-grad-a:#1a2436; --page-grad-b:#0b0f14;
  }
  [data-theme="light"] {
    --bg:#eef4ff; --surface:#ffffff; --line:#cfd8e6; --text:#132033; --muted:#55657d;
    --accent:#d88c12; --input:#ffffff; --inputLine:#c8d4e2; --top:#ffffffd9;
    --page-grad-a:#d7e7ff; --page-grad-b:#f8fbff;
  }
  *{box-sizing:border-box}
  body{margin:0;background:radial-gradient(circle at top,var(--page-grad-a) 0,var(--page-grad-b) 65%);color:var(--text);font-family:Outfit,Segoe UI,Tahoma,sans-serif;transition:background .35s ease,color .25s ease}
  .app{padding:0 16px 24px;position:relative;isolation:isolate}
  .video-section{max-width:1300px;margin:14px auto 0;padding:0 4px}
  .bg-video-wrap{position:relative;width:100%;height:40vh;min-height:260px;max-height:430px;overflow:hidden;border-radius:18px;border:1px solid #ffffff22}
  .bg-video{width:100%;height:100%;object-fit:cover;filter:saturate(1.08) contrast(1.06) brightness(.72)}
  .bg-overlay{position:absolute;inset:0;background:
    radial-gradient(circle at 20% 12%, #f0a2153b 0%, transparent 42%),
    radial-gradient(circle at 83% 78%, #00c2ff26 0%, transparent 36%),
    linear-gradient(180deg,#0b1019b5,#090d14e3)}
  .topbar{position:sticky;top:0;background:color-mix(in oklab,var(--bg) 84%,#000);backdrop-filter:blur(12px);border-bottom:1px solid #2b3340;z-index:10}
  .info-strip{width:100%;margin:0;padding:8px 16px;display:flex;gap:14px;flex-wrap:wrap;color:var(--muted);font-size:12px}
  .top-main{width:100%;margin:0;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:12px 16px}
  .brand{display:flex;align-items:center;gap:10px;background:transparent;color:var(--accent);border:0;font-size:1.1rem;font-weight:800}
  .brand img{width:44px;height:44px;border-radius:10px}
  .controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
  .lang{display:flex;gap:8px;align-items:center;color:var(--muted)}
  .nav{display:flex;gap:8px;flex-wrap:wrap}
  .nav-link{background:transparent;border:1px solid transparent;color:var(--text);padding:9px 12px;border-radius:12px;transition:.25s}
  .nav-link:hover{border-color:#f0a21566;color:var(--accent);transform:translateY(-2px);background:#f0a21512}
  button{border:0;border-radius:999px;padding:10px 16px;background:linear-gradient(135deg,#f0a215,#f8c24a);font-weight:700;color:#1a1305;cursor:pointer;transition:.25s;position:relative;overflow:hidden}
  button::before{content:'';position:absolute;left:-120%;top:0;width:120%;height:100%;background:linear-gradient(120deg,transparent,#ffffff66,transparent);transition:transform .45s}
  button:hover::before{transform:translateX(190%)}
  button:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 14px 28px #00000045}
  .danger{background:linear-gradient(135deg,#c4274e,#f05252);color:#fff}
  input,textarea,select{width:100%;background:var(--input);color:var(--text);border:1px solid var(--inputLine);border-radius:12px;padding:11px 12px}
  .panel{background:color-mix(in oklab,var(--surface) 88%,transparent);border:1px solid color-mix(in oklab,var(--line) 60%,#ffffff);border-radius:18px;padding:18px;backdrop-filter:blur(8px)}
  .center{min-height:80vh;display:grid;place-items:center}
  .login{
    width:min(520px,95vw);
    display:grid;
    gap:10px;
    background:
      linear-gradient(165deg,#ffffff45,#ffffff15),
      radial-gradient(circle at 15% 10%,#ffffff3a,transparent 46%),
      radial-gradient(circle at 88% 92%,#7ec8ff2f,transparent 42%);
    border:1px solid #ffffff80;
    box-shadow:0 28px 60px #00000066,inset 0 1px 0 #ffffff95;
    backdrop-filter:blur(28px) saturate(1.45);
    -webkit-backdrop-filter:blur(28px) saturate(1.45);
  }
  .ok-note{padding:10px 12px;border-radius:12px;background:#16a34a22;border:1px solid #22c55e55;color:#d1fae5}
  .social-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .social{border-radius:12px}
  .google{background:#fff;color:#1f2937}
  .apple{background:#1f2430;color:#fff}
  .hero,.page{max-width:1300px;margin:22px auto}
  .info-block{margin-top:14px}
  .info-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
  .info-card{position:relative;border:1px solid color-mix(in oklab,var(--line) 70%,#000);background:color-mix(in oklab,var(--surface) 92%,#000);border-radius:14px;padding:12px;overflow:hidden;transition:transform .24s,border-color .24s,box-shadow .24s}
  .info-card:hover{transform:translateY(-4px);border-color:#f0a21577;box-shadow:0 12px 20px #0000003f}
  .info-media{width:100%;height:104px;object-fit:cover;border-radius:10px;border:1px solid #ffffff1d;margin-bottom:10px}
  .sticker{position:absolute;top:10px;right:10px;background:#0f172acc;color:#f8fafc;border:1px solid #ffffff40;padding:3px 8px;border-radius:999px;font-size:11px;font-weight:700;backdrop-filter:blur(4px)}
  .info-card h4{margin:0 0 8px}
  .info-card p{margin:0;line-height:1.45}
  .feature-list{margin:0;padding-left:20px;display:grid;gap:8px;line-height:1.5}
  .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  .between{justify-content:space-between}
  .fleet-filters{display:flex;gap:10px;flex-wrap:wrap;width:min(760px,100%)}
  .fleet-filters input{flex:1 1 280px}
  .fleet-filters select{flex:0 0 180px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-top:14px}
  .card{position:relative;background:color-mix(in oklab,var(--surface) 88%,transparent);border:1px solid #ffffff1f;border-radius:16px;padding:14px;display:grid;gap:8px;transition:.28s}
  .card:hover{transform:translateY(-6px) scale(1.01);border-color:#f0a21588;box-shadow:0 18px 30px #00000048}
  .card img,.preview{width:100%;height:230px;object-fit:cover;border-radius:12px;border:1px solid #323a49}
  .cat-badge{position:absolute;top:20px;left:20px;z-index:2;padding:5px 10px;border-radius:999px;font-size:12px;font-weight:800;border:1px solid #ffffff70;background:#0f172acc;color:#fff;backdrop-filter:blur(5px)}
  .badge-premium{background:#3f2b00d9}
  .badge-sport{background:#7f1d1dd9}
  .badge-suv{background:#0c4a6ed9}
  .badge-oddiy{background:#334155d9}
  .booking-sticker{display:inline-block;width:max-content;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:700;background:#16a34a25;border:1px solid #22c55e73;color:#dcfce7}
  .detail-wrap{max-width:1300px}
  .detail{display:grid;grid-template-columns:1.2fr 1fr;gap:16px}
  .detail > div:first-child{display:grid;gap:10px}
  .detail > div:first-child > img{width:100%;height:min(62vh,620px);object-fit:cover;border-radius:14px;border:1px solid #323a49}
  .thumbs{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
  .thumb{padding:0;border-radius:10px;background:transparent;border:1px solid transparent}
  .thumb img{width:80px;height:56px;object-fit:cover;border-radius:10px;border:0}
  .thumb.active{border-color:var(--accent)}
  .chat .messages{max-height:280px;overflow:auto;display:grid;gap:10px}
  .chat-msg{border:1px solid color-mix(in oklab,var(--line) 80%,#000);border-radius:12px;padding:10px;background:color-mix(in oklab,var(--surface) 90%,#000)}
  .chat-msg-head{display:flex;justify-content:space-between;align-items:center;gap:10px;color:var(--muted)}
  .chat-msg p{margin:8px 0 0;line-height:1.4}
  .chat-msg.from-admin{border-color:#c8881c66}
  .chat-del{margin-top:10px;padding:7px 12px;font-size:12px}
  .chat-compose{margin-top:12px}
  .form-grid{grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
  .upload{display:grid;gap:8px;color:var(--muted);border:1px dashed color-mix(in oklab,var(--line) 85%,#000);padding:10px;border-radius:12px}
  .preview-grid{margin:12px 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
  .preview{height:120px}
  .footer{max-width:1300px;margin:14px auto 0;border:1px solid #ffffff22;background:color-mix(in oklab,var(--surface) 88%,transparent);border-radius:14px;padding:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;backdrop-filter:blur(8px)}
  .footer-brand{display:grid;gap:6px}
  .footer-call{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border-radius:999px;padding:9px 14px;font-weight:700;color:#15100a;background:linear-gradient(135deg,#ffd670,#f0a215);transition:.2s}
  .footer-call:hover{transform:translateY(-2px);box-shadow:0 12px 22px #00000038}
  .footer-map{flex:1 1 280px;min-width:260px;max-width:460px;border-radius:12px;overflow:hidden;border:1px solid #ffffff2e}
  .footer-map iframe{display:block;width:100%;height:120px;border:0}
  .footer-social-links{display:flex;gap:8px;flex-wrap:wrap}
  .footer-social-btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border-radius:999px;padding:9px 13px;font-weight:700;color:#15100a;background:linear-gradient(135deg,#f0a215,#ffd670);transition:.2s}
  .footer-social-btn:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 12px 22px #00000038}
  @media (max-width:900px){
    .app{padding:0 10px 20px}
    .info-strip{font-size:11px;gap:8px;padding:8px 10px}
    .video-section{margin-top:10px;padding:0}
    .bg-video-wrap{height:30vh;min-height:190px;border-radius:12px}
    .top-main{flex-direction:column;align-items:stretch;padding:10px 0}
    .brand{justify-content:center}
    .controls{flex-direction:column;align-items:stretch}
    .lang{justify-content:space-between}
    .nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
    .nav-link{width:100%}
    .panel{padding:14px}
    .login{width:100%}
    .social-row{grid-template-columns:1fr}
    .hero,.page{margin:14px auto}
    .info-grid{grid-template-columns:1fr}
    .between{flex-direction:column;align-items:stretch}
    .grid{grid-template-columns:1fr;gap:12px}
    .detail{grid-template-columns:1fr}
    .card img{height:210px}
    .detail > div:first-child > img{height:min(52vh,420px)}
    .row{flex-direction:column;align-items:stretch}
    .chat-compose button{width:100%}
    .footer{padding:12px}
    .footer-map{max-width:100%}
    .footer-map iframe{height:140px}
    .footer-social-links{width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
    .footer-social-btn{padding:8px 6px;font-size:12px}
  }
`;

export default DLRentApp;











