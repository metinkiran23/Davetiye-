import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sequencerTimeoutRef = useRef<number | null>(null);
  const synthNodesRef = useRef<AudioNode[]>([]);

  // Simple ambient chord progression (Canon in D / Wedding Chords structure)
  // Roots: D, A, Bm, F#m, G, D, G, A
  // We'll use F major as a soft, safe, pleasant register for Web Audio
  // F (F3, A3, C4) -> C (C3, E3, G3) -> Dm (D3, F3, A3) -> Am (A2, C3, E3) -> Bb (Bb2, D3, F3) -> F (F2, A3, C4) -> Bb (Bb2, D3, F3) -> C (C3, E3, G3)
  const progression = [
    { chords: [57, 60, 65, 69], root: 41 }, // F major chords (A3, C4, F4, A4)
    { chords: [60, 64, 67, 72], root: 48 }, // C major
    { chords: [57, 62, 65, 69], root: 45 }, // D minor
    { chords: [57, 60, 64, 69], root: 40 }, // A minor
    { chords: [58, 62, 65, 70], root: 46 }, // Bb major
    { chords: [57, 60, 65, 69], root: 41 }, // F major
    { chords: [58, 62, 65, 70], root: 46 }, // Bb major
    { chords: [60, 64, 67, 72], root: 48 }  // C major
  ];

  const mtof = (note: number) => {
    return 440 * Math.pow(2, (note - 69) / 12);
  };

  const playSynthesizerNote = (ctx: AudioContext, note: number, startTime: number, duration: number, volume: number) => {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Use triangles & sines for beautiful warm harp-like bells
    osc.type = note % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(mtof(note), startTime);

    // Filter to make the notes velvety and soft
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, startTime);
    filter.frequency.exponentialRampToValueAtTime(300, startTime + duration);

    // ADSR Envelope
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    synthNodesRef.current.push(osc, gain, filter);

    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const startAmbientLoop = () => {
    // Initialize standard AudioContext safely
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    let chordIdx = 0;
    let nextNoteTime = ctx.currentTime + 0.1;

    const scheduleTimeline = () => {
      if (!isPlaying && audioCtxRef.current?.state !== 'running') return;

      const currentChord = progression[chordIdx];
      
      // Play a beautiful deep bass root note (slow & warm)
      playSynthesizerNote(ctx, currentChord.root, nextNoteTime, 3.6, 0.4);

      // Programmatically arpeggiate 4 notes from the chord to sound like a gentle acoustic harp
      const notes = [...currentChord.chords].sort(() => Math.random() - 0.5);
      notes.forEach((midiNote, idx) => {
        const arpeggioDelay = idx * 0.45; // 450ms gap between arpeggio strings
        playSynthesizerNote(ctx, midiNote, nextNoteTime + arpeggioDelay, 2.5, 0.2);
        
        // Add random twinkling high bells occasionally (magic starry sparkle)
        if (Math.random() > 0.6) {
          playSynthesizerNote(ctx, midiNote + 12, nextNoteTime + arpeggioDelay + 0.2, 1.5, 0.1);
        }
      });

      // Advance chord index
      chordIdx = (chordIdx + 1) % progression.length;

      // Loop after 3.8 seconds
      const tempoDelay = 3800;
      nextNoteTime += 3.8;
      sequencerTimeoutRef.current = window.setTimeout(scheduleTimeline, tempoDelay);
    };

    scheduleTimeline();
  };

  const stopAmbientLoop = () => {
    if (sequencerTimeoutRef.current) {
      clearTimeout(sequencerTimeoutRef.current);
      sequencerTimeoutRef.current = null;
    }
    // Clean up active synth nodes
    synthNodesRef.current.forEach(node => {
      try {
        if ('stop' in node) {
          (node as any).stop();
        }
      } catch (e) {
        // ignore
      }
    });
    synthNodesRef.current = [];
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopAmbientLoop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startAmbientLoop();
    } else {
      stopAmbientLoop();
    }
    return () => stopAmbientLoop();
  }, [isPlaying]);

  // Handle click on body as a trigger for starting music optionally
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      // Auto play once user interacts if they haven't explicitly turned it off
      if (!isPlaying) {
        setIsPlaying(true);
      }
      document.removeEventListener('click', handleFirstUserInteraction);
    };
    document.addEventListener('click', handleFirstUserInteraction);
    return () => document.removeEventListener('click', handleFirstUserInteraction);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="hidden md:flex bg-white/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-100 shadow-sm items-center gap-2 text-xs text-amber-800"
          >
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
            <span className="font-medium tracking-wide">Piyano Çalıyor...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        id="wedding-music-toggle"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMusic}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-md border cursor-pointer focus:outline-none transition-colors duration-300 ${
          isPlaying
            ? 'bg-amber-50 border-amber-200 text-amber-700'
            : 'bg-white border-neutral-150 text-neutral-500'
        }`}
      >
        {/* Vinyl outer disc ring */}
        <div className={`absolute inset-0.5 rounded-full border border-dashed border-amber-900/10 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />

        {isPlaying ? (
          <div className="relative">
            <Volume2 className="w-6 h-6 animate-pulse" />
            <Music className="w-3 h-3 absolute -top-1.5 -right-1.5 text-amber-500 animate-bounce" />
          </div>
        ) : (
          <VolumeX className="w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
}
