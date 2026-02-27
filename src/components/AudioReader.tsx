import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { motion } from 'motion/react';

interface AudioReaderProps {
  text: string;
  title?: string;
}

// Função para criar um Blob WAV a partir de dados PCM puros
const createWavBlob = (pcmData: Uint8Array, sampleRate: number = 24000): Blob => {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // "RIFF"
  // file length
  view.setUint32(4, 36 + pcmData.length, true);
  // RIFF type
  view.setUint32(8, 0x57415645, false); // "WAVE"
  // format chunk identifier
  view.setUint32(12, 0x666d7420, false); // "fmt "
  // format chunk length
  view.setUint16(16, 16, true);
  // sample format (1 = PCM)
  view.setUint16(20, 1, true);
  // channel count (1 = Mono)
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  view.setUint32(36, 0x64617461, false); // "data"
  // data chunk length
  view.setUint32(40, pcmData.length, true);

  return new Blob([header, pcmData], { type: 'audio/wav' });
};

export const AudioReader: React.FC<AudioReaderProps> = ({ text, title }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [chunks, setChunks] = useState<string[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isStopping, setIsStopping] = useState(false);

  // Parar o áudio quando o componente for desmontado
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playChunk = async (index: number, textChunks: string[]) => {
    if (index >= textChunks.length || isStopping) {
      setStatus('idle');
      setCurrentChunkIndex(0);
      return;
    }

    setCurrentChunkIndex(index);
    setStatus('playing');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Narração profissional: ${textChunks[index]}` }] }],
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
        const byteCharacters = atob(base64Audio);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const audioBlob = createWavBlob(byteArray, 24000);
        const url = URL.createObjectURL(audioBlob);
        
        const audio = new Audio(url);
        audioRef.current = audio;
        
        audio.onended = () => {
          URL.revokeObjectURL(url);
          playChunk(index + 1, textChunks);
        };

        await audio.play();
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Erro ao tocar chunk:', error);
        setStatus('idle');
      }
    }
  };

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

    // Iniciar nova narração
    setIsStopping(false);
    setStatus('loading');

    // Limpeza e divisão do texto em chunks menores (aprox 500 caracteres ou por parágrafo)
    const cleanText = text
      .replace(/#+\s/g, '')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`{1,3}.*?`{1,3}/gs, '')
      .replace(/>\s/g, '');

    // Divide por parágrafos e filtra vazios
    const textChunks = cleanText
      .split(/\n\n|\n/)
      .map(c => c.trim())
      .filter(c => c.length > 5);

    if (textChunks.length === 0) {
      setStatus('idle');
      return;
    }

    setChunks(textChunks);
    playChunk(0, textChunks);
  };

  const handleStop = () => {
    setIsStopping(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setStatus('idle');
    setCurrentChunkIndex(0);
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

      {status !== 'idle' && (
        <button
          onClick={handleStop}
          className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
          title="Parar narração"
        >
          <RotateCcw size={18} />
        </button>
      )}

      <div className="flex-1">
        <p className="font-bold text-dark flex items-center gap-2 text-sm md:text-base">
          <Volume2 size={18} className="text-primary" />
          {status === 'playing' ? `Ouvindo parte ${currentChunkIndex + 1} de ${chunks.length}` : status === 'loading' ? 'Preparando áudio...' : 'Ouvir este conteúdo'}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">
            Acessibilidade • Narração por IA
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
      {status === 'idle' && (
        <div className="hidden md:flex items-center gap-1 text-gray-400 text-[10px]">
          <AlertCircle size={12} />
          <span>Beta</span>
        </div>
      )}
    </motion.div>
  );
};
