// ===== AI INIT =====
//-------------------------------
// Создание и функционал врага
//-------------------------------

// обновлено 06.04 @Gabryelf - убрал `мусорные` функции и дублирование

function helloAI() {
    console.log("🤖 AI & Logic ready");
}


// ===== GAME AI (ОСНОВНОЙ) =====
window.GameAI = {
    enemies: [],
    
    addEnemy: function(x, y, hp = 100) {
        const enemy = { 
            id: Date.now() + Math.random(),
            x: x, 
            y: y, 
            hp: hp,
            maxHp: hp
        };
        this.enemies.push(enemy);
        console.log(`👾 Enemy spawned at (${x}, ${y}) with ${hp} HP`);
        return enemy;
    },
    
    // ✅ ИСПРАВЛЕНО
    updateEnemies: function(delta, playerX, playerY) {
        const speed = GameBalance.ENEMY_SPEED;
        
        for(let i = 0; i < this.enemies.length; i++) {
            const e = this.enemies[i];
            const dx = playerX - e.x;
            const dy = playerY - e.y;
            const dist = Math.hypot(dx, dy);
            
            if(dist > 0.01 && dist < 300) {
                const move = speed * delta;
                e.x += (dx / dist) * move;
                e.y += (dy / dist) * move;
            }
            
            e.x = Math.max(30, Math.min(770, e.x));
            e.y = Math.max(50, Math.min(540, e.y));
        }
    },
    
    getEnemies: function() {
        return this.enemies;
    },
    
    damageEnemy: function(enemyId, damage) {
        const enemy = this.enemies.find(e => e.id === enemyId);
        if(enemy) {
            enemy.hp -= damage;
            console.log(`💥 Enemy damaged: ${enemy.hp}/${enemy.maxHp} HP`);
            if(enemy.hp <= 0) {
                this.removeEnemy(enemyId);
                return true;
            }
        }
        return false;
    },
    
    removeEnemy: function(enemyId) {
        const index = this.enemies.findIndex(e => e.id === enemyId);
        if(index !== -1) {
            this.enemies.splice(index, 1);
            console.log(`☠️ Enemy defeated! Remaining: ${this.enemies.length}`);
        }
    },
    
    clearEnemies: function() {
        this.enemies = [];
        console.log("🧹 All enemies cleared");
    }
};
helloAI();


// ===== ПЕРЕОПРЕДЕЛЕНИЕ (оставлено как есть, но исправлен updateEnemies) =====
