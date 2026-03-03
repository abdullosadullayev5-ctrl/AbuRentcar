import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { getRedirectResult, signInWithEmailAndPassword, signInWithRedirect } from 'firebase/auth';
import { auth as firebaseAuth, providers } from './Firebase';

const abuRentLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%25' stop-color='%23ffd773'/><stop offset='55%25' stop-color='%23f0a215'/><stop offset='100%25' stop-color='%237a4e00'/></linearGradient><radialGradient id='bg' cx='50%25' cy='40%25' r='65%25'><stop offset='0%25' stop-color='%232a1c06'/><stop offset='100%25' stop-color='%230d0f14'/></radialGradient></defs><rect width='220' height='220' rx='28' fill='url(%23bg)'/><circle cx='110' cy='92' r='70' fill='none' stroke='url(%23g)' stroke-width='4' opacity='0.8'/><path d='M58 132 L96 52 L126 52 L164 132 L144 132 L133 108 L88 108 L78 132 Z M96 92 H124 L110 64 Z' fill='url(%23g)'/><text x='110' y='176' fill='url(%23g)' font-size='30' font-family='Segoe UI, Arial, sans-serif' text-anchor='middle' font-weight='700'>ABU RENT</text></svg>";


type Page = 'login' | 'home' | 'fleet' | 'detail' | 'bookings' | 'contacts' | 'about' | 'admin';
type Role = 'admin' | 'user' | '';
type Lang = 'uz' | 'ru' | 'en';
type Sender = 'admin' | 'user';

type Car = {
  id: string;
  name: string;
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
  phone: string;
  pickupDate: string;
  returnDate: string;
};

type Message = { id: string; bookingId: string; sender: Sender; text: string; time: string };

const MAX_IMAGES = 10;
const AUTH_KEY = 'aburent_auth_v2';
const CARS_KEY = 'aburent_cars_v2';
const BOOKINGS_KEY = 'aburent_bookings_v2';
const MESSAGES_KEY = 'aburent_messages_v2';
const LANG_KEY = 'aburent_lang_v2';
const THEME_KEY = 'aburent_theme_v2';

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
    id: '1', name: 'BMW X5 M Sport', pricePerDay: 145, fuelType: 'Petrol', transmission: 'Automatic', seats: 5, modelYear: 2023, quantity: 3,
    imageUrls: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=80',
    ],
  },
  {
    id: '2', name: 'Mercedes E220', pricePerDay: 125, fuelType: 'Diesel', transmission: 'Automatic', seats: 5, modelYear: 2022, quantity: 2,
    imageUrls: [
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=80',
    ],
  },
];

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

