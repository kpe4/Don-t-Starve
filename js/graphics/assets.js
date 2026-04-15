
// js/graphics/assets.js
class AssetLoader {
    constructor() {
        // Хранилище загруженных изображений (ключ -> изображение)
        this.images = new Map();
        // Счетчик загруженных файлов
        this.loadedCount = 0;
        // Общее количество файлов для загрузки
        this.totalImages = 0;
        // Функция, которая вызовется после загрузки всех файлов
        this.onComplete = null;
    }
    // Добавьте этот метод ВНУТРЬ класса AssetLoader
    loadAll(imagesList, callback) {
    // Сохраняем функцию, которую нужно вызвать по завершению
        this.onComplete = callback;
    
    // Преобразуем объект в массив пар [ключ, значение]
        const entries = Object.entries(imagesList);
    
    // Устанавливаем общее количество изображений
        this.totalImages = entries.length;
    
    // Сбрасываем счетчик загруженных
         this.loadedCount = 0;
    
    // Запускаем загрузку каждого изображения
        for (let i = 0; i < entries.length; i++) {
            const name = entries[i][0];  // например: 'player'
            const path = entries[i][1];  // например: 'assets/images/player.png'
            this.loadImage(name, path);
        }
    }
    // Добавьте этот метод ВНУТРЬ класса AssetLoader
    loadImage(name, path) {
    // Создаем новый объект Image
        const img = new Image();
    
    // Сохраняем ссылку на this (потому что внутри onload this будет другим)
        const self = this;
    
    // Что делать когда изображение загрузится
        img.onload = function() {
        // Сохраняем изображение в Map под именем name
        self.images.set(name, img);
        // Увеличиваем счетчик
        self.loadedCount++;
        console.log(`✅ Loaded: ${name} (${self.loadedCount}/${self.totalImages})`);
        
        // Если все загрузились - вызываем колбэк
        if (self.loadedCount === self.totalImages && self.onComplete) {
            console.log("🎉 All assets loaded!");
            self.onComplete();
        }
    
    // Что делать если ошибка загрузки
        img.onerror = function() {
            console.error(`❌ Failed to load: ${name} from ${path}`);
            self.loadedCount++;
            if (self.loadedCount === self.totalImages && self.onComplete) {
                self.onComplete();
            }
        };
    
    // Запускаем загрузку
        img.src = path;
    }
  
      // Добавьте этот метод ВНУТРЬ класса AssetLoader
    getImage(name) {
    // Возвращает изображение по имени или null если не найдено
    return this.images.get(name) || null;
    }
}

window.assetLoader = new AssetLoader();


