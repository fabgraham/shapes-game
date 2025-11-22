// Sound Manager using Howler.js
export class SoundManager {
  constructor() {
    this.sounds = {};
    this.musicVolume = 0.6;
    this.sfxVolume = 0.8;
    this.isMuted = false;
    this.isLoaded = false;
    this.encouragements = ['Great job!', 'You did it!', 'Awesome!', 'Yay!', 'Perfect!', 'Amazing!'];
  }

  async init() {
    // Check if Howler is available
    if (typeof Howl === 'undefined') {
      console.warn('Howler.js not loaded, using fallback audio');
      this.isLoaded = true;
      return;
    }

    try {
      // For now, we'll use Web Audio API to generate simple tones
      // In production, you would load actual audio files
      this.createFallbackSounds();
      this.isLoaded = true;
      console.log('Sound system initialized');
    } catch (error) {
      console.error('Failed to initialize sound system:', error);
      this.isLoaded = true; // Continue without sound
    }
  }

  createFallbackSounds() {
    // Create AudioContext for simple tone generation
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      return;
    }
  }

  playTone(frequency, duration, volume = 0.3) {
    if (this.isMuted || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(volume * this.sfxVolume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Error playing tone:', e);
    }
  }

  playPickup() {
    // Cute "boop" sound
    this.playTone(800, 0.1, 0.3);
  }

  playBounce() {
    // Playful bounce sound
    const frequency = 200 + Math.random() * 200;
    this.playTone(frequency, 0.15, 0.2);
  }

  playSuccess() {
    if (this.isMuted) return;

    // Victory jingle - ascending tones
    const notes = [523.25, 659.25, 783.99]; // C, E, G
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 0.4);
      }, i * 100);
    });

    // Play random encouragement
    this.playEncouragement();
  }

  playEncouragement() {
    // In a real implementation, this would play a voice file
    // For now, we'll log it (could trigger a visual text animation)
    const message = this.encouragements[Math.floor(Math.random() * this.encouragements.length)];
    console.log('🎉', message);

    // Dispatch custom event for UI to show encouragement text
    window.dispatchEvent(new CustomEvent('showEncouragement', { detail: { message } }));
  }

  playChomp() {
    // Eating sound - quick down sweep
    if (this.isMuted || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.15);

      gainNode.gain.setValueAtTime(0.3 * this.sfxVolume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.15);
    } catch (e) {
      console.warn('Error playing chomp:', e);
    }
  }

  playButtonClick() {
    // UI button click
    this.playTone(600, 0.08, 0.25);
  }

  playDragStart() {
    this.playPickup();
  }

  playDrop() {
    this.playTone(400, 0.12, 0.25);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
}
