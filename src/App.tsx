import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Calendar, MapPin, Clock, Music, Gift, Shirt, Info, 
  Map, Sparkles, Navigation, UserCheck, MessageSquare, ShieldCheck, Mail
} from 'lucide-react';

// Subcomponents
import ReusableCountdown from './components/Countdown';
import AudioPlayer from './components/AudioPlayer';
import RsvpForm from './components/RsvpForm';
import Guestbook from './components/Guestbook';
import Gallery from './components/Gallery';
import Timeline from './components/Timeline';
import AdminPanel from './components/AdminPanel';

// Types and generated asset path
import { Rsvp, GuestMessage, ProgramEvent, GalleryItem } from './types';
const coupleWatercolorAsset = '/src/assets/images/wedding_couple_watercolor_1781124197163.png';

export default function App() {
  // 1. Initial State Definitions with elegant real-world prepopulated mock data so the app looks vibrant immediately.
  const [rsvps, setRsvps] = useState<Rsvp[]>(() => {
    const saved = localStorage.getItem('wedding_rsvps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Prepopulation
    return [
      {
        id: 'rsvp-1',
        fullName: 'Ahmet Aksoy (Kuzen)',
        status: 'yes',
        guestCount: 2,
        menuPreference: 'classic',
        note: 'Tebrikler canım kardeşim, eşinle bir ömür boyu mutluluklar dilerim.',
        createdAt: '2026-06-08T14:24:00Z'
      },
      {
        id: 'rsvp-2',
        fullName: 'Dr. Meltem Kaya',
        status: 'yes',
        guestCount: 1,
        menuPreference: 'vegetarian',
        note: 'Glüten duyarlılığım bulunmaktadır, vejetaryen menü için şimdiden çok teşekkürler.',
        createdAt: '2026-06-09T18:05:00Z'
      },
      {
        id: 'rsvp-3',
        fullName: 'Büşra & Tolga Ertürk',
        status: 'no',
        guestCount: 0,
        menuPreference: 'classic',
        note: 'Yurtdışı seyahatimiz ile çakıştığı için bu özel günde yanınızda olamayacağız. Kalbimiz sizinle!',
        createdAt: '2026-06-10T11:15:00Z'
      }
    ];
  });

  const [messages, setMessages] = useState<GuestMessage[]>(() => {
    const saved = localStorage.getItem('wedding_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Prepopulation
    return [
      {
        id: 'msg-1',
        senderName: 'Nezihe & Kalender (Gelin Hanım Anne & Babası)',
        message: 'Canım kızımız Burla ve kıymetli damadımız Yusuf, ömür boyu mutluluklar dileriz. Yuvanız her daim huzurlu, bereketli ve sevgi dolu olsun!',
        createdAt: '2026-06-08T09:12:00Z'
      },
      {
        id: 'msg-2',
        senderName: 'Özgül & Celal (Damat Bey Anne & Babası)',
        message: 'Canımız oğlumuz Yusuf ve güzel kızımız Burla, bir ömür el ele yürümenizi diliyoruz. Birbirinize olan bağınız her gün daha da kuvvetlensin.',
        createdAt: '2026-06-09T10:35:00Z'
      },
      {
        id: 'msg-3',
        senderName: 'Kız Kardeş Zeynep Çetin',
        message: 'Sevgili abiciğim Yusuf ve dünyalar güzeli Burla ablacığım! Hayat boyu omuz omuza, sevgiyle ve sağlıkla yürümeniz dileğiyle. Her şey gönlünüzce olsun, sonsuz mutluluklar!',
        createdAt: '2026-06-09T12:35:00Z'
      },
      {
        id: 'msg-4',
        senderName: 'Umut & Simge Yılmaz (Yakın Arkadaşlar)',
        message: 'Harika bir çift, çok asil bir davetiye tasarlanmış! 13 Haziran akşamı Ağrı Royal Düğün Salonu\'nda pistte hep beraber eğlenmek ve bu muhteşem birleşmeye şahitlik etmek için şimdiden geri sayım yapmaya başladık.',
        createdAt: '2026-06-10T14:40:00Z'
      },
      {
        id: 'msg-5',
        senderName: 'Selçuk Hoca & Ailesi',
        message: 'Kurmuş olduğunuz bu mukaddes yuva her gün sevgi, saygı, bereket ve hoşgörüyle bezensin. Karşılıklı saygıyla örülmüş upuzun bir yolculuk dilerim sevgili gençler.',
        createdAt: '2026-06-10T19:50:00Z'
      }
    ];
  });

  // Save states to localStorage whenever modified
  useEffect(() => {
    localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));
  }, [rsvps]);

  useEffect(() => {
    localStorage.setItem('wedding_messages', JSON.stringify(messages));
  }, [messages]);

  // Guest name parsed from URL parameter (?davetli veya ?misafir)
  const [invitedGuestName, setInvitedGuestName] = useState('');
  
  // Set default active venue: we choose 'agri' since it is the upcoming main celebration on June 13
  const [activeVenue, setActiveVenue] = useState<'osmaniye' | 'agri'>('agri');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('davetli') || params.get('misafir');
    if (nameParam) {
      setInvitedGuestName(nameParam);
    }
  }, []);

  // Handle addition/removals
  const handleAddRsvp = (newRsvp: Rsvp) => {
    setRsvps(prev => [newRsvp, ...prev]);
  };

  const handleRemoveRsvp = (id: string) => {
    setRsvps(prev => prev.filter(r => r.id !== id));
  };

  const handleClearAllRsvps = () => {
    setRsvps([]);
  };

  const handleAddMessage = (newMessage: GuestMessage) => {
    setMessages(prev => [newMessage, ...prev]);
  };

  // Dynamic lists definitions
  const osmaniyeTimeline: ProgramEvent[] = [
    {
      id: 'osmaniye-1',
      time: '19:00 - 19:30',
      title: 'Karşılama & Kokteyl',
      description: 'Misafirlerimizin kırmızı halıda karşılanması, yöresel ikramlar ve müzik eşliğinde hoş geldiniz seremonisi.',
      icon: 'GlassWater',
    },
    {
      id: 'osmaniye-2',
      time: '19:45 - 20:15',
      title: 'Nikah Töreni Seremonisi',
      description: 'Zarif bir merasimle şahitlerin huzurunda atılan ömürlük imzalar ve tatlı "Evet" anı.',
      icon: 'Heart',
    },
    {
      id: 'osmaniye-3',
      time: '20:15 - 21:00',
      title: 'İlk Dans & Yemek / İkram Servisi',
      description: 'Çiftimizin masalsı ilk dansı ve misafirlerimize özel taze ikram menüsü servisi.',
      icon: 'Music',
    },
    {
      id: 'osmaniye-4',
      time: '21:00 - 22:45',
      title: 'Canlı Müzik & Sınırsız Eğlence',
      description: 'Osmaniye Polisevi orkestrası ile yöresel oyunlar, halaylar ve doyasıya eğlence.',
      icon: 'Sparkles',
    },
    {
      id: 'osmaniye-5',
      time: '22:45 - 23:00',
      title: 'Takı & Pasta Merasimi',
      description: 'Düğün tatlısının ikramı, tebriklerin kabulü ve hatıra fotoğrafları ile kapanış.',
      icon: 'Cake',
    },
  ];

  const agriTimeline: ProgramEvent[] = [
    {
      id: 'agri-1',
      time: '17:00 - 17:30',
      title: 'Zarif Karşılama & Kokteyl',
      description: 'Misafirlerimizin salona yerleşimi, çello ve keman eşliğinde nezih karşılama ve ikramlar.',
      icon: 'GlassWater',
    },
    {
      id: 'agri-2',
      time: '17:45 - 18:15',
      title: 'Nikah Töreni & İmza',
      description: 'Kutsal birlikteliğin resmiyete dökülmesi ve ilk kutlama seremonisi.',
      icon: 'Heart',
    },
    {
      id: 'agri-3',
      time: '18:15 - 19:30',
      title: 'Gelin & Damat İlk Dansı ve Yemek',
      description: 'Royal Düğün Salonu şeflerinin hazırladığı özel düğün yemeği eşliğinde dans resitali.',
      icon: 'Music',
    },
    {
      id: 'agri-4',
      time: '19:30 - 21:30',
      title: 'Seçkin Orkestra ile Eğlence',
      description: 'Canlı müzik performansı, coşkulu halay dairesi ve davetliler ile harika danslar.',
      icon: 'Sparkles',
    },
    {
      id: 'agri-5',
      time: '21:30 - 22:00',
      title: 'Düğün Pastası Kesimi & Veda',
      description: 'Takı töreni, leziz düğün pastası ikramı ve kıymetli misafirlerimize şükran dolu uğurlama.',
      icon: 'Cake',
    },
  ];

  const timelineEvents = activeVenue === 'osmaniye' ? osmaniyeTimeline : agriTimeline;

  const galleryItems: GalleryItem[] = [
    {
      id: 'gal-1',
      url: coupleWatercolorAsset,
      caption: 'Aşkımızın Büyülü Portresi (Watercolor Esintisi)',
      category: 'portraits'
    },
    {
      id: 'gal-2',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      caption: 'Doğanın Ortasında, Sonsuz Bir Huzur Bulduğumuz Gün',
      category: 'journey'
    },
    {
      id: 'gal-3',
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800',
      caption: 'Birleşen Elleri Süsleyecek Olan Söz Alyanslarımız',
      category: 'engagement'
    },
    {
      id: 'gal-4',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
      caption: 'Birlikte Atılan İlk Gülüşler ve Büyük Teklif Sıcaklığı',
      category: 'engagement'
    },
    {
      id: 'gal-5',
      url: 'https://images.unsplash.com/photo-1507504038482-7621c518aa05?auto=format&fit=crop&q=80&w=800',
      caption: 'Hayat Patikalarında Omuz Omuza Yürümek İçin Söz Verdik',
      category: 'journey'
    },
    {
      id: 'gal-6',
      url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=800',
      caption: 'Sizler İçin Özenle Hazırladığımız Davet Bahçemizden Detaylar',
      category: 'portraits'
    },
  ];

  // Smooth scroll handler helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-stone-800 font-sans selection:bg-stone-200 selection:text-stone-900 overflow-x-hidden">
      
      {/* 2. BACKGROUND GLASS THEME BLUR BUBBLES */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-rose-200/40 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse duration-10000" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse duration-[12000ms]" />
      <div className="absolute top-[20%] right-[10%] w-[200px] h-[200px] bg-stone-200/40 rounded-full blur-[60px] pointer-events-none -z-10" />
      <div className="absolute top-[50vh] left-[5%] w-[350px] h-[350px] bg-rose-200/30 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[30vh] right-[15%] w-[450px] h-[450px] bg-amber-100/40 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[14000ms]" />

      {/* 3. HERO PARALLAX BANNER STAGE */}
      <header className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 pt-12 pb-16 overflow-hidden">
        {/* Decorative Delicate Border framing */}
        <div className="absolute inset-4 sm:inset-8 border border-stone-300/40 rounded-[32px] pointer-events-none -z-10" />

        <div className="glass-panel max-w-4xl w-full rounded-[40px] shadow-2xl p-6 sm:p-12 md:p-16 space-y-8 relative z-10">
          {invitedGuestName && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2 mt-[-10px] bg-[#fdfcf7]/90 border border-stone-200/60 rounded-full text-xs font-serif font-light text-stone-700 tracking-wide shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
              Sevgili <span className="font-semibold text-stone-900">{invitedGuestName}</span>, Düğünümüze Sevgiyle Hoş Geldiniz!
            </motion.div>
          )}

          {/* Sparkle top sign */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center gap-2"
          >
            <div className="w-8 h-[1px] bg-stone-400"></div>
            <span className="text-[11px] tracking-[0.3em] uppercase font-semibold text-stone-500">DÜĞÜN DAVETİYESİ</span>
            <div className="w-8 h-[1px] bg-stone-400"></div>
          </motion.div>

          {/* Bride & Groom calligraphy heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-[54px] sm:text-[76px] leading-tight text-stone-800 font-light italic" style={{ fontFamily: 'Georgia, serif' }}>Burla</h2>
            <div className="flex items-center justify-center gap-4 my-1 text-stone-400 italic font-serif text-xl sm:text-2xl">ve</div>
            <h2 className="text-[54px] sm:text-[76px] leading-tight text-stone-800 font-light italic" style={{ fontFamily: 'Georgia, serif' }}>Yusuf</h2>
            
            <div className="w-16 h-[1px] bg-stone-300 mx-auto my-4 opacity-70" />
            
            {/* Elegant family members text, honoring the paper card details */}
            <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto pt-2 text-[11px] sm:text-xs text-stone-600 font-serif leading-relaxed px-4">
              <div className="text-center sm:text-right border-r border-stone-300/40 pr-6">
                <p className="font-semibold text-stone-800 uppercase tracking-widest text-[9px] mb-1.5 opacity-85">Gelinin Ailesi</p>
                <p className="font-medium text-stone-900">Nezihe KILIÇASLAN &</p>
                <p className="font-medium text-stone-900">Kalender KARADAĞ</p>
              </div>
              <div className="text-center sm:text-left pl-6">
                <p className="font-semibold text-stone-800 uppercase tracking-widest text-[9px] mb-1.5 opacity-85">Damadın Ailesi</p>
                <p className="font-medium text-stone-900">Özgül &</p>
                <p className="font-medium text-stone-900">Celal ÇETİN</p>
              </div>
            </div>

            <div className="w-12 h-[1px] bg-stone-450 mx-auto mt-6" />
          </motion.div>

          {/* Romantic introductory quote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="font-serif italic text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed px-4 font-light"
          >
            "Mutluluğumuza davetlisiniz... 
            Yıllar boyu sürecek sevgi dolu yolculuğumuzu sonsuz bir bağlılığa taşırken, 
            yaşamımızın bu en eşsiz günlerinde sizleri de aramızda görmekten büyük onur duyarız."
          </motion.p>

          {/* Quick Date-Venue Badges - Highlighting both wedding celebrations! */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col md:flex-row justify-center items-center gap-4 text-[10px] sm:text-xs font-semibold tracking-widest text-[#5c5445] uppercase pt-4 max-w-3xl mx-auto"
          >
            {/* Osmaniye Card */}
            <div className="w-full md:w-auto flex flex-col items-center gap-1.5 glass-inset px-6 py-3.5 rounded-2xl border border-rose-200/20 shadow-sm">
              <span className="text-[9px] text-stone-500 font-bold tracking-widest bg-stone-200/50 px-2 py-0.5 rounded-md">1. DÜĞÜN (OSMANİYE)</span>
              <span className="font-serif font-semibold text-stone-800 text-xs sm:text-[13px]">05 HAZİRAN 2026 | CUMA</span>
              <span className="text-[10px] text-stone-500 font-light lowercase">osmaniye polisevi (19:00 - 23:00)</span>
            </div>
            
            <div className="text-stone-300 font-light hidden md:block text-lg">&</div>
            
            {/* Ağrı Card */}
            <div className="w-full md:w-auto flex flex-col items-center gap-1.5 glass-inset px-6 py-3.5 rounded-2xl border border-amber-305/30 bg-amber-50/10 shadow-sm relative grow-0">
              <span className="text-[9px] text-amber-800 font-bold tracking-widest bg-amber-100/50 px-2 py-0.5 rounded-md flex items-center gap-1">2. DÜĞÜN (AĞRI) <span className="inline-block w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" /></span>
              <span className="font-serif font-semibold text-stone-800 text-xs sm:text-[13px]">13 HAZİRAN 2026 | CUMARTESİ</span>
              <span className="text-[10px] text-stone-500 font-light lowercase">royal düğün salonu (17:00 - 22:00)</span>
            </div>
          </motion.div>

          {/* CTA Action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="flex flex-wrap justify-center items-center gap-3 pt-4"
          >
            <button
              onClick={() => scrollToSection('section-rsvp')}
              className="flex-1 sm:flex-initial px-6 py-3 bg-stone-800 hover:bg-stone-950 text-white font-serif text-xs uppercase tracking-widest font-medium rounded-lg shadow-md transition-all duration-300 cursor-pointer"
            >
              Katılacağım (LCV)
            </button>
            <button
              onClick={() => scrollToSection('section-details')}
              className="flex-1 sm:flex-initial px-6 py-3 glass-inset hover:bg-white/40 border border-stone-300 text-stone-700 font-serif text-xs uppercase tracking-widest font-medium rounded-lg shadow-sm transition-all duration-300 cursor-pointer"
            >
              Detaylar & Program
            </button>
          </motion.div>
        </div>

        {/* Animated scrolling indicator at bottom */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          onClick={() => scrollToSection('section-details')}
          className="absolute bottom-6 flex flex-col items-center gap-1 cursor-pointer select-none"
        >
          <span className="text-[9px] font-bold tracking-widest text-stone-400 capitalize">Keşfet</span>
          <div className="w-4.5 h-7 rounded-full border border-stone-300 flex justify-center p-1">
            <div className="w-1 h-2 bg-stone-500 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </header>

      {/* 4. DETAIL METRICS BLOCK (Countdown and Introduction) */}
      <section id="section-details" className="relative w-full py-16 sm:py-24 bg-transparent">
        
        {/* Decorative Side laurels */}
        <div className="hidden lg:block absolute left-10 top-1/2 -translate-y-1/2 text-stone-400/10 font-serif text-[120px] pointer-events-none select-none">❀</div>
        <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 text-stone-400/10 font-serif text-[120px] pointer-events-none select-none">❀</div>

        <div className="max-w-6xl mx-auto px-4 space-y-16">
          
          {/* Section title */}
          <div className="text-center space-y-2">
            <span className="font-serif text-stone-500 tracking-[0.2em] text-xs uppercase font-medium">BİRLİKTE GEÇEREK GELECEĞE</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-stone-800 font-light tracking-wide">Ağrı Düğünü Geri Sayım</h2>
            <p className="text-xs text-stone-500">13 Haziran 2026 Saat 17:00'deki bir sonraki heyecan verici buluşmamıza kalan zaman</p>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-2" />
          </div>

          {/* High-Contrast Luxury Countdown component */}
          <ReusableCountdown targetDateStr="2026-06-13T17:00:00" />

          {/* Introducing Bride and Groom Story Frame */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-8 max-w-5xl mx-auto">
            
            {/* Bride side */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:col-span-5 text-center md:text-right space-y-3"
            >
              <span className="font-cursive text-4xl text-stone-700 tracking-wide">Burla Karadağ</span>
              <h4 className="font-serif text-sm font-semibold tracking-widest text-[#a855f7] uppercase mb-1">GELİN</h4>
              <p className="text-xs text-stone-500 leading-relaxed font-light font-sans max-w-sm ml-auto">
                Kalbinin asilliği, neşesi ve zarafetiyle hayat yolumuza daima ışık tutan Burla, 
                Yusuf ile birleştirdiği ellerini bir ömür boyu sımsıkı tutmak için sevdiklerinin huzuruna gururla çıkıyor.
              </p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">#BurlaYusufKavuşuyor</p>
            </motion.div>

            {/* Central Signature Art Frame with Generated Watercolor couple painting */}
            <div className="md:col-span-2 flex justify-center py-4">
              <motion.div 
                whileHover={{ rotate: 1 }}
                className="relative w-40 h-52 sm:w-44 sm:h-56 rounded-[32px] overflow-hidden border-4 border-white/60 shadow-2xl bg-[#f9f7f2]"
              >
                {/* Generated couple watercolor photo placeholder */}
                <img 
                  src={coupleWatercolorAsset} 
                  alt="Burla & Yusuf Watercolor Portrait" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border border-white/40 rounded-[28px]" />
              </motion.div>
            </div>

            {/* Groom side */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:col-span-5 text-center md:text-left space-y-3"
            >
              <span className="font-cursive text-4xl text-stone-700 tracking-wide">Yusuf Çetin</span>
              <h4 className="font-serif text-sm font-semibold tracking-widest text-[#f59e0b] uppercase mb-1">DAMAT</h4>
              <p className="text-xs text-stone-500 leading-relaxed font-light font-sans max-w-sm mr-auto">
                Dürüstlüğü, bitmek bilmeyen sabırlı sevgisi ve kucaklayıcı yüreğiyle aşkın en güzel sığınağı olan Yusuf, 
                Burla'ya verdiği ömürlük sadakat ve aşk sözünü bu rüya gibi davet ile resmileştiriyor.
              </p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">#SonsuzaDekBY</p>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 5. TIMELINE FLOW OF THE DAY */}
      <section className="relative w-full py-16 sm:py-24 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="font-serif text-stone-500 tracking-[0.2em] text-xs uppercase font-medium">OMUZ OMUZA MERASİM</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-stone-800 font-light tracking-wide">Düğün Günü Akışı</h2>
            <p className="text-xs text-stone-500 max-w-sm sm:max-w-md mx-auto">
              Yukarıda seçtiğiniz düğün lokasyonuna göre dinamik olarak güncellenen kutlama program takvimi.
            </p>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-2" />
          </div>

          <Timeline events={timelineEvents} />

        </div>
      </section>

      {/* 6. BENTO PORTFOLIO GALLERY */}
      <section className="relative w-full py-16 sm:py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="font-serif text-stone-500 tracking-[0.2em] text-xs uppercase font-medium">BİRİKİMLERİMİZ / ANLARIMIZ</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-stone-800 font-light tracking-wide">Aşkımızın Galerisi</h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto">Bu yolculukta biriktirdiğimiz en nadide hikayeleri ve anları sizinle paylaşmak istedik.</p>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-2" />
          </div>

          {/* Multi-Filter visual lightbox photo catalog */}
          <Gallery items={galleryItems} />

        </div>
      </section>

      {/* 7. PRACTICAL INFO & MAP DIREKTIONS */}
      <section className="relative w-full py-20 bg-stone-900 text-stone-100">
        
        {/* Ambient Dark Stars overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="font-serif text-stone-400 tracking-[0.25em] text-xs uppercase font-semibold">ULAŞIM VE ÖNEMLİ DETAYLAR</span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-light tracking-wide">Düğün Yeri & Yol Tarifi</h2>
            <p className="text-xs text-stone-450 text-stone-400 max-w-md mx-auto">
              Detaylarını görmek istediğiniz kutlama mekanını seçerek yol tarifi alabilirsiniz.
            </p>
            <div className="w-12 h-px bg-stone-500 mx-auto mt-2" />
          </div>

          {/* Luxury Tab Switcher for Wedding Venues */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto">
            <button
              onClick={() => setActiveVenue('osmaniye')}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-serif tracking-widest uppercase cursor-pointer transition-all duration-300 ${
                activeVenue === 'osmaniye'
                  ? 'bg-rose-600 text-white font-semibold shadow-md border border-rose-500'
                  : 'bg-white/5 text-stone-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              1. DÜĞÜN: OSMANİYE (5 HAZİRAN)
            </button>
            <button
              onClick={() => setActiveVenue('agri')}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-serif tracking-widest uppercase cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5 ${
                activeVenue === 'agri'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md border border-amber-400'
                  : 'bg-white/5 text-stone-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              2. DÜĞÜN: AĞRI (13 HAZİRAN)
              <span className="inline-block w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch pt-4">
            
            {/* Details texts cards */}
            <div className="md:col-span-5 h-full flex flex-col justify-between space-y-6">
              
              {/* Hotel / Venue address */}
              {activeVenue === 'osmaniye' ? (
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4 shadow-lg transition-all duration-350">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-5 h-5 text-rose-400" />
                    <h4 className="font-serif text-base text-white tracking-wide">Osmaniye Düğün Yeri</h4>
                  </div>
                  <div className="space-y-2 text-xs text-stone-300">
                    <p className="font-bold text-base text-white text-rose-300">OSMANİYE POLİSEVİ DÜĞÜN SALONU</p>
                    <p className="text-stone-300 leading-relaxed">
                      <span className="font-semibold text-white">Tam Adres:</span> Akyar Mahallesi, Osmaniye/Merkez
                    </p>
                    <div className="w-full h-px bg-white/10 my-1" />
                    <p className="text-stone-350 leading-relaxed font-light">
                      <span className="font-semibold text-white">🚗 Otopark Bilgisi:</span> Polisevi düğün salonu bünyesinde misafirlerimize özel <span className="font-semibold text-white">ücretsiz geniş otopark alanı</span> bulunmaktadır. Girişte davetli olduğunuzu belirtip güvenli park yapabilirsiniz.
                    </p>
                    <p className="text-[11px] text-stone-400 pt-1 font-semibold">📞 İletişim: 0507 737 34 11</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <a 
                      href="https://maps.google.com/?q=Osmaniye+Polisevi" 
                      target="_blank" 
                      rel="noreferrer"
                      id="address-get-directions-osmaniye"
                      className="flex-grow inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-900 border border-white/20 text-white rounded-xl text-xs font-serif font-medium cursor-pointer transition-all duration-300 shadow-md"
                    >
                      <Navigation className="w-4 h-4 text-rose-400" /> Yol Tarifi (Haritada Aç)
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4 shadow-lg transition-all duration-350">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <h4 className="font-serif text-base text-white tracking-wide">Ağrı Düğün Yeri</h4>
                  </div>
                  <div className="space-y-2 text-xs text-stone-300">
                    <p className="font-bold text-base text-white text-amber-300">ROYAL DÜĞÜN SALONU</p>
                    <p className="text-stone-400 leading-none text-[10px] uppercase font-bold tracking-widest">(ATSO Binası Üzeri)</p>
                    <p className="text-stone-300 leading-relaxed pt-1">
                      <span className="font-semibold text-white">Tam Adres:</span> Ağrı Ticaret ve Sanayi Odası Binası Kat:5, Ağrı/Merkez
                    </p>
                    <div className="w-full h-px bg-white/10 my-1" />
                    <p className="text-stone-350 leading-relaxed font-light">
                      <span className="font-semibold text-white">🚗 Otopark & Giriş Bilgisi:</span> ATSO kompleksi bünyesinde <span className="font-semibold text-white">açık ve kapalı otopark</span> misafirlerimize ücretsizdir. Binanın asansörleriyle doğrudan düğün salonu katına rahatça geçilebilmektedir.
                    </p>
                    <p className="text-[11px] text-stone-400 pt-1 font-semibold">📞 İletişim: 0538 563 52 74</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <a 
                      href="https://maps.google.com/?q=Agri+Royal+Dugun+Salonu" 
                      target="_blank" 
                      rel="noreferrer"
                      id="address-get-directions-agri"
                      className="flex-grow inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-900 border border-white/20 text-white rounded-xl text-xs font-serif font-medium cursor-pointer transition-all duration-300 shadow-md"
                    >
                      <Navigation className="w-4 h-4 text-amber-400" /> Yol Tarifi (Haritada Aç)
                    </a>
                  </div>
                </div>
              )}

              {/* Dress Code card */}
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-xl text-stone-300 mt-1">
                  <Shirt className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-serif text-sm text-white tracking-wide">Giyim Teması / Konsept</h5>
                  <p className="text-xs text-stone-300 leading-relaxed font-light font-sans">
                    Hayatımızın bu en özel gününde sizleri <span className="font-semibold text-white">Şık / Yarı-Resmi</span> kıyafetler içinde görmekten mutluluk duyacağız. Rahatça dans edebileceğiniz, şıklık ve zarafetin ön planda olduğu seçimlerinizle sitemize neşe katabilirsiniz.
                  </p>
                </div>
              </div>

              {/* Gift information */}
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-xl text-stone-300 mt-1">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-serif text-sm text-white tracking-wide">Vakıf Bağışı ve Tebrik</h5>
                  <p className="text-xs text-stone-300 leading-relaxed font-light font-sans">
                    Bizlere çiçek göndermeyi arzu eden değerli dostlarımızın, fiziki çelenkler yerine 
                    <span className="font-semibold text-white"> LÖSEV</span>, <span className="font-semibold text-white">Türk Kızılay</span> veya <span className="font-semibold text-white">TEMA Vakfı</span> üzerinden, 
                    <span className="font-semibold text-white"> Burla & Yusuf</span> çifti adına diledikleri oranda bağış yapmalarını rica ve arzu ederiz.
                  </p>
                </div>
              </div>

            </div>

            {/* Embedded maps simulator */}
            <div className="md:col-span-7 h-full min-h-[350px] bg-stone-950/40 border border-white/10 rounded-3xl overflow-hidden relative group shadow-2xl">
              <iframe 
                title="Wedding Hall Venue Address Location Map Detail"
                src={activeVenue === 'osmaniye' 
                  ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.1340026732954!2d36.25740417646193!3d37.054366972202626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152f5ead69837aef%3A0xc3fa86bf620e7e1f!2sOsmaniye%20Polisevi!5e0!3m2!1sen!2str!4v1718041100000!5m2!1sen!2str"
                  : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1527.152864698516!2d43.0450!3d39.7200!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40145b2b2ca1d219%3A0x87ee5d519b78807d!2s%C4%B0brahim%20%C3%87e%C3%A7en%20University!5e0!3m2!1sen!2str!4v1718042000000!5m2!1sen!2str"
                } 
                className="w-full h-full min-h-[350px] border-none rounded-3xl transition-all duration-300 relative z-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              
              {/* Top Floating Badge for Google Maps deep link */}
              <a 
                href={activeVenue === 'osmaniye' ? "https://maps.google.com/?q=Osmaniye+Polisevi" : "https://maps.google.com/?q=Agri+Royal+Dugun+Salonu"}
                target="_blank"
                rel="noreferrer"
                className="absolute top-4 left-4 z-10 px-3.5 py-2 bg-stone-900/90 hover:bg-stone-950 hover:scale-105 border border-white/20 text-white rounded-xl text-xs font-serif font-medium tracking-wide flex items-center gap-2 cursor-pointer backdrop-blur-md shadow-xl transition-all duration-300"
              >
                <Map className="w-4 h-4 text-rose-450 animate-pulse" />
                Google Haritalar'da Aç
              </a>

              {/* Bottom Floating Navigation buttons */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-2">
                <a 
                  href={activeVenue === 'osmaniye' ? "https://maps.google.com/?q=Osmaniye+Polisevi" : "https://maps.google.com/?q=Agri+Royal+Dugun+Salonu"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-grow inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900/90 hover:bg-stone-950 border border-white/20 text-white text-xs font-serif font-medium rounded-xl cursor-pointer shadow-lg backdrop-blur-sm transition-all duration-300"
                >
                  <Navigation className="w-4 h-4 text-emerald-400" /> Google Navigasyon
                </a>
                <a 
                  href={activeVenue === 'osmaniye' ? "https://maps.apple.com/?q=Osmaniye+Polisevi" : "https://maps.apple.com/?q=Agri+Royal+Dugun+Salonu"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-grow inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900/90 hover:bg-stone-950 border border-white/20 text-white text-xs font-serif font-medium rounded-xl cursor-pointer shadow-lg backdrop-blur-sm transition-all duration-300"
                >
                  <Navigation className="w-4 h-4 text-sky-400" /> Apple Harita
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. INTERACTIVE RSVP FORM */}
      <section id="section-rsvp" className="relative w-full py-16 sm:py-24 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="font-serif text-stone-500 tracking-[0.2em] text-xs uppercase font-medium">BİZİMLE MİSİNİZ?</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-stone-800 font-light tracking-wide">Katılımınızı Onaylayın</h2>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-2" />
          </div>

          {/* Form and info */}
          <RsvpForm onAddRsvp={handleAddRsvp} initialName={invitedGuestName} />

        </div>
      </section>

      {/* 9. WISH GUESTBOOK (Tebrikler Defteri) */}
      <section className="relative w-full py-16 sm:py-24 bg-transparent">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="font-serif text-stone-500 tracking-[0.2em] text-xs uppercase font-medium">ANI VE MEMLEKET DEFTERİ</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-stone-800 font-light tracking-wide">Tebrikler Defteri</h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto">Bizim için yazacağınız tebrikler ve mesajlar mutluluğumuzu taçlandıracaktır.</p>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-2" />
          </div>

          <Guestbook 
            messages={messages} 
            onAddMessage={handleAddMessage} 
          />

        </div>
      </section>

      {/* 10. DÜĞÜN BAŞLIĞI ALTIN RESİTALİ (Vintage Outro) */}
      <footer className="relative w-full py-16 bg-transparent text-center space-y-6">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-stone-400/10 font-serif text-6xl">❦</div>

        <div className="space-y-2">
          <span className="font-cursive text-5xl text-stone-700 tracking-wide font-light">Burla & Yusuf</span>
          <p className="text-[10px] tracking-[0.3em] font-bold text-stone-400 uppercase font-serif mt-1">Ömür Boyu Mutlulukla - 13.06.2026</p>
        </div>

        <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed px-4">
          Bu mutlu günlerimizde kalplerimizin sevincini bizimle paylaştığınız için tüm misafirlerimize şimdiden en kalbi şükranlarımızı sunarız.
        </p>

        {/* 11. SECURITY ADMIN REPORT BOARD PANEL */}
        <AdminPanel 
          rsvps={rsvps} 
          onRemoveRsvp={handleRemoveRsvp} 
          onClearAll={handleClearAllRsvps} 
        />
      </footer>

      {/* Floating Audio Soundtrack Sequencer */}
      <AudioPlayer />

    </div>
  );
}
