"use server";

import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

const execAsync = promisify(exec);

export async function generateSpeech(text: string, languageCode: string) {
  try {
    // Generate a unique filename
    const filename = `tts-${randomBytes(16).toString("hex")}.wav`;
    const filepath = join("/tmp", filename);

    // Use espeak-ng to generate speech
    // -v specifies voice/language, -w writes to file, -s sets speed
    const command = `espeak-ng -v ${languageCode} -w "${filepath}" -s 150 "${text.replace(/"/g, '\\"')}"`;
    
    await execAsync(command);

    // Read the file as base64
    const { readFile } = await import("fs/promises");
    const audioBuffer = await readFile(filepath);
    const base64Audio = audioBuffer.toString("base64");

    // Clean up the temporary file
    await unlink(filepath);

    return {
      success: true,
      audio: base64Audio,
      mimeType: "audio/wav",
    };
  } catch (error) {
    console.error("TTS generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
