/**
 * Text-to-Speech utility functions
 * Handles browser TTS and server-side fallback
 */

import { generateSpeech } from "@/app/actions/tts";

/**
 * Map language codes to speech synthesis language codes
 */
export const getVoiceLang = (code: string): string => {
  const langMap: Record<string, string> = {
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
    pt: "pt-PT",
    ja: "ja-JP",
    zh: "zh-CN",
    ko: "ko-KR",
    ru: "ru-RU",
    ar: "ar-SA",
    hi: "hi-IN",
    sk: "sk-SK",
  };
  return langMap[code] || "sk-SK";
};

/**
 * Find a matching voice for the target language
 */
export const findMatchingVoice = (
  voices: SpeechSynthesisVoice[],
  languageCode: string
): SpeechSynthesisVoice | undefined => {
  const targetLang = getVoiceLang(languageCode);
  const targetCode = languageCode.toLowerCase();

  return voices.find(voice => {
    const voiceLang = voice.lang.toLowerCase();
    const voiceName = voice.name.toLowerCase();
    const targetFull = targetLang.toLowerCase();
    
    // Match by language code (sk, en, es, etc.)
    if (voiceLang.startsWith(targetCode)) return true;
    // Match by full locale (sk-SK, en-US, etc.)
    if (voiceLang === targetFull) return true;
    // Match by language name in voice name
    const langNames: Record<string, string[]> = {
      sk: ["slovak", "slovenský"],
      en: ["english"],
      es: ["spanish", "español"],
      de: ["german", "deutsch"],
      fr: ["french", "français"],
    };
    const nameVariants = langNames[targetCode] || [];
    if (nameVariants.some(name => voiceName.includes(name))) return true;
    
    return false;
  });
};

export interface TTSCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

/**
 * Speak text using browser TTS or server-side fallback
 */
export const speak = async (
  text: string,
  languageCode: string,
  callbacks?: TTSCallbacks,
  audioRef?: React.MutableRefObject<HTMLAudioElement | null>
): Promise<void> => {
  const { onStart, onEnd, onError } = callbacks || {};

  // First, try browser's Web Speech API
  if ("speechSynthesis" in window) {
    const voices = window.speechSynthesis.getVoices();
    const targetLang = getVoiceLang(languageCode);

    console.log(`🗣️ Attempting to speak in language: ${languageCode} (${targetLang})`);

    const matchingVoice = findMatchingVoice(voices, languageCode);

    // If browser has the voice, use it
    if (matchingVoice) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.voice = matchingVoice;

      console.log(`✅ Using browser voice: ${matchingVoice.name} (${matchingVoice.lang})`);

      utterance.onstart = () => onStart?.();
      utterance.onend = () => onEnd?.();
      utterance.onerror = (e) => {
        console.error("Speech error:", e);
        onError?.(e);
      };

      window.speechSynthesis.speak(utterance);
      return;
    }

    console.warn(`❌ No ${languageCode} voice found in browser`);
    console.warn(`Available voices:`, voices.map(v => `${v.name} (${v.lang})`));
  }

  // Fallback to server-side TTS
  console.log(`🔄 Falling back to server-side TTS for ${languageCode}`);
  
  try {
    onStart?.();
    const result = await generateSpeech(text, languageCode);
    
    if (result.success && result.audio) {
      // Create audio element and play
      const audio = new Audio(`data:${result.mimeType};base64,${result.audio}`);
      if (audioRef) {
        audioRef.current = audio;
      }
      
      audio.onended = () => {
        console.log(`✅ Audio playback completed`);
        onEnd?.();
      };
      
      audio.onerror = (event) => {
        console.error("Audio playback error:", event);
        console.error("Audio source length:", result.audio.length);
        console.error("Audio MIME type:", result.mimeType);
        onError?.(new Error("Audio playback failed - check browser console for details"));
      };
      
      console.log(`✅ Playing server-generated speech (${result.audio.length} bytes)`);
      await audio.play();
    } else {
      console.error("Failed to generate speech:", result.error);
      onError?.(new Error(result.error || "Failed to generate speech"));
    }
  } catch (error) {
    console.error("TTS fallback error:", error);
    onError?.(error);
  }
};