function DLRentApp() {
  const authState = readLS<{ role: Role; userName: string; page: Page }>(AUTH_KEY, { role: '', userName: '', page: 'login' });

  const [page, setPage] = useState<Page>(authState.role ? authState.page : 'login');
  const [role, setRole] = useState<Role>(authState.role);
  const [lang, setLang] = useState<Lang>(readLS<Lang>(LANG_KEY, 'uz'));
  const [theme, setTheme] = useState<'dark' | 'light'>(readLS<'dark' | 'light'>(THEME_KEY, 'dark'));
  const [userName, setUserName] = useState(authState.userName);
  const [cars, setCars] = useState<Car[]>(readLS<Car[]>(CARS_KEY, initialCars));
  const [search, setSearch] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [phone, setPhone] = useState('');
  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState(tomorrow);
  const [bookings, setBookings] = useState<Booking[]>(readLS<Booking[]>(BOOKINGS_KEY, []));
  const [activeBookingId, setActiveBookingId] = useState('');
  const [messages, setMessages] = useState<Message[]>(readLS<Message[]>(MESSAGES_KEY, []));
  const [chatText, setChatText] = useState('');

  const [carName, setCarName] = useState('');
  const [carPrice, setCarPrice] = useState(100);
  const [carQty, setCarQty] = useState(1);
  const [carFuel, setCarFuel] = useState('Petrol');
  const [carTransmission, setCarTransmission] = useState<Car['transmission']>('Automatic');
  const [carSeats, setCarSeats] = useState(5);
  const [carYear, setCarYear] = useState(new Date().getFullYear());
  const [carImageLinks, setCarImageLinks] = useState('');
  const [carImages, setCarImages] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ role, userName, page }));
  }, [role, userName, page]);

  useEffect(() => {
    localStorage.setItem(CARS_KEY, JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

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
    // Complete OAuth redirect flow without popup window close warnings.
    void getRedirectResult(firebaseAuth)
      .then((cred) => {
        if (!cred) return;
        const name = cred.user.displayName || cred.user.email || 'user';
        setRole('user');
        setUserName(name);
        setPage('home');
      })
      .catch((error) => {
        console.error('Redirect login error:', error);
      });
  }, []);

  const t = txt[lang];
  const selectedCar = useMemo(() => cars.find((c) => c.id === selectedCarId) || null, [cars, selectedCarId]);
  const visibleCars = useMemo(() => cars.filter((c) => `${c.name} ${c.fuelType}`.toLowerCase().includes(search.toLowerCase())), [cars, search]);
  const myBookings = useMemo(() => (role === 'admin' ? bookings : bookings.filter((b) => b.userName === userName)), [bookings, role, userName]);
  const activeMessages = useMemo(() => messages.filter((m) => m.bookingId === activeBookingId), [messages, activeBookingId]);

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('login') || '').trim();
    const pass = String(f.get('password') || '').trim();
    if (!name || !pass) return;

    const nextRole: Role = name === 'Admin234' && pass === 'Admin123' ? 'admin' : 'user';
    if (nextRole === 'admin') {
      setRole(nextRole);
      setUserName(name);
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
      setPage('home');
    } catch (error) {
      console.error('Email/password auth error:', error);
      alert('Email/parol auth bajarilmadi. Firebase Console > Authentication > Sign-in method > Email/Password ni yoqing.');
    }
  };

  const socialLogin = async (provider: 'google' | 'apple') => {
    try {
      const providerInstance = providers[provider];
      await signInWithRedirect(firebaseAuth, providerInstance);
    } catch (error) {
      console.error('Social login error:', error);
      alert('Login bajarilmadi. Firebase Console > Authentication > Sign-in method da providerlarni yoqing.');
    }
  };

  const logout = () => {
    setRole('');
    setUserName('');
    setPage('login');
  };

  const reserve = () => {
    if (!selectedCar || !phone.trim() || selectedCar.quantity <= 0) return;
    const booking: Booking = {
      id: rid(), carId: selectedCar.id, carName: selectedCar.name, userName, phone: phone.trim(), pickupDate, returnDate,
    };
    setBookings((p) => [...p, booking]);
    setCars((p) => p.map((c) => (c.id === selectedCar.id ? { ...c, quantity: c.quantity - 1 } : c)));
    setPhone('');
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
        <main className="center">
          <form className="panel login" onSubmit={login}>
            <h1>{t.welcome}</h1>
            <input name="login" placeholder={t.userOrMail} required />
            <input name="password" type="password" placeholder={t.pass} required />
            <button type="submit">{t.login}</button>
            <div className="social-row">
              <button type="button" className="social google" onClick={() => socialLogin('google')}>{t.google}</button>
              <button type="button" className="social apple" onClick={() => socialLogin('apple')}>{t.apple}</button>
            </div>
            <small>Admin: Admin234 / Admin123</small>
          </form>
        </main>
      )}

      {page === 'home' && (
        <main className="hero panel">
          <h1>{cars[0]?.name}</h1>
          <p>EUR {cars[0]?.pricePerDay}/day</p>
          <button onClick={() => setPage('fleet')}>{t.browse}</button>
        </main>
      )}

      {page === 'fleet' && (
        <main className="page">
          <div className="row between">
            <h2>{t.fleet}</h2>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} />
          </div>
          <section className="grid">
            {visibleCars.map((car) => (
              <article className="card" key={car.id}>
                <img src={car.imageUrls[0]} alt={car.name} />
                <h3>{car.name}</h3>
                <p>EUR {car.pricePerDay}/day</p>
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
              <label>{t.phone}<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
              <label>{t.pickup}<input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} /></label>
              <label>{t.ret}<input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} /></label>
              <button onClick={reserve} disabled={selectedCar.quantity <= 0}>{selectedCar.quantity <= 0 ? t.out : t.reserve}</button>
            </div>
          </section>
        </main>
      )}

      {page === 'bookings' && (
        <main className="page">
          <h2>{role === 'admin' ? t.allBookings : t.myBookings}</h2>
          <section className="grid">
            {myBookings.map((b) => (
              <article className="card" key={b.id}>
                <h3>{b.carName}</h3>
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
          <p>Email: info@dlrent.uz</p>
          <p>24/7 xizmat ko'rsatamiz, kechasi ham buyurtma qabul qilinadi.</p>
          <p>Buxoro: Farovon MFY (Lubot yaqinida)</p>
          <p>Toshkent: Mirabad tumani, Sayhun ko'chasi 170A</p>
        </main>
      )}
      {page === 'about' && (
        <main className="page panel">
          <h2>{t.about}</h2>
          <p>{t.aboutText}</p>
          <p>Bizning xizmat rent car ehtiyojlariga mos: kunlik, haftalik va uzoq muddatli ijara.</p>
          <p>Shartnomalar shaffof, narxlar oldindan aniq ko'rsatiladi.</p>
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
                <img src={car.imageUrls[0]} alt={car.name} />
                <h3>{car.name}</h3>
                <p>Qty: {car.quantity}</p>
                <button className="danger" onClick={() => setCars((p) => p.filter((x) => x.id !== car.id))}>{t.del}</button>
              </article>
            ))}
          </section>
        </main>
      )}

      {page !== 'login' && (
        <footer className="footer">
          <p>Abu Rent</p>
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
  :root { --bg:#101216; --surface:#1b1f24; --line:#313743; --text:#f5f7fb; --muted:#9aa3b2; --accent:#f0a215; --input:#222835; --inputLine:#394255; --top:#101216e6; }
  [data-theme="light"] { --bg:#f3f6fb; --surface:#ffffff; --line:#d5deea; --text:#132033; --muted:#5f6f86; --accent:#d88c12; --input:#ffffff; --inputLine:#c8d4e2; --top:#ffffffea; }
  *{box-sizing:border-box}
  body{margin:0;background:radial-gradient(circle at top,color-mix(in oklab,var(--accent) 16%,var(--bg)) 0,var(--bg) 60%);color:var(--text);font-family:Segoe UI,Tahoma,sans-serif;transition:background .25s ease,color .2s ease}
  .app{padding:0 16px 24px}
  .topbar{position:sticky;top:0;background:var(--top);backdrop-filter:blur(8px);border-bottom:1px solid #2b3340;z-index:10}
  .info-strip{max-width:1300px;margin:0 auto;padding:8px 0;display:flex;gap:14px;flex-wrap:wrap;color:var(--muted);font-size:12px}
  .top-main{max-width:1300px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:12px 0}
  .brand{display:flex;align-items:center;gap:10px;background:transparent;color:var(--accent);border:0;font-size:1.1rem;font-weight:800}
  .brand img{width:44px;height:44px;border-radius:10px}
  .controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
  .lang{display:flex;gap:8px;align-items:center;color:var(--muted)}
  .nav{display:flex;gap:8px;flex-wrap:wrap}
  .nav-link{background:transparent;border:1px solid transparent;color:var(--text);padding:9px 12px;border-radius:12px;transition:.2s}
  .nav-link:hover{border-color:#f0a21566;color:var(--accent);transform:translateY(-1px)}
  button{border:0;border-radius:999px;padding:10px 16px;background:linear-gradient(135deg,#f0a215,#f8c24a);font-weight:700;color:#1a1305;cursor:pointer;transition:.2s}
  button:hover{transform:translateY(-2px) scale(1.01);box-shadow:0 14px 28px #00000045}
  .danger{background:linear-gradient(135deg,#c4274e,#f05252);color:#fff}
  input,textarea,select{width:100%;background:var(--input);color:var(--text);border:1px solid var(--inputLine);border-radius:12px;padding:11px 12px}
  .panel{background:var(--surface);border:1px solid #2e3544;border-radius:16px;padding:18px}
  .center{min-height:80vh;display:grid;place-items:center}
  .login{width:min(520px,95vw);display:grid;gap:10px}
  .social-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .social{border-radius:12px}
  .google{background:#fff;color:#1f2937}
  .apple{background:#1f2430;color:#fff}
  .hero,.page{max-width:1300px;margin:22px auto}
  .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  .between{justify-content:space-between}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-top:14px}
  .card{background:var(--surface);border:1px solid #2e3544;border-radius:16px;padding:14px;display:grid;gap:8px;transition:.2s}
  .card:hover{transform:translateY(-4px);border-color:#f0a21588;box-shadow:0 14px 26px #0000003b}
  .card img,.detail img,.preview{width:100%;height:190px;object-fit:cover;border-radius:12px;border:1px solid #323a49}
  .detail-wrap{max-width:1300px}
  .detail{display:grid;grid-template-columns:1.2fr 1fr;gap:16px}
  .thumbs{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
  .thumb{padding:0;border-radius:10px;background:transparent;border:1px solid transparent}
  .thumb img{width:80px;height:56px;object-fit:cover;border-radius:10px;border:0}
  .thumb.active{border-color:var(--accent)}
  .chat .messages{max-height:280px;overflow:auto;display:grid;gap:10px}
  .chat-msg{border:1px solid #2f3746;border-radius:12px;padding:10px;background:#151a22}
  .chat-msg-head{display:flex;justify-content:space-between;align-items:center;gap:10px;color:var(--muted)}
  .chat-msg p{margin:8px 0 0;line-height:1.4}
  .chat-msg.from-admin{border-color:#c8881c66}
  .chat-del{margin-top:10px;padding:7px 12px;font-size:12px}
  .chat-compose{margin-top:12px}
  .form-grid{grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
  .upload{display:grid;gap:8px;color:var(--muted);border:1px dashed #424b5f;padding:10px;border-radius:12px}
  .preview-grid{margin:12px 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px}
  .preview{height:80px}
  .footer{max-width:1300px;margin:14px auto 0;border:1px solid #2f3744;background:var(--surface);border-radius:14px;padding:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
  .footer-social-links{display:flex;gap:8px;flex-wrap:wrap}
  .footer-social-btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border-radius:999px;padding:9px 13px;font-weight:700;color:#15100a;background:linear-gradient(135deg,#f0a215,#ffd670);transition:.2s}
  .footer-social-btn:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 12px 22px #00000038}
  @media (max-width:900px){
    .app{padding:0 10px 20px}
    .info-strip{font-size:11px;gap:8px}
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
    .between{flex-direction:column;align-items:stretch}
    .grid{grid-template-columns:1fr;gap:12px}
    .detail{grid-template-columns:1fr}
    .card img,.detail img{height:180px}
    .row{flex-direction:column;align-items:stretch}
    .chat-compose button{width:100%}
    .footer{padding:12px}
    .footer-social-links{width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
    .footer-social-btn{padding:8px 6px;font-size:12px}
  }
`;

export default DLRentApp;











