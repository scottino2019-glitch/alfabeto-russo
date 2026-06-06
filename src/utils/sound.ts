// Sound Synthesis Utility with Web Audio API for interactive gamification feedback.

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Friendly 8-bit double beep
    osc.type = 'sine';
    const now = ctx.currentTime;
    
    // First high tone
    osc.frequency.setValueAtTime(523.25, now); // C5
    // Second higher tone
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    
    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) {
    // Ignore context or browser block errors
    console.warn("Audio feedback block:", e);
  }
}

export function playErrorSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Sadder low sliding sound
    osc.type = 'triangle';
    const now = ctx.currentTime;
    
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
    
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
    console.warn("Audio feedback block:", e);
  }
}

export function playRewardSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Arpeggio sound for levelling up or completing quiz
    osc.type = 'sine';
    const now = ctx.currentTime;
    
    osc.frequency.setValueAtTime(261.63, now); // C4
    osc.frequency.setValueAtTime(329.63, now + 0.08); // E4
    osc.frequency.setValueAtTime(392.00, now + 0.16); // G4
    osc.frequency.setValueAtTime(523.25, now + 0.24); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.32); // E5
    
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.start(now);
    osc.stop(now + 0.6);
  } catch (e) {
    console.warn("Audio feedback block:", e);
  }
}
