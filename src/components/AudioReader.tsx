import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, RotateCcw, Square } from 'lucide-react';
import { motion } from 'motion/react';

interface AudioReaderProps {
  text: string;
  title?: string;
}

export const AudioReader: React.FC<AudioReaderProps> = ({ text }) => {
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const synth = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    synth.current = window.speechSynthesis;
    
    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);

  const getCleanText = (rawText: string) => {
    return rawText
      .replace(/#+\s/g, '')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`{1,3}.*?`{1,3}/gs, '')
      .replace(/>\s/g, '')
      .replace(/\n+/g, ' ')
      .trim();
  };

  const selectVoice = () => {
    if (!synth.current) return null;
    const voices = synth.current.getVoices();
    // Prefer pt-BR, then any pt, then default
    return voices.find(v => v.lang === 'pt-BR') || 
           voices.find(v => v.lang.startsWith('pt')) || 
           null;
  };

  const handlePlay = () => {
    if (!synth.current) return;

    // Se já estiver falando, não faz nada (segurança extra)
    if (synth.current.speaking && status === 'playing') return;

    // Se estiver pausado, resume
    if (status === 'paused') {
      synth.current.resume();
      setStatus('playing');
      return;
    }

    // Caso contrário, inicia do zero
    synth.current.cancel();

    const cleanText = getCleanText(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const voice = selectVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setStatus('idle');
    };

    utterance.onerror = () => {
      setStatus('idle');
    };

    utteranceRef.current = utterance;
    synth.current.speak(utterance);
    setStatus('playing');
  };

  const handlePause = () => {
    if (synth.current && synth.current.speaking) {
      synth.current.pause();
      setStatus('paused');
    }
  };

  const handleStop = () => {
    if (synth.current) {
      synth.current.cancel();
      setStatus('idle');
    }
  };

  const handleRestart = () => {
    handleStop();
    // Pequeno delay para garantir que o cancelamento foi processado
    setTimeout(() => {
      handlePlay();
    }, 50);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-8"
    >
      <div className="flex items-center gap-2">
        {status === 'idle' ? (
          <button
            onClick={handlePlay}
            className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full hover:scale-105 transition-transform shadow-lg"
            title="Ouvir este conteúdo"
          >
            <Play size={24} className="ml-1" />
          </button>
        ) : status === 'playing' ? (
          <button
            onClick={handlePause}
            className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full hover:scale-105 transition-transform shadow-lg"
            title="Pausar leitura"
          >
            <Pause size={24} />
          </button>
        ) : (
          <button
            onClick={handlePlay}
            className="w-12 h-12 flex items-center justify-center bg-emerald-500 text-white rounded-full hover:scale-105 transition-transform shadow-lg"
            title="Retomar leitura"
          >
            <Play size={24} className="ml-1" />
          </button>
        )}

        {status !== 'idle' && (
          <>
            <button
              onClick={handleStop}
              className="w-10 h-10 flex items-center justify-center bg-white text-gray-600 border border-gray-200 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
              title="Parar leitura"
            >
              <Square size={18} fill="currentColor" />
            </button>
            <button
              onClick={handleRestart}
              className="w-10 h-10 flex items-center justify-center bg-white text-gray-600 border border-gray-200 rounded-full hover:bg-primary/10 hover:text-primary transition-colors shadow-sm"
              title="Reiniciar do começo"
            >
              <RotateCcw size={18} />
            </button>
          </>
        )}
      </div>

      <div className="flex-1 text-center md:text-left">
        <p className="font-bold text-dark flex items-center justify-center md:justify-start gap-2 text-sm md:text-base">
          <Volume2 size={18} className="text-primary" />
          {status === 'playing' ? 'Lendo conteúdo...' : status === 'paused' ? 'Leitura pausada' : 'Ouvir este conteúdo'}
        </p>
        <div className="flex items-center justify-center md:justify-start gap-2">
          <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">
            Acessibilidade • Web Speech API
          </p>
          {status === 'playing' && (
            <div className="flex gap-0.5">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 4] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 bg-primary rounded-full"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
