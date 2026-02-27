import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { motion } from 'motion/react';

interface AudioReaderProps {
  text: string;
  title?: string;
}

export const AudioReader: React.FC<AudioReaderProps> = ({ text, title }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleToggle = async () => {
    if (status === 'playing') {
      audioRef.current?.pause();
      setStatus('paused');
      return;
    }

    if (status === 'paused') {
      audioRef.current?.play();
      setStatus('playing');
      return;
    }

    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setStatus('playing');
      return;
    }

    // Gerar áudio via Gemini TTS
    setStatus('loading');
    try {
      // Tenta obter a chave de várias fontes possíveis em ambiente Vite/React
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY || '';
      
      if (!apiKey) {
        console.warn('Gemini API Key não encontrada. Verifique as variáveis de ambiente.');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Limpeza de Markdown para leitura fluida
      const cleanText = text
        .replace(/#+\s/g, '') // Remove headers
        .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove negrito
        .replace(/(\*|_)(.*?)\1/g, '$2') // Remove itálico
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Mantém apenas o texto de links
        .replace(/`{1,3}.*?`{1,3}/gs, '') // Remove blocos de código
        .replace(/>\s/g, '') // Remove blockquotes
        .substring(0, 3000); // Limite seguro para narração fluida

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Narração profissional em português brasileiro: ${title ? title + '. ' : ''} ${cleanText}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (base64Audio) {
        const audioBlob = await fetch(`data:audio/mp3;base64,${base64Audio}`).then(res => res.blob());
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setStatus('idle');
        audio.play().catch(e => {
          console.error('Erro ao dar play no áudio:', e);
          setStatus('idle');
        });
        setStatus('playing');
      } else {
        throw new Error('API não retornou dados de áudio');
      }
    } catch (error) {
      console.error('Erro detalhado no AudioReader:', error);
      setStatus('idle');
      alert('Não foi possível gerar a narração agora. Verifique se a chave da API está configurada corretamente.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-8"
    >
      <button
        onClick={handleToggle}
        disabled={status === 'loading'}
        className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full hover:scale-105 transition-transform disabled:opacity-50 shadow-lg"
        aria-label={status === 'playing' ? 'Pausar leitura' : 'Ouvir este conteúdo'}
      >
        {status === 'loading' ? (
          <Loader2 className="animate-spin" size={24} />
        ) : status === 'playing' ? (
          <Pause size={24} />
        ) : (
          <Play size={24} className="ml-1" />
        )}
      </button>
      <div className="flex-1">
        <p className="font-bold text-dark flex items-center gap-2 text-sm md:text-base">
          <Volume2 size={18} className="text-primary" />
          {status === 'playing' ? 'Ouvindo conteúdo...' : status === 'loading' ? 'Preparando áudio...' : 'Ouvir este conteúdo'}
        </p>
        <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">
          Acessibilidade • Narração por IA
        </p>
      </div>
      {status === 'idle' && !audioUrl && (
        <div className="hidden md:flex items-center gap-1 text-gray-400 text-[10px]">
          <AlertCircle size={12} />
          <span>Beta</span>
        </div>
      )}
    </motion.div>
  );
};
