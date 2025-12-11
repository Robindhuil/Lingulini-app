"use server";

// Map language codes to Google Translate TTS language codes
const getGoogleTTSLang = (languageCode: string): string => {
  const langMap: Record<string, string> = {
    sk: "sk", // Slovak
    en: "en", // English
    es: "es", // Spanish
    de: "de", // German
    fr: "fr", // French
    it: "it", // Italian
    pt: "pt", // Portuguese
    ru: "ru", // Russian
    pl: "pl", // Polish
    cs: "cs", // Czech
    nl: "nl", // Dutch
    ja: "ja", // Japanese
    zh: "zh-CN", // Chinese
    ko: "ko", // Korean
  };
  return langMap[languageCode] || languageCode;
};

/**
 * Generate speech using Google Translate's TTS service
 * This is a free, serverless-friendly alternative that works on Vercel
 */
export async function generateSpeech(text: string, languageCode: string) {
  try {
    // Limit text length to avoid issues
    const maxLength = 200;
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) : text;
    
    const lang = getGoogleTTSLang(languageCode);
    
    // Use Google Translate's public TTS API
    // This is a documented feature of Google Translate that's widely used
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(truncatedText)}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    return {
      success: true,
      audio: base64Audio,
      mimeType: "audio/mpeg",
    };
  } catch (error) {
    console.error("TTS error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
