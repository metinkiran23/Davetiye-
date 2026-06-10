import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Users, Utensils, ClipboardList, CheckCircle2 } from 'lucide-react';
import { Rsvp } from '../types';

interface RsvpFormProps {
  onAddRsvp: (newRsvp: Rsvp) => void;
  initialName?: string;
}

export default function RsvpForm({ onAddRsvp, initialName = '' }: RsvpFormProps) {
  const [formData, setFormData] = useState({
    fullName: initialName,
    status: 'yes' as 'yes' | 'no',
    guestCount: 1,
    menuPreference: 'classic' as 'classic' | 'chicken' | 'vegetarian' | 'child',
    attendingWedding: 'agri' as 'agri' | 'osmaniye' | 'both',
    note: '',
  });

  useEffect(() => {
    if (initialName) {
      setFormData(prev => ({ ...prev, fullName: initialName }));
    }
  }, [initialName]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Lütfen adınızı ve soyadınızı belirtin.');
      return;
    }

    const newRsvpEntry: Rsvp = {
      id: 'rsvp-' + Date.now(),
      fullName: formData.fullName.trim(),
      status: formData.status,
      guestCount: formData.status === 'yes' ? formData.guestCount : 0,
      menuPreference: formData.status === 'yes' ? formData.menuPreference : 'classic',
      attendingWedding: formData.status === 'yes' ? formData.attendingWedding : undefined,
      note: formData.note.trim() ? formData.note.trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    onAddRsvp(newRsvpEntry);
    setIsSubmitted(true);

    // Reset form after a small delay
    setTimeout(() => {
      setFormData({
        fullName: '',
        status: 'yes',
        guestCount: 1,
        menuPreference: 'classic',
        attendingWedding: 'agri',
        note: '',
      });
    }, 500);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto glass-panel rounded-[32px] p-6 sm:p-8 shadow-2xl">
      {/* Luxury Border Accents */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-stone-400/40" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-stone-400/40" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-stone-400/40" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-stone-400/40" />

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="rsvp-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-4">
              <span className="font-serif text-stone-500 tracking-[0.25em] text-xs uppercase font-medium">LÜTFEN CEVAP VERİNİZ</span>
              <h3 className="font-serif text-2xl sm:text-3xl text-stone-800 font-light tracking-wide">Katılım Durumunuz</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                İki farklı şehirdeki düğün merasimi organizasyonumuzu eksiksiz yapabilmemiz için en geç <span className="font-semibold text-stone-750 text-stone-800 bg-amber-50 px-1.5 py-0.5 rounded">12 Haziran 2026</span> tarihine kadar katılım durumunuzu bildirmenizi rica ederiz.
              </p>
            </div>

            {/* Full Name Input */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-[10px] font-bold tracking-widest uppercase text-stone-600">
                Adınız Soyadınız *
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Örn: Selçuk Yılmaz"
                  className="w-full px-4 py-3 bg-white/30 border border-white/50 focus:border-stone-400 focus:bg-white/80 rounded-xl outline-none text-stone-800 text-sm tracking-wide transition-all duration-300 shadow-inner"
                />
              </div>
            </div>

            {/* Attendance Status (Radio Cards) */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-stone-600">
                Katılıyor musunuz?
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* YES Card */}
                <button
                  type="button"
                  id="rsvp-status-yes"
                  onClick={() => setFormData({ ...formData, status: 'yes' })}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    formData.status === 'yes'
                      ? 'bg-stone-800/90 border-stone-800 text-white shadow-md'
                      : 'bg-white/20 border-white/40 text-stone-500 hover:border-stone-300 hover:bg-white/50'
                  }`}
                >
                  <Heart className={`w-5 h-5 mb-1.5 ${formData.status === 'yes' ? 'fill-white/20 text-white' : 'text-stone-400'}`} />
                  <span className="font-serif text-sm font-medium">Katılıyorum</span>
                </button>

                {/* NO Card */}
                <button
                  type="button"
                  id="rsvp-status-no"
                  onClick={() => setFormData({ ...formData, status: 'no' })}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    formData.status === 'no'
                      ? 'bg-stone-100 border-stone-400 text-stone-800 shadow-md'
                      : 'bg-white/20 border-white/40 text-stone-500 hover:border-stone-300 hover:bg-white/50'
                  }`}
                >
                  <Heart className={`w-5 h-5 mb-1.5 rotate-180 ${formData.status === 'no' ? 'fill-stone-800/15 text-stone-800' : 'text-stone-400'}`} />
                  <span className="font-serif text-sm font-medium">Katılamıyorum</span>
                </button>
              </div>
            </div>

            {/* Conditionally reveal dynamic options (Wedding Selection, Guest List and Menu Selection) if attending */}
            <AnimatePresence>
              {formData.status === 'yes' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5 overflow-hidden"
                >
                  {/* Hangi Düğüne Katılıyorsunuz? Selector */}
                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-stone-600">
                      <Heart className="w-4 h-4 text-stone-500 fill-stone-500/10" />
                      Hangi Merasime Katılacaksınız? *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'osmaniye', label: 'Osmaniye (05 Haziran)' },
                        { id: 'agri', label: 'Ağrı (13 Haziran)' },
                        { id: 'both', label: 'Her İkisine de' },
                      ].map((venue) => (
                        <button
                          key={venue.id}
                          type="button"
                          id={`wedding-select-${venue.id}`}
                          onClick={() => setFormData({ ...formData, attendingWedding: venue.id as any })}
                          className={`px-3 py-2.5 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                            formData.attendingWedding === venue.id
                              ? 'bg-stone-800 text-white border-stone-800 font-semibold shadow-sm'
                              : 'bg-white/20 border-white/40 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          {venue.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guest Count */}
                  <div className="space-y-2">
                    <label htmlFor="guestCount" className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-stone-600">
                      <Users className="w-4 h-4 text-stone-500" />
                      Merasime Kaç Kişi Katılacaksınız?
                    </label>
                    <select
                      id="guestCount"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/30 border border-white/50 focus:border-stone-400 focus:bg-white/80 rounded-xl outline-none text-stone-800 text-sm transition-all duration-300 cursor-pointer"
                    >
                      <option value="1">Yalnızca Kendim (1 Kişi)</option>
                      <option value="2">Eşim / Partnerimle (2 Kişi)</option>
                      <option value="3">Biz + 1 Konuk (3 Kişi)</option>
                      <option value="4">Ailemizle Birlikte (4 Kişi)</option>
                      <option value="5">Grup Olarak (5 Kişi)</option>
                    </select>
                  </div>

                  {/* Menu Preference */}
                  <div className="space-y-2">
                    <label htmlFor="menuPreference" className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-stone-600">
                      <Utensils className="w-4 h-4 text-stone-500" />
                      Ziyafet Menüsü Tercihiniz
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'classic', label: 'Eti / Klasik' },
                        { id: 'chicken', label: 'Tavuk Menü' },
                        { id: 'vegetarian', label: 'Vejetaryen' },
                        { id: 'child', label: ' Çocuk Menü' },
                      ].map((menu) => (
                        <button
                          key={menu.id}
                          type="button"
                          id={`menu-${menu.id}`}
                          onClick={() => setFormData({ ...formData, menuPreference: menu.id as any })}
                          className={`px-2 py-3 text-xs rounded-xl border font-serif text-center transition-all duration-205 cursor-pointer ${
                            formData.menuPreference === menu.id
                              ? 'bg-stone-800 text-white border-stone-800 font-medium shadow-sm'
                              : 'bg-white/20 border-white/40 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          {menu.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Note to the Couple */}
            <div className="space-y-2">
              <label htmlFor="rsvp-note" className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-stone-600">
                <ClipboardList className="w-4 h-4 text-stone-500" />
                Çifte Kısa Not (Varsa Belirtmek İstedikleriniz)
              </label>
              <textarea
                id="rsvp-note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Alerji, glüten duyarlılığı veya çifte tatlı bir tebrik notu..."
                rows={3}
                className="w-full px-4 py-3 bg-white/30 border border-white/50 focus:border-stone-400 focus:bg-white/80 rounded-xl outline-none text-stone-800 text-sm tracking-wide transition-all duration-300 resize-none"
              />
            </div>

            {errorMsg && (
              <p className="text-sm font-semibold text-rose-700 text-center select-none bg-rose-50/50 py-2 rounded-xl border border-rose-200/50">
                ⚠️ {errorMsg}
              </p>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              id="rsvp-submit"
              className="w-full py-4.5 bg-stone-800 hover:bg-stone-900 text-white font-serif rounded-xl tracking-widest text-xs uppercase font-medium shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none"
            >
              Katılımımı Onayla
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="rsvp-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10 space-y-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-16 h-16 glass-inset rounded-full flex items-center justify-center border shadow-inner"
            >
              <CheckCircle2 className="w-9 h-9 text-stone-700 animate-pulse" />
            </motion.div>
            <div className="space-y-1">
              <h4 className="font-serif text-2xl text-stone-800 font-light">Cevabınız Kaydedildi!</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                {formData.status === 'yes'
                  ? 'Geri bildiriminiz için teşekkür ederiz. Bu görkemli gecede sizinle birlikte dans etmek için heyecanlıyız! 🥂'
                  : 'Gelemiyor olmanıza üzüldük, ancak güzel dilekleriniz bizimle olacağı için mutluyuz. Teşekkür ederiz! 🌸'}
              </p>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs font-serif text-stone-700 underline hover:text-stone-900 font-medium tracking-widest uppercase cursor-pointer"
            >
              Yeni Cevap Ekle / Düzenle
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
