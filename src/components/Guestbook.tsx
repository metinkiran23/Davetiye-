import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageSquare, Feather, Smile } from 'lucide-react';
import { GuestMessage } from '../types';

interface GuestbookProps {
  messages: GuestMessage[];
  onAddMessage: (newMessage: GuestMessage) => void;
}

export default function Guestbook({ messages, onAddMessage }: GuestbookProps) {
  const [senderName, setSenderName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);

    if (!senderName.trim()) {
      setErrorMsg('Lütfen isminizi giriniz.');
      return;
    }
    if (!messageText.trim()) {
      setErrorMsg('Dileklerinizi yazabileceğiniz bir tebrik mesajı giriniz.');
      return;
    }

    const newMessage: GuestMessage = {
      id: 'msg-' + Date.now(),
      senderName: senderName.trim(),
      message: messageText.trim(),
      createdAt: new Date().toISOString(),
    };

    onAddMessage(newMessage);
    setSenderName('');
    setMessageText('');
    setSuccess(true);

    // Reset success animation block after 3s
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto w-full px-4">
      {/* Messages List Area (Left 7 Cols on desktop) */}
      <div className="lg:col-span-7 space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-stone-600" />
          <h4 className="font-serif text-lg text-stone-800 font-medium">Güzel Dilekler ({messages.length})</h4>
        </div>

        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <div className="text-center py-10 glass-panel rounded-2xl border border-dashed border-stone-300">
              <Smile className="w-8 h-8 mx-auto text-stone-400 mb-2" />
              <p className="text-sm text-stone-500 font-serif">Henüz mesaj yazılmamış. İlk dileği yazan siz olun!</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="relative glass-panel p-5 rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Vintage Scroll Ornament Accents */}
                <div className="absolute top-2 right-4 text-stone-500/10 font-serif text-3xl select-none">”</div>
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-serif font-medium text-sm text-stone-800 tracking-wide">
                    {msg.senderName}
                  </h5>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(msg.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-stone-600 text-sm italic font-light leading-relaxed font-sans">
                  "{msg.message}"
                </p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Leave Message Form Area (Right 5 Cols on desktop) */}
      <div className="lg:col-span-5">
        <div className="relative glass-panel p-6 sm:p-7 rounded-[32px] shadow-2xl">
          {/* Decorative Corner Borders */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-stone-400/50" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-stone-400/50" />

          <div className="flex items-center gap-2 mb-4">
            <Feather className="w-5 h-5 text-stone-600" />
            <h4 className="font-serif text-lg text-stone-800 font-medium">Anı Defterine Yazın</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sender Name */}
            <div>
              <label htmlFor="guestbook-name" className="block text-[10px] font-bold tracking-widest uppercase text-stone-600 mb-1">
                İsminiz
              </label>
              <input
                id="guestbook-name"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Örn: Ayşe & Can Güler"
                className="w-full px-4 py-2.5 bg-white/30 border border-white/50 focus:border-stone-400 focus:bg-white/80 rounded-xl outline-none text-stone-800 text-sm transition-all duration-300 shadow-inner"
              />
            </div>

            {/* Message Body */}
            <div>
              <label htmlFor="guestbook-message" className="block text-[10px] font-bold tracking-widest uppercase text-stone-600 mb-1">
                Mesajınız / Tebrikiniz
              </label>
              <textarea
                id="guestbook-message"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Bir ömür boyu mutluluk dileklerinizi buraya yazabilirsiniz..."
                rows={5}
                className="w-full px-4 py-3 bg-white/30 border border-white/50 focus:border-stone-400 focus:bg-white/80 rounded-xl outline-none text-stone-800 text-sm tracking-wide transition-all duration-300 resize-none font-sans shadow-inner"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-700 bg-rose-50/50 py-1.5 px-3 rounded-lg border border-rose-150">
                ⚠️ {errorMsg}
              </p>
            )}

            <AnimatePresence>
              {success && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold text-stone-700 bg-stone-50/70 py-1.5 px-3 rounded-lg border border-stone-200"
                >
                  ✨ Tebrik mesajınız anı defterine eklendi!
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              id="guestbook-submit"
              className="w-full py-3.5 bg-stone-800 hover:bg-stone-900 text-white font-serif rounded-xl tracking-widest text-xs uppercase font-medium shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-white" />
              Tebrik Gönder
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
