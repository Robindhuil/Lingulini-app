"use server";

import { exec } from "child_process";
import { promisify } from "util";
import { unlink, readFile } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

const execAsync = promisify(exec);

// Map language codes to best TLD for voice variety
// Different TLDs (com, co.uk, com.au, etc.) sometimes have different voice variants
const getTLD = (languageCode: string): string => {
  const tldMap: Record<string, string> = {
    sk: "com", // Slovak - use .com (standard Google voice)
    en: "com", // English - US voice
    es: "es", // Spanish - Spain accent
    de: "de", // German - Germany accent
    fr: "fr", // French - France accent
    it: "it", // Italian - Italy accent
    pt: "pt", // Portuguese - Portugal accent
    ru: "com", // Russian
    pl: "pl", // Polish
    cs: "cz", // Czech
    nl: "nl", // Dutch
  };
  return tldMap[languageCode] || "com";
};

export async function generateSpeech(text: string, languageCode: string) {
  try {
    const filename = `tts-${randomBytes(16).toString("hex")}.mp3`;
    const filepath = join("/tmp", filename);
    const tld = getTLD(languageCode);

    // Use gTTS with specific TLD for accent variation
    // Remove --slow for more natural, conversational speed
    const command = `gtts-cli "${text.replace(/"/g, '\\"')}" --lang ${languageCode} --tld ${tld} --output "${filepath}"`;
    
    await execAsync(command, { timeout: 10000 });

    const audioBuffer = await readFile(filepath);
    const base64Audio = audioBuffer.toString("base64");

    await unlink(filepath);

    return {
      success: true,
      audio: base64Audio,
      mimeType: "audio/mp3",
    };
  } catch (error) {
    console.error("gTTS error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
