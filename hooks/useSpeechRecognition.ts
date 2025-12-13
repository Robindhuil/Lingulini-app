/**
 * Speech recognition custom hook
 * Handles voice input for language learning
 */

import { useEffect, useRef, useState } from "react";
import { playSuccessSound, playFailSound } from "@/utils/soundEffects";

export interface SpeechRecognitionCallbacks {
  onSuccess?: () => void;
  onIncorrect?: () => void;
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching to handle minor variations
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Check if two words are phonetically similar (homophones or near-homophones)
 * This helps match words like "bin/been/ben", "board/bored", etc.
 */
function arePhoneticallyClose(transcript: string, correctAnswer: string): boolean {
  const t = transcript.toLowerCase().trim();
  const a = correctAnswer.toLowerCase().trim();
  
  // If strings are very short (1-2 chars), require exact match
  if (a.length <= 2) {
    return t === a;
  }
  
  // Calculate similarity threshold based on word length
  const maxDistance = Math.max(1, Math.floor(a.length * 0.25)); // Allow 25% variation
  const distance = levenshteinDistance(t, a);
  
  return distance <= maxDistance;
}

/**
 * Map language codes to speech recognition locale codes
 */
function getRecognitionLocale(languageCode: string): string {
  const localeMap: { [key: string]: string } = {
    'en': 'en-US',
    'es': 'es-ES',
    'sk': 'sk-SK',
    'cz': 'cs-CZ',
    'cs': 'cs-CZ',
    'ua': 'uk-UA',
    'uk': 'uk-UA',
    'de': 'de-DE',
    'fr': 'fr-FR',
    'it': 'it-IT',
    'pt': 'pt-PT',
    'pl': 'pl-PL',
    'ru': 'ru-RU',
    'ja': 'ja-JP',
    'zh': 'zh-CN',
    'ko': 'ko-KR',
    'ar': 'ar-SA',
    'nl': 'nl-NL',
    'sv': 'sv-SE',
    'da': 'da-DK',
    'no': 'nb-NO',
    'fi': 'fi-FI',
    'tr': 'tr-TR',
    'el': 'el-GR',
    'he': 'he-IL',
    'hi': 'hi-IN',
    'th': 'th-TH',
    'vi': 'vi-VN',
  };
  
  return localeMap[languageCode.toLowerCase()] || 'en-US';
}

export const useSpeechRecognition = (
  correctAnswer: string,
  targetLanguageCode: string,
  callbacks?: SpeechRecognitionCallbacks
) => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const recognitionRef = useRef<any>(null);
  const callbacksRef = useRef(callbacks);

  // Keep callbacks ref up to date
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      const recognitionLocale = getRecognitionLocale(targetLanguageCode);
      recognition.lang = recognitionLocale;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 5; // Increased to get more alternatives
      
      console.log(`Speech recognition configured for: ${recognitionLocale}`);
      
      // Add grammar hints to improve recognition accuracy for the expected word
      // This helps the speech recognition engine prioritize the correct word
      if ((window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList) {
        const SpeechGrammarList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
        const grammarList = new SpeechGrammarList();
        
        // Create JSGF grammar with the expected word
        // This gives the speech engine a hint about what we're expecting
        const grammar = `#JSGF V1.0; grammar vocabulary; public <word> = ${correctAnswer.toLowerCase()} ;`;
        grammarList.addFromString(grammar, 1); // Weight of 1 means it's a strong hint
        
        recognition.grammars = grammarList;
      }

      recognition.onstart = () => {
        setIsListening(true);
        setSpokenText("");
      };

      recognition.onresult = (event: any) => {
        const results = event.results[0];
        const answer = correctAnswer.toLowerCase().trim();
        
        // Check all alternative transcripts
        let bestMatch = "";
        let isCorrect = false;
        
        for (let i = 0; i < results.length; i++) {
          const transcript = results[i].transcript.toLowerCase().trim();
          const confidence = results[i].confidence;
          
          console.log(`Alternative ${i}: "${transcript}" (confidence: ${confidence})`);
          
          // Store the first (most confident) transcript for display
          if (i === 0) {
            bestMatch = transcript;
          }
          
          // Check for exact match
          if (transcript === answer) {
            isCorrect = true;
            bestMatch = transcript;
            break;
          }
          
          // Check if the answer is contained in the transcript or vice versa
          if (transcript.includes(answer) || answer.includes(transcript)) {
            isCorrect = true;
            bestMatch = transcript;
            break;
          }
          
          // Check for phonetic similarity (handles homophones)
          if (arePhoneticallyClose(transcript, answer)) {
            isCorrect = true;
            bestMatch = transcript;
            break;
          }
        }
        
        setSpokenText(bestMatch);
        console.log(`Expected: "${answer}", Best match: "${bestMatch}", Correct: ${isCorrect}`);
        
        if (isCorrect) {
          // Immediately stop recognition and update state to prevent flicker
          setIsListening(false);
          if (recognitionRef.current) {
            try {
              recognitionRef.current.abort(); // Use abort instead of stop for immediate termination
            } catch (error) {
              console.error("Error aborting recognition:", error);
            }
          }
          playSuccessSound();
          callbacksRef.current?.onSuccess?.();
        } else if (bestMatch.length > 0) {
          playFailSound();
          callbacksRef.current?.onIncorrect?.();
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [correctAnswer, targetLanguageCode]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const resetSpokenText = () => {
    setSpokenText("");
  };

  return {
    isListening,
    spokenText,
    startListening,
    stopListening,
    resetSpokenText,
    isAvailable: !!recognitionRef.current,
  };
};
