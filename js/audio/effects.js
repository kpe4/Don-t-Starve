window.EffectsManager = {
    effects: [],  // массив активных эффектов
    
    // Добавление эффекта сбора (золотая вспышка)
    addPickupEffect: function(x, y) {
        this.effects.push({
            x: x, y: y,
            lifetime: 0.4,
            maxLifetime: 0.4,
            type: 'pickup'
        });
        SoundManager.play('gather');  // воспроизводим звук сбора
    },
    
    // Добавление эффекта удара (красная вспышка)
    addHitEffect: function(x, y) {
        this.effects.push({
            x: x, y: y,
            lifetime: 0.3,
            maxLifetime: 0.3,
            type: 'hit'
        });
        SoundManager.play('hit');  // воспроизводим звук удара
    },
    
    // Обновление всех эффектов (уменьшение времени жизни)
    update: function(delta) {
        for(let i = this.effects.length - 1; i >= 0; i--) {
            this.effects[i].lifetime -= delta;
            if(this.effects[i].lifetime <= 0) {
                this.effects.splice(i, 1);  // удаляем истекшие эффекты
            }
        }
    },
    
    // Отрисовка всех эффектов
    draw: function(ctx) {
        for(let e of this.effects) {
            const alpha = e.lifetime / e.maxLifetime;  // прозрачность уменьшается со временем
            const radius = 20 * (1 - alpha);  // радиус уменьшается
            
            if(e.type === 'pickup') {
                ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;  // золотой
            } else {
                ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`;  // красный
            }
            
            ctx.beginPath();
            ctx.arc(e.x, e.y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};
