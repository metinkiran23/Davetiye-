import { motion } from 'motion/react';
import { GlassWater, Heart, Music, Sparkles, Cake, Clock } from 'lucide-react';
import { ProgramEvent } from '../types';

interface TimelineProps {
  events: ProgramEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  // Mapper to map strings to Lucide elements
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GlassWater':
        return <GlassWater className="w-5 h-5 text-stone-600" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-stone-600 fill-stone-600/15" />;
      case 'Music':
        return <Music className="w-5 h-5 text-stone-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-stone-600" />;
      case 'Cake':
        return <Cake className="w-5 h-5 text-stone-600" />;
      default:
        return <Clock className="w-5 h-5 text-stone-600" />;
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto w-full px-4 py-4">
      {/* Center line for vertical timeline on large displays */}
      <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-px bg-stone-300/40" />

      <div className="space-y-8 md:space-y-12">
        {events.map((event, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex flex-col md:flex-row items-start ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline bubble node with custom styling */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full glass-inset shadow-md flex items-center justify-center">
                {getIcon(event.icon)}
              </div>

              {/* Event Content card */}
              <div className="w-full md:w-5/12 pl-14 md:pl-0 md:px-6">
                <div className="glass-panel p-5 rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-300 relative">
                  {/* Small pointer box for large screens */}
                  <div
                    className={`hidden md:block absolute top-6 w-3 h-3 bg-white/40 border-b border-l border-white/60 transform rotate-45 ${
                      isEven ? '-left-1.5' : '-right-1.5 rotate-225'
                    }`}
                  />

                  {/* Time label */}
                  <span className="inline-flex items-center gap-1 glass-inset text-stone-700 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full mb-2">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </span>

                  <h4 className="font-serif font-medium text-base text-stone-800 tracking-wide mb-1">
                    {event.title}
                  </h4>
                  <p className="text-stone-500 text-xs sm:text-sm font-light leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Empty placeholder spacer for alignment on large viewports */}
              <div className="hidden md:block w-5/12" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
