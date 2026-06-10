import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Utensils, Heart, Trash2, Shield, Calendar, Download, Eye, FileSpreadsheet, Copy, Check, Share2 } from 'lucide-react';
import { Rsvp } from '../types';

interface AdminPanelProps {
  rsvps: Rsvp[];
  onRemoveRsvp: (id: string) => void;
  onClearAll: () => void;
}

export default function AdminPanel({ rsvps, onRemoveRsvp, onClearAll }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [search, setSearch] = useState('');

  // Personalized guest share links state
  const [guestShareName, setGuestShareName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Passcode simple verification
    if (passcode.toLowerCase() === 'burlayusuf' || passcode === '2026' || passcode === '1234') {
      setIsUnlocked(true);
      setPasscode('');
    } else {
      alert('Hatalı Yönetici Şifresi! (Test için şifre: 1234 atau burlayusuf)');
    }
  };

  const handleAutoUnlock = () => {
    setIsUnlocked(true);
    setPasscode('');
  };

  // Math summary calculations
  const totalRsvpCount = rsvps.length;
  const attendingGuests = rsvps
    .filter(r => r.status === 'yes')
    .reduce((sum, r) => sum + r.guestCount, 0);

  const notAttendingGuests = rsvps.filter(r => r.status === 'no').length;

  // Osmaniye & Ağrı specific attendance math
  const osmaniyeAttending = rsvps
    .filter(r => r.status === 'yes' && (r.attendingWedding === 'osmaniye' || r.attendingWedding === 'both'))
    .reduce((sum, r) => sum + r.guestCount, 0);

  const agriAttending = rsvps
    .filter(r => r.status === 'yes' && (r.attendingWedding === 'agri' || r.attendingWedding === 'both'))
    .reduce((sum, r) => sum + r.guestCount, 0);

  const menuCounts = {
    classic: rsvps.filter(r => r.status === 'yes' && r.menuPreference === 'classic').reduce((sum, r) => sum + r.guestCount, 0),
    chicken: rsvps.filter(r => r.status === 'yes' && r.menuPreference === 'chicken').reduce((sum, r) => sum + r.guestCount, 0),
    vegetarian: rsvps.filter(r => r.status === 'yes' && r.menuPreference === 'vegetarian').reduce((sum, r) => sum + r.guestCount, 0),
    child: rsvps.filter(r => r.status === 'yes' && r.menuPreference === 'child').reduce((sum, r) => sum + r.guestCount, 0),
  };

  const filteredRsvps = rsvps.filter(r =>
    r.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (r.note && r.note.toLowerCase().includes(search.toLowerCase()))
  );

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestShareName.trim()) return;
    const base = window.location.protocol + '//' + window.location.host + window.location.pathname;
    const cleanName = encodeURIComponent(guestShareName.trim());
    const finalUrl = `${base}?davetli=${cleanName}`;
    setGeneratedLink(finalUrl);
    setCopiedLink(false);
    setCopiedMessage(false);
  };

  const shareTextTemplate = guestShareName.trim()
    ? `Sevgili ${guestShareName.trim()},\n\nHayatımızın en özel gününde, Burla & Yusuf olarak sonsuz bir birlikteliğe adım atarken sizleri de aramızda görmekten büyük onur duyarız. ✨\n\nÖzel dijital davetiyemiz ve katılım formumuz (RSVP) için lütfen aşağıdaki bağlantıyı ziyaret edin:\n${generatedLink}\n\nSevgiyle,\nBurla & Yusuf`
    : '';

  const copyToClipboard = (text: string, type: 'link' | 'msg') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  const downloadCsv = () => {
    const headers = ['Isim', 'Durum', 'Kisi Sayisi', 'Menu Tercihi', 'Not', 'Tarih'];
    const rows = rsvps.map(r => [
      r.fullName,
      r.status === 'yes' ? 'Katiliyor' : 'Katilmiyor',
      r.status === 'yes' ? r.guestCount : 0,
      r.status === 'yes' ? r.menuPreference : '-',
      r.note || '',
      r.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'dugun_davetli_listesi.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-12 py-10 border-t border-stone-200/50">
      <div className="flex flex-col items-center select-none">
        <button
          id="admin-panel-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="px-5 py-2.5 glass-panel hover:bg-white/50 text-stone-600 rounded-full text-xs font-serif tracking-widest uppercase transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Shield className="w-4 h-4 text-stone-600" />
          {isOpen ? 'Yönetici Panelini Kapat' : 'Gelin & Damat Yönetici Paneli'}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-6"
          >
            {!isUnlocked ? (
              // Unlock Screen
              <div className="max-w-md mx-auto p-6 glass-panel rounded-2xl text-center space-y-4 shadow-xl">
                <div className="w-12 h-12 glass-inset rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-stone-700" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-medium text-stone-800">Yönetim Girişi</h4>
                  <p className="text-xs text-stone-500">
                    Gelen RSVPs ve davetli listesi raporunu takip etmek için şifreyi girin.
                  </p>
                  <p className="text-[11px] font-semibold text-stone-700 bg-white/50 py-1.5 rounded inline-block px-3 border border-white/60 mt-1">
                    Gözlemlemek için Test Şifresi: <span className="font-mono">1234</span>
                  </p>
                </div>

                <form onSubmit={handleUnlock} className="flex gap-2 justify-center">
                  <input
                    id="admin-passcode"
                    type="password"
                    placeholder="Şifreyi giriniz..."
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="px-3.5 py-2 border border-white/50 rounded-xl outline-none text-sm w-44 bg-white/30 focus:border-stone-400 focus:bg-white/80 transition-all"
                  />
                  <button
                    type="submit"
                    id="admin-btn-unlock"
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-serif font-medium cursor-pointer"
                  >
                    Giriş
                  </button>
                </form>

                <div className="text-xs text-stone-400">
                  veya{' '}
                  <button
                    onClick={handleAutoUnlock}
                    className="text-stone-800 font-semibold underline cursor-pointer hover:text-stone-950"
                  >
                    Şifresiz Doğrudan Panel Aç
                  </button>
                </div>
              </div>
            ) : (
              // Unlocked Active Panel Dashboard
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel rounded-[32px] p-6 shadow-2xl space-y-6"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4 border-b border-white/50">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-stone-800 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-stone-600 decoration-none" /> Gelin & Damat Raporlama Ekranı
                    </h3>
                    <p className="text-xs text-stone-500">Burla & Yusuf düğün davetiyeniz üzerinde toplanan güncel istatistikler.</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      id="admin-btn-export"
                      onClick={downloadCsv}
                      disabled={rsvps.length === 0}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-900 disabled:opacity-40 text-white rounded-xl text-xs font-serif font-medium flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Download className="w-4 h-4" /> Excel / CSV İndir
                    </button>
                    <button
                      id="admin-btn-clear"
                      onClick={() => {
                        if (confirm('Tüm katılımcı listelerini sıfırlamak istediğinize emin misiniz?')) {
                          onClearAll();
                        }
                      }}
                      className="px-3.5 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-serif font-medium cursor-pointer transition-all"
                    >
                      Sıfırla
                    </button>
                  </div>
                </div>

                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Total responses */}
                  <div className="glass-inset p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/50 border border-white/40 text-stone-700 flex items-center justify-center shadow-inner">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider">TOPLAM CEVAP</span>
                      <span className="text-xl font-serif font-semibold text-stone-800">{totalRsvpCount}</span>
                    </div>
                  </div>

                  {/* Attending guests */}
                  <div className="glass-inset p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/50 border border-white/40 text-stone-700 flex items-center justify-center shadow-inner">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider">GELECEK DAVETLİ</span>
                      <span className="text-xl font-serif font-semibold text-stone-800">{attendingGuests} Kişi</span>
                    </div>
                  </div>

                  {/* Not attending */}
                  <div className="glass-inset p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/50 border border-white/40 text-stone-700 flex items-center justify-center shadow-inner">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider">GELEMEYEN</span>
                      <span className="text-xl font-serif font-semibold text-stone-800">{notAttendingGuests} Kişi</span>
                    </div>
                  </div>

                  {/* Menu favorites */}
                  <div className="glass-inset p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/50 border border-white/40 text-stone-700 flex items-center justify-center shadow-inner">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider">KLASİK / TAVUK</span>
                      <span className="text-sm font-serif font-semibold text-stone-800">
                        {menuCounts.classic} Et / {menuCounts.chicken} Tv
                      </span>
                    </div>
                  </div>
                </div>

                {/* City/Venue and Menu Breakdowns Side-by-Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* City/Venue Breakdown */}
                  <div className="glass-inset p-4 rounded-2xl space-y-2">
                    <h5 className="font-serif text-xs font-bold text-stone-700 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Merasim Katılım Dağılımı:
                    </h5>
                    <div className="space-y-1.5 text-xs text-stone-600">
                      <p className="flex justify-between border-b border-stone-200/40 pb-1">
                        <span>🌸 Osmaniye Düğünü Katılımcısı:</span> 
                        <strong className="text-rose-700 font-semibold">{osmaniyeAttending} Davetli</strong>
                      </p>
                      <p className="flex justify-between border-b border-stone-200/40 pb-1">
                        <span>🏔️ Ağrı Düğünü Katılımcısı:</span> 
                        <strong className="text-amber-700 font-semibold">{agriAttending} Davetli</strong>
                      </p>
                      <p className="text-[10px] text-stone-400 italic pt-1">
                        * "Her İkisine de" seçeneğini seçen konuklar her iki başlığa da dahil edilmiştir.
                      </p>
                    </div>
                  </div>

                  {/* Sub Menu breakdowns details */}
                  <div className="glass-inset p-4 rounded-2xl space-y-2">
                    <h5 className="font-serif text-xs font-bold text-stone-700 tracking-wider uppercase mb-2">
                      🍽️ Menü Tercih Dağılımı:
                    </h5>
                    <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-stone-600">
                      <div className="flex justify-between border-b border-stone-200/40 pb-0.5">
                        <span>🍖 Et Menü:</span>
                        <strong className="text-stone-800 font-semibold">{menuCounts.classic}</strong>
                      </div>
                      <div className="flex justify-between border-b border-stone-200/40 pb-0.5">
                        <span>🌱 Vejetaryen:</span>
                        <strong className="text-stone-800 font-semibold">{menuCounts.vegetarian}</strong>
                      </div>
                      <div className="flex justify-between border-b border-stone-200/40 pb-0.5">
                        <span>🍗 Tavuk Menü:</span>
                        <strong className="text-stone-800 font-semibold">{menuCounts.chicken}</strong>
                      </div>
                      <div className="flex justify-between border-b border-stone-200/40 pb-0.5">
                        <span>👶 Çocuk:</span>
                        <strong className="text-stone-800 font-semibold">{menuCounts.child}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GUEST INVITATION LINK GENERATOR */}
                <div className="glass-inset p-5 rounded-2xl space-y-4 border border-stone-200/40">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-stone-700" />
                    <h5 className="font-serif text-sm font-semibold text-stone-855 tracking-wider uppercase bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">Kişiselleştirilmiş Davetiye Linki Oluşturucu</h5>
                  </div>
                  
                  <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
                    Misafirlerinize özel, isimlerinin yazılı şekilde açılacağı ve katılım formunda adlarının otomatik olarak doldurulacağı davetiye bağlantıları oluşturun.
                  </p>

                  <form onSubmit={handleGenerateLink} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Misafirin Adı Soyadı (Örn: Mehmet Öz & Ailesi)..."
                      value={guestShareName}
                      onChange={(e) => setGuestShareName(e.target.value)}
                      className="px-3.5 py-2.5 border border-white/50 bg-white/35 rounded-xl outline-none text-xs flex-grow focus:border-stone-400 focus:bg-white/80 transition-all shadow-inner text-stone-800"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-serif font-medium cursor-pointer transition-colors"
                    >
                      Özel Link Bağlantısı Oluştur
                    </button>
                  </form>

                  <AnimatePresence>
                    {generatedLink && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-2 overflow-hidden"
                      >
                        {/* Final Link Copy Area */}
                        <div className="space-y-1.5">
                          <span className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider">Oluşturulan Özel Davetiye Bağlantısı:</span>
                          <div className="flex gap-2 items-center bg-white/40 border border-white/50 p-2 rounded-xl">
                            <span className="text-xs font-mono text-stone-750 truncate flex-grow px-2 py-1 select-all text-stone-800 bg-stone-100/50 rounded-lg">
                              {generatedLink}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(generatedLink, 'link')}
                              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-[#2c2c2c] rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-all shrink-0 border border-stone-200"
                            >
                              {copiedLink ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Kopyalandı!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-stone-600" />
                                  <span>Linki Kopyala</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* WhatsApp Ready Copy Area */}
                        <div className="space-y-1.5">
                          <span className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider">Hazır WhatsApp / SMS Gönderim Şablonu:</span>
                          <div className="bg-white/30 border border-white/50 p-3 rounded-xl space-y-2 relative">
                            <pre className="text-xs text-stone-700 whitespace-pre-wrap font-sans leading-relaxed text-left max-h-40 overflow-y-auto pr-2 custom-scrollbar select-text">
                              {shareTextTemplate}
                            </pre>
                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(shareTextTemplate, 'msg')}
                                className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-serif font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                              >
                                {copiedMessage ? (
                                  <>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    <span>Şablon Kopyalandı!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    <span>Tüm Davet Mesajını Kopyala</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* RSVPs Table list */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="font-serif text-sm font-medium text-stone-800">Cevap Veren Davetli Listesi ({filteredRsvps.length})</h4>
                    <input
                      type="text"
                      placeholder="Davetli ismini arayın..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="px-3.5 py-1.5 border border-white/50 bg-white/35 rounded-xl outline-none text-xs w-full sm:w-64 focus:border-stone-400 focus:bg-white/80 transition-all shadow-inner"
                    />
                  </div>

                  <div className="overflow-x-auto border border-white/40 rounded-2xl bg-white/10">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-white/30 backdrop-blur-sm border-b border-white/40 text-stone-600 font-serif font-light">
                          <th className="p-3">Davetli Adı</th>
                          <th className="p-3">Katılım Durumu</th>
                          <th className="p-3">Seçilen Merasim</th>
                          <th className="p-3">Kişi Sayısı</th>
                          <th className="p-3">Menü Tercihi</th>
                          <th className="p-3">Not / Mesaj</th>
                          <th className="p-3 text-center">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/20">
                        {filteredRsvps.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-4 text-center text-stone-400 font-light">Aranan kriterlere uygun davetli kaydı bulunamadı.</td>
                          </tr>
                        ) : (
                          filteredRsvps.map((rsvp) => (
                            <tr key={rsvp.id} className="hover:bg-white/10 transition-colors">
                              <td className="p-3 font-medium text-stone-800">{rsvp.fullName}</td>
                              <td className="p-3">
                                {rsvp.status === 'yes' ? (
                                  <span className="px-2 py-0.5 rounded-full bg-stone-800 text-white font-semibold text-[10px]">Katılıyor</span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 font-semibold text-[10px]">Katılamıyor</span>
                                )}
                              </td>
                              <td className="p-3 text-stone-700 font-medium">
                                {rsvp.status === 'yes' ? (
                                  rsvp.attendingWedding === 'osmaniye' ? '🌸 Osmaniye' :
                                  rsvp.attendingWedding === 'agri' ? '🏔️ Ağrı' :
                                  rsvp.attendingWedding === 'both' ? '💫 Her İkisi' : '🏔️ Ağrı'
                                ) : '-'}
                              </td>
                              <td className="p-3 text-stone-600">{rsvp.status === 'yes' ? rsvp.guestCount : 0}</td>
                              <td className="p-3 text-stone-600 font-serif">
                                {rsvp.status === 'yes' ? (
                                  rsvp.menuPreference === 'classic' ? 'Et Menüsü' :
                                  rsvp.menuPreference === 'chicken' ? 'Tavuk Menüsü' :
                                  rsvp.menuPreference === 'vegetarian' ? 'Vejetaryen' : 'Çocuk Menüsü'
                                ) : '-'}
                              </td>
                              <td className="p-3 text-stone-500 max-w-xs truncate italic" title={rsvp.note}>
                                {rsvp.note || <span className="text-stone-300 font-light">-</span>}
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => onRemoveRsvp(rsvp.id)}
                                  className="p-1 hover:bg-rose-50 rounded text-rose-600 transition-colors cursor-pointer"
                                  title="Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
