import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface CountdownProps {
  targetDateStr: string; // e.g. '2026-09-19T19:30:00'
}

export default function ReusableCountdown({ targetDateStr }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const targetDate = new Date(targetDateStr).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    updateTimer(); // run once immediately
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [targetDateStr]);

  const items = [
    { label: 'GÜN', value: timeLeft.days },
    { label: 'SAAT', value: timeLeft.hours },
    { label: 'DAKİKA', value: timeLeft.minutes },
    { label: 'SANİYE', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full py-6">
      {timeLeft.isOver ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-2xl font-serif text-amber-800 tracking-wide text-center"
        >
          ✨ O Büyük Gün Geldi Çattı! ✨
        </motion.div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-6 max-w-2xl w-full px-2">
          {items.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="relative flex flex-col items-center justify-center glass-panel rounded-[24px] p-3 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Luxury Accent Corner Lines */}
              <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-stone-400/50 rounded-tl-sm" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-stone-400/50 rounded-tr-sm" />
              <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-stone-400/50 rounded-bl-sm" />
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-stone-400/50 rounded-br-sm" />

              <span className="font-serif text-2xl sm:text-4xl font-light text-stone-800 tracking-tight select-none">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-xs font-semibold text-stone-500 tracking-widest mt-1 sm:mt-2">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
