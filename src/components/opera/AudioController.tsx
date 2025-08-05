"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface AudioControllerProps {
  paragraphId: string;
  operaSlug: string;
  text: string;
  onProgress: (wordIndex: number) => void;
  onPlayStateChange: (isPlaying: boolean) => void;
  isPlaying: boolean;
}

export default function AudioController({
  paragraphId,
  operaSlug: _operaSlug,
  text,
  onProgress,
  onPlayStateChange,
  isPlaying
}: AudioControllerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [useWebSpeech, setUseWebSpeech] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Generate or fetch audio
  const generateAudio = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call TTS API to generate audio
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          paragraphId,
          operaSlug: _operaSlug,
          voice: 'onyx', // Deep and authoritative voice
          speed: playbackSpeed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('audio')) {
        // We got audio data back
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setUseWebSpeech(false);
        console.log('Audio generated successfully using OpenAI TTS');
      } else {
        // API returned fallback instructions
        const fallbackData = await response.json();
        if (fallbackData.useWebSpeech) {
          console.log('Falling back to Web Speech API:', fallbackData.message);
          setUseWebSpeech(true);
          setDuration(estimateDuration(text));
        }
      }
      
    } catch (err) {
      console.error("Audio generation error:", err);
      setError("Failed to generate audio. Falling back to browser speech.");
      // Fallback to Web Speech API
      setUseWebSpeech(true);
      setDuration(estimateDuration(text));
    } finally {
      setIsLoading(false);
    }
  };

  // Estimate duration for Web Speech API
  const estimateDuration = (text: string): number => {
    // Rough estimate: 150 words per minute average speaking rate
    const words = text.split(' ').length;
    return (words / 150) * 60;
  };

  // Handle play/pause
  const togglePlayback = async () => {
    if (!audioUrl && !useWebSpeech) {
      await generateAudio();
      return;
    }

    if (isPlaying) {
      // Stop playback
      if (useWebSpeech && speechSynthRef.current) {
        window.speechSynthesis.cancel();
        onPlayStateChange(false);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      } else if (audioRef.current) {
        audioRef.current.pause();
        onPlayStateChange(false);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      }
    } else {
      // Start playback
      try {
        if (useWebSpeech) {
          await playWithWebSpeech();
        } else if (audioRef.current) {
          await audioRef.current.play();
          onPlayStateChange(true);
          startProgressTracking();
        }
      } catch (err) {
        setError("Failed to play audio");
        console.error("Playback error:", err);
      }
    }
  };

  // Play using Web Speech API
  const playWithWebSpeech = async () => {
    if (!window.speechSynthesis) {
      setError("Speech synthesis not supported in this browser");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthRef.current = utterance;

    // Try to find a British English voice
    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(voice => 
      voice.lang === 'en-GB' || 
      voice.name.toLowerCase().includes('british') ||
      voice.name.toLowerCase().includes('uk')
    );

    if (britishVoice) {
      utterance.voice = britishVoice;
    } else {
      // Fallback to any English voice
      const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      onPlayStateChange(true);
      startWebSpeechProgress();
    };

    utterance.onend = () => {
      onPlayStateChange(false);
      onProgress(-1);
      setCurrentTime(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };

    utterance.onerror = (event) => {
      setError(`Speech synthesis error: ${event.error}`);
      onPlayStateChange(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Progress tracking for Web Speech API
  const startWebSpeechProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        return;
      }

      const elapsed = (Date.now() - startTime) / 1000;
      setCurrentTime(elapsed);

      // Estimate word progress
      const words = text.split(' ');
      const progress = Math.min(elapsed / duration, 1);
      const wordIndex = Math.floor(progress * words.length);
      onProgress(Math.min(wordIndex, words.length - 1));
    }, 100);
  };

  // Track progress and sync with text highlighting
  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current) {
        const current = audioRef.current.currentTime;
        setCurrentTime(current);

        // Estimate word index based on progress
        // In real implementation, this would use precise word timings from TTS
        const words = text.split(' ');
        const progress = current / duration;
        const wordIndex = Math.floor(progress * words.length);
        onProgress(Math.min(wordIndex, words.length - 1));
      }
    }, 100);
  };

  // Handle audio metadata loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle audio ended
  const handleAudioEnded = () => {
    onPlayStateChange(false);
    onProgress(-1);
    setCurrentTime(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  // Handle speed change
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    if (useWebSpeech && speechSynthRef.current) {
      // For Web Speech API, we need to restart with new rate
      if (isPlaying) {
        window.speechSynthesis.cancel();
        // Small delay to let cancel complete
        setTimeout(() => {
          playWithWebSpeech();
        }, 100);
      }
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      // Clean up object URL to prevent memory leaks
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
      // Cancel any ongoing speech synthesis
      if (useWebSpeech) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioUrl, useWebSpeech]);

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
          preload="metadata"
        />
      )}

      {/* Main Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <motion.button
          onClick={togglePlayback}
          disabled={isLoading}
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full",
            "bg-imperial-red text-white shadow-md",
            "hover:bg-imperial-red/90 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>

        {/* Progress Section */}
        <div className="flex-1">
          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-imperial-red to-imperial-gold"
              initial={{ width: "0%" }}
              animate={{ 
                width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" 
              }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Time Display */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Speed:</span>
          <select
            value={playbackSpeed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Hint Text */}
      {!audioUrl && !useWebSpeech && !isLoading && !error && (
        <motion.p
          className="mt-3 text-sm text-gray-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Click play to generate audio narration
        </motion.p>
      )}

      {/* Web Speech API Indicator */}
      {useWebSpeech && !isLoading && (
        <motion.p
          className="mt-3 text-sm text-blue-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Using browser speech synthesis - British accent when available
        </motion.p>
      )}
    </motion.div>
  );
}