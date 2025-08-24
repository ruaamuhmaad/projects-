// AudioManager.js - نظام إدارة الصوت
export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicVolume = 0.3;
        this.effectsVolume = 0.5;
        this.enabled = true;
        
        this.initializeAudio();
        this.createSounds();
    }

    initializeAudio() {
        try {
            // إنشاء AudioContext
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // إنشاء gain nodes للتحكم في الصوت
            this.musicGain = this.audioContext.createGain();
            this.effectsGain = this.audioContext.createGain();
            
            this.musicGain.connect(this.audioContext.destination);
            this.effectsGain.connect(this.audioContext.destination);
            
            this.musicGain.gain.value = this.musicVolume;
            this.effectsGain.gain.value = this.effectsVolume;
        } catch (error) {
            console.warn('Audio not supported:', error);
            this.enabled = false;
        }
    }

    createSounds() {
        if (!this.enabled) return;

       this.sounds.shoot = () => this.createTone(800, 0.1, 'square');
        
        this.sounds.enemyHit = () => this.createNoise(0.2, 'explosion');
        
        this.sounds.playerHit = () => this.createTone(200, 0.3, 'sawtooth');
        
        this.sounds.powerUp = () => this.createTone(1200, 0.2, 'sine', true);
        
        this.sounds.backgroundMusic = () => this.createBackgroundMusic();
        
        this.sounds.gameOver = () => this.createGameOverSound();
    }

    createTone(frequency, duration, waveType = 'sine', ascending = false) {
        if (!this.audioContext || !this.enabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.effectsGain);
        
        oscillator.type = waveType;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        if (ascending) {
            oscillator.frequency.exponentialRampToValueAtTime(
                frequency * 2, 
                this.audioContext.currentTime + duration
            );
        }
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    createNoise(duration, type = 'white') {
        if (!this.audioContext || !this.enabled) return;

        const bufferSize = this.audioContext.sampleRate * duration;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noiseSource = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        noiseSource.buffer = noiseBuffer;
        noiseSource.connect(gainNode);
        gainNode.connect(this.effectsGain);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        noiseSource.start(this.audioContext.currentTime);
    }

    createBackgroundMusic() {
        if (!this.audioContext || !this.enabled) return;

        const notes = [440, 554, 659, 880]; 
        let noteIndex = 0;
        
        const playNote = () => {
            if (!this.enabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.musicGain);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = notes[noteIndex];
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 1);
            
            noteIndex = (noteIndex + 1) % notes.length;
            
            setTimeout(playNote, 2000);
        };
        
        playNote();
    }

    createGameOverSound() {
        if (!this.audioContext || !this.enabled) return;

       
        const frequencies = [440, 415, 392, 370]; 
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, 0.5, 'sine');
            }, index * 200);
        });
    }


    playSound(soundName) {
        if (!this.enabled || !this.sounds[soundName]) return;
        
     
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.sounds[soundName]();
    }


    toggleSounds(enabled) {
        this.enabled = enabled;
        if (!enabled && this.audioContext) {
            this.audioContext.suspend();
        } else if (enabled && this.audioContext) {
            this.audioContext.resume();
        }
    }


    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.value = this.musicVolume;
        }
    }

    setEffectsVolume(volume) {
        this.effectsVolume = Math.max(0, Math.min(1, volume));
        if (this.effectsGain) {
            this.effectsGain.gain.value = this.effectsVolume;
        }
    }
}