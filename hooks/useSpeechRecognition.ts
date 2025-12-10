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

export const useSpeechRecognition = (
  correctAnswer: string,
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
      
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        setSpokenText("");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        setSpokenText(transcript);
        console.log("Heard:", transcript);
        
        // Check if spoken text matches correct answer
        const answer = correctAnswer.toLowerCase().trim();
        const isCorrect = transcript === answer || 
                         transcript.includes(answer) ||
                         answer.includes(transcript);
        
        if (isCorrect) {
          playSuccessSound();
          callbacksRef.current?.onSuccess?.();
        } else if (transcript.length > 0) {
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
  }, [correctAnswer]);

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
