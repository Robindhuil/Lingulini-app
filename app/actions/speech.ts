"use server";

export async function speakText(text: string, language: string = "en") {
  try {
    // Map language codes to eSpeak NG voice codes
    const voiceMap: Record<string, string> = {
      sk: "sk", // Slovak
      en: "en",
      es: "es",
      fr: "fr",
      de: "de",
      it: "it",
      pt: "pt",
      ja: "ja",
      zh: "zh",
      ko: "ko",
      ru: "ru",
      ar: "ar",
      hi: "hi",
    };

    const voice = voiceMap[language] || "sk"; // Default to Slovak

    // For server-side, we'll return the text and voice
    // The actual speech will be handled on the client side
    return {
      success: true,
      text,
      voice,
    };
  } catch (error) {
    console.error("Failed to prepare speech:", error);
    return { success: false, error: "Failed to prepare speech" };
  }
}
