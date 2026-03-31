function helloSound() {
    console.log("🔊 Sound & Effects ready");
}

window.SoundManager = {
    sounds: {},
    loadedCount: 0,
    totalSounds: 0,
    onComplete: null,
    
    // Регистрация одного звука
    registerSound: function(name, path) {
        this.totalSounds++;
        const audio = new Audio();
        audio.addEventListener('canplaythrough', () => {
            this.loadedCount++;
            console.log(`✅ Sound loaded: ${name} (${this.loadedCount}/${this.totalSounds})`);
            if(this.loadedCount === this.totalSounds && this.onComplete) {
                console.log("🔊 All sounds ready!");
                this.onComplete();
            }
        });
        audio.onerror = () => {
            console.error(`❌ Failed to load sound: ${name}`);
            this.loadedCount++;
        };
        audio.src = path;
        audio.load();
        this.sounds[name] = audio;
    },
    
    // НОВЫЙ МЕТОД: массовая загрузка
    loadAll: function(soundsList, callback) {
        this.onComplete = callback;
        const names = Object.keys(soundsList);
        this.totalSounds = names.length;
        this.loadedCount = 0;
        
        for(let i = 0; i < names.length; i++) {
            const name = names[i];
            const path = soundsList[name];
            this.registerSound(name, path);
        }
    },
    
    // Воспроизведение звука
    play: function(name) {
        const sound = this.sounds[name];
        if(sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Audio error:", e));
        } else {
            console.warn(`⚠️ Sound not found: ${name}`);
        }
    },
    
    // НОВЫЙ МЕТОД: фоновая музыка с зацикливанием
    playMusic: function(name, volume = 0.3) {
        const music = this.sounds[name];
        if(music) {
            music.loop = true;
            music.volume = volume;
            music.play().catch(e => console.log("Music error:", e));
        }
    },
    
    // НОВЫЙ МЕТОД: остановка музыки
    stopMusic: function(name) {
        const music = this.sounds[name];
        if(music) {
            music.pause();
            music.currentTime = 0;
        }
    },
    
    // Установка громкости
    setVolume: function(name, volume) {
        const sound = this.sounds[name];
        if(sound) {
            sound.volume = Math.max(0, Math.min(1, volume));
        }
    }
};

helloSound();
