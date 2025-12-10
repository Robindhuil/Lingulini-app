/**
 * Celebration sound effects utility
 * Plays different sounds based on quiz performance
 */

// Web Audio API based sound generation
function playTone(frequency: number, duration: number, volume: number = 0.3): Promise<void> {
  return new Promise((resolve) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.value = volume;
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    setTimeout(() => {
      audioContext.close();
      resolve();
    }, duration * 1000);
  });
}

// Perfect score celebration (100%)
export async function playPerfectSound() {
  // Triumphant ascending melody
  await playTone(523.25, 0.15, 0.3); // C5
  await new Promise(resolve => setTimeout(resolve, 50));
  await playTone(659.25, 0.15, 0.3); // E5
  await new Promise(resolve => setTimeout(resolve, 50));
  await playTone(783.99, 0.15, 0.3); // G5
  await new Promise(resolve => setTimeout(resolve, 50));
  await playTone(1046.50, 0.3, 0.35); // C6 (longer and louder)
}

// Great score celebration (over 50%)
export async function playGreatSound() {
  // Cheerful two-tone melody
  await playTone(523.25, 0.2, 0.3); // C5
  await new Promise(resolve => setTimeout(resolve, 80));
  await playTone(659.25, 0.25, 0.3); // E5
}

// Encouraging sound (50% or less)
export async function playEncouragingSound() {
  // Simple positive tone
  await playTone(440.00, 0.3, 0.25); // A4
}

/**
 * Play appropriate celebration sound based on score percentage
 */
export function playCelebrationSound(percentage: number) {
  try {
    if (percentage === 100) {
      playPerfectSound();
    } else if (percentage > 50) {
      playGreatSound();
    } else {
      playEncouragingSound();
    }
  } catch (error) {
    // Silently fail if audio context is not available
    console.warn('Could not play celebration sound:', error);
  }
}
