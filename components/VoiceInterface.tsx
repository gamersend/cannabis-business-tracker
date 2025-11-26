'use client';

import { useState, useRef, useEffect } from 'react';

interface VoiceInterfaceProps {
  onSpeechResult: (text: string) => void;
  isListening?: boolean;
}

export function VoiceInterface({ onSpeechResult, isListening = false }: VoiceInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        
        const recognition = recognitionRef.current;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsRecording(true);
          setTranscript('');
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscript || interimTranscript);
          
          if (finalTranscript) {
            onSpeechResult(finalTranscript);
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };
      }
    }
  }, [onSpeechResult]);

  const startListening = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
        <p className="text-yellow-200 text-sm">
          🎤 Voice recognition not supported in this browser
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center">
          🎤 Voice Input
        </h3>
        <button
          onClick={isRecording ? stopListening : startListening}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isRecording ? '🛑 Stop' : '🎤 Start'}
        </button>
      </div>

      {isRecording && (
        <div className="mb-3">
          <div className="flex items-center space-x-2 text-green-300">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Listening...</span>
          </div>
        </div>
      )}

      {transcript && (
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-green-200 text-sm mb-1">Transcript:</p>
          <p className="text-white">{transcript}</p>
        </div>
      )}

      <div className="mt-3 text-xs text-green-200">
        💡 Try saying: "Sold one ounce of cookies to Jay for 325 dollars"
      </div>
    </div>
  );
}

// Audio playback component for TTS
export function AudioPlayer({ audioUrl, autoPlay = false }: { audioUrl?: string; autoPlay?: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioUrl && autoPlay && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl, autoPlay]);

  const playAudio = async (text: string, type: string = 'general', data?: any) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type, data })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      />
      
      {isPlaying && (
        <div className="flex items-center space-x-1 text-green-300">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <span className="text-sm ml-2">🔊 Playing...</span>
        </div>
      )}
    </div>
  );
}
