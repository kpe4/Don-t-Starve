
// js/core/core.js
class CoreGame {
    constructor(gameState, gameBalance, gameAI, effectsManager, soundManager, camera) {
        this.gameState = gameState;
        this.gameBalance = gameBalance;
        this.gameAI = gameAI;
        this.effectsManager = effectsManager;
        this.soundManager = soundManager;
        this.camera = camera;
        this.lastTimestamp = 0;
    }
    
    // Добавьте в класс CoreGame
    start() {
        this.lastTimestamp = 0;
        console.log("🎮 Game loop started");
    
    // Запускаем фоновую музыку через 1 секунду
        setTimeout(() => {
            this.soundManager.playMusic('ambient', 0.3);
        }, 1000);
    }
        // Добавьте в класс CoreGame
    update(delta) {
        if (!this.gameState.gameActive) return;
    
        // 1. Движение игрока
        this.gameState.movePlayer(delta, this.gameBalance.PLAYER_SPEED);
    
        // 2. Голод (потеря здоровья если голод 0)
        this.gameState.player.hunger -= delta * this.gameBalance.HUNGER_DRAIN_RATE;
        if (this.gameState.player.hunger <= 0) {
        this.gameState.damagePlayer(delta * 5);
        this.gameState.player.hunger = 0;
        }
    
        // 3. Дневной цикл
        this.gameState.dayTimer += delta;
        if (this.gameState.dayTimer >= this.gameBalance.DAY_DURATION) {
            this.gameState.dayTimer = 0;
            this.gameState.nextDay();
        }
    
        // 4. Спавн врагов
        this.gameState.spawnTimer += delta;
        if (this.gameState.spawnTimer >= this.gameBalance.ENEMY_SPAWN_DELAY && 
            this.gameState.enemies.length < this.gameBalance.MAX_ENEMIES) {
            this.gameState.spawnTimer = 0;
            this.gameState.spawnEnemy();

//---------------------------------------------------------------
// Создание игрока, сбор ресурсов, смена дня и ночи, игровой цикл
//---------------------------------------------------------------

// Основной игровой цикл
window.CoreGame = {
    lastTimestamp: 0,
    gameActive: true,
    lastFrameTime: 0,
    
    start: function() {
        this.lastTimestamp = 0;
        console.log("🎮 Game loop started");
        
        // Запускаем фоновую музыку
        setTimeout(() => {
            SoundManager.playMusic('ambient', 0.3);
        }, 1000);
    },
    
    gameLoop: function(currentTime) {
        if(this.lastTimestamp === 0) {
            this.lastTimestamp = currentTime;
            requestAnimationFrame((t) => this.gameLoop(t));
            return;

        }
    
        // 5. Обновление AI врагов
        this.gameAI.updateEnemies(delta, this.gameState.player.x, this.gameState.player.y);
    
        // 6. Атака врагов на игрока
        const attacker = this.gameAI.checkAttack(this.gameState.player.x, this.gameState.player.y);
        if (attacker) {
            this.gameState.damagePlayer(delta * this.gameBalance.ENEMY_DAMAGE);
        }

    
        // 7. Обновление камеры
        if (this.camera) {
            this.camera.update(this.gameState.player.x, this.gameState.player.y, delta);
        }
    
        // 8. Обновление визуальных эффектов
        if (this.effectsManager) {
            this.effectsManager.update(delta);
        }
    
        // 9. Проверка смерти
        if (this.gameState.player.hp <= 0) {
            this.gameState.gameActive = false;
            this.soundManager.play('gameover');
            this.soundManager.stopMusic();
        }
    }

    // Добавьте в класс CoreGame
    gather() {
        if (!this.gameState.gameActive) return false;
    
    // Поиск деревьев рядом
        const trees = this.gameState.getTreesInRange(
            this.gameState.player.x, 
            this.gameState.player.y, 
            this.gameBalance.GATHER_RADIUS
        );
    
        if (trees.length > 0) {
            const gain = Math.min(trees[0].wood, this.gameBalance.GATHER_WOOD_AMOUNT);
            trees[0].wood -= gain;
            this.gameState.addWood(gain);
        
        // Визуальный эффект
            if (this.effectsManager) {
                this.effectsManager.addPickupEffect(trees[0].x, trees[0].y);
            }
        
        // Удаляем дерево если ресурс закончился
            if (trees[0].wood <= 0) {
                this.gameState.removeTree(trees[0]);
            }
        
            this.soundManager.play('gather');
            return true;

        this.lastTimestamp = currentTime;
        this.render();
        
        requestAnimationFrame((t) => this.gameLoop(t));
    },
    
    update: function(delta) {
        if(!GameState.gameActive) return;
        
        // Движение игрока
        GameState.movePlayer(delta, GameBalance.PLAYER_SPEED);
        
        // Голод
        GameState.player.hunger -= delta * GameBalance.HUNGER_DRAIN_RATE;
        if(GameState.player.hunger <= 0) {
            GameState.damagePlayer(delta * 5);
            GameState.player.hunger = 0;
        }
        
        // Дневной цикл
        GameState.dayTimer += delta;
        if(GameState.dayTimer >= GameBalance.DAY_DURATION) {
            GameState.dayTimer = 0;
            GameState.nextDay();
        }
        
        // Спавн врагов
        GameState.spawnTimer += delta;
        if(GameState.spawnTimer >= GameBalance.ENEMY_SPAWN_DELAY && 
           GameState.enemies.length < GameBalance.MAX_ENEMIES) {
            GameState.spawnTimer = 0;
            GameState.spawnEnemy();
        }
        
        // Обновление AI
        GameAI.updateEnemies(delta, GameState.player.x, GameState.player.y);
        
        // Проверка атаки врагов
        const attacker = GameAI.checkAttack(GameState.player.x, GameState.player.y);
        if(attacker) {
            GameState.damagePlayer(delta * GameBalance.ENEMY_DAMAGE);
        }
        
        // Обновление камеры
        if(window.GameCamera) {
            GameCamera.update(GameState.player.x, GameState.player.y, delta);
        }
        
        // Обновление эффектов
        if(window.EffectsManager) {
            EffectsManager.update(delta);
        }
        
        // Проверка смерти
        if(GameState.player.hp <= 0) {
            GameState.gameActive = false;
            SoundManager.play('gameover');
            SoundManager.stopMusic();

        }
    

    // Поиск ягод рядом
        const berries = this.gameState.getBerriesInRange(
            this.gameState.player.x, 
            this.gameState.player.y, 
            this.gameBalance.GATHER_RADIUS
        );
    
        if (berries.length > 0) {
            const gain = Math.min(berries[0].count, this.gameBalance.GATHER_BERRY_AMOUNT);
            berries[0].count -= gain;
            this.gameState.addHunger(gain * this.gameBalance.BERRY_HUNGER_RESTORE);
        
        // Визуальный эффект
            if (this.effectsManager) {
                this.effectsManager.addPickupEffect(berries[0].x, berries[0].y);
            }
        
        // Удаляем куст если ягоды кончились
            if (berries[0].count <= 0) {
                this.gameState.removeBerry(berries[0]);
            }
        
            this.soundManager.play('gather');

    gather: function() {
        if(!GameState.gameActive) return false;
        
        // Сбор дерева
        const trees = GameState.getTreesInRange(GameState.player.x, GameState.player.y, GameBalance.GATHER_RADIUS);
        if(trees.length > 0) {
            const gain = Math.min(trees[0].wood, GameBalance.GATHER_WOOD_AMOUNT);
            trees[0].wood -= gain;
            GameState.addWood(gain);
            if(window.EffectsManager) {
                EffectsManager.addPickupEffect(trees[0].x, trees[0].y);
            }
            
            if(trees[0].wood <= 0) {
                GameState.removeTree(trees[0]);
            }
            SoundManager.play('gather');

            return true;
        }
    
        return false;
    }
    // Добавьте в класс CoreGame
    attack() {
        if (!this.gameState.gameActive) return false;
    
        // Поиск ближайшего врага
        const nearest = this.gameAI.findNearestEnemy(
            this.gameState.player.x, 
            this.gameState.player.y, 
            this.gameBalance.ATTACK_RADIUS
        );
    
        if (nearest) {
            // Наносим урон
            const defeated = this.gameAI.damageEnemy(nearest, this.gameBalance.PLAYER_DAMAGE);
        

            // Визуальный эффект удара
            if (this.effectsManager) {
                this.effectsManager.addHitEffect(nearest.x, nearest.y);
            }
        
            this.soundManager.play('hit');
        
            if (defeated) {
                console.log("💀 Enemy defeated!");

        // Сбор ягод
        const berries = GameState.getBerriesInRange(GameState.player.x, GameState.player.y, GameBalance.GATHER_RADIUS);
        if(berries.length > 0) {
            const gain = Math.min(berries[0].count, GameBalance.GATHER_BERRY_AMOUNT);
            berries[0].count -= gain;
            GameState.addHunger(gain * GameBalance.BERRY_HUNGER_RESTORE);
            if(window.EffectsManager) {
                EffectsManager.addPickupEffect(berries[0].x, berries[0].y);
            }
            
            if(berries[0].count <= 0) {
                GameState.removeBerry(berries[0]);

            }
            SoundManager.play('gather');
            return true;
        }
    

        return false;
    }

    // Добавьте в класс CoreGame
    restart() {
    // Сбрасываем состояние игры
        this.gameState.reset();
        this.gameAI.clearEnemies();
    
    // Сбрасываем камеру
        if (this.camera) {
            this.camera.reset(this.gameState.player.x, this.gameState.player.y);
        }
    
    // Очищаем эффекты
        if (this.effectsManager) {
            this.effectsManager.effects = [];
        }
    
    // Запускаем музыку заново
        this.soundManager.playMusic('ambient', 0.3);
    

    attack: function() {
        if(!GameState.gameActive) return false;
        
        const nearest = GameAI.findNearestEnemy(
            GameState.player.x, 
            GameState.player.y, 
            GameBalance.ATTACK_RADIUS
        );
        
        if(nearest) {
            const defeated = GameAI.damageEnemy(nearest, GameBalance.PLAYER_DAMAGE);
            if(window.EffectsManager) {
                EffectsManager.addHitEffect(nearest.x, nearest.y);
            }
            SoundManager.play('hit');
            
            if(defeated) {
                console.log("💀 Enemy defeated!");
            }
            return true;
        }
        
        return false;
    },
    
    restart: function() {
        GameState.reset();
        GameAI.clearEnemies();
        if(window.GameCamera) GameCamera.reset();
        if(window.EffectsManager) EffectsManager.effects = [];
        SoundManager.playMusic('ambient', 0.3);

        console.log("🔄 Game restarted!");
    }
    // Добавьте в класс CoreGame
    render(renderer) {
        if (!renderer) return;
    

        // Рисуем фон
        renderer.drawGround();
    
        // Рисуем деревья
        for (let i = 0; i < this.gameState.world.trees.length; i++) {
            renderer.drawTree(this.gameState.world.trees[i].x, this.gameState.world.trees[i].y);
        }
    
        // Рисуем ягоды
        for (let i = 0; i < this.gameState.world.berries.length; i++) {
            renderer.drawBerry(this.gameState.world.berries[i].x, this.gameState.world.berries[i].y, this.gameState.world.berries[i].count);
        }
    
        // Рисуем врагов
        for (let i = 0; i < this.gameState.enemies.length; i++) {
            const e = this.gameState.enemies[i];
            renderer.drawEnemy(e.x, e.y, e.hp, e.maxHp, e.type);
        }
    
        // Рисуем игрока
        renderer.drawPlayer(this.gameState.player.x, this.gameState.player.y, this.gameState.player.hp);
    
        // Рисуем визуальные эффекты
        if (this.effectsManager && renderer.camera) {
            this.effectsManager.draw(renderer.ctx, renderer.camera);
        }
    
        // Рисуем UI
        renderer.drawUI();
    
        // Рисуем экран Game Over если нужно
        if (!this.gameState.gameActive) {
            renderer.drawGameOver();
        }
    }
}

    render: function() {
        if(!GameRenderer.ctx || !GameState) return;
        
        const ctx = GameRenderer.ctx;
        
        // Очистка и фон
        GameRenderer.drawGround();
        
        // Деревья
        for(let tree of GameState.world.trees) {
            GameRenderer.drawTree(tree.x, tree.y);
        }
        
        // Ягоды
        for(let berry of GameState.world.berries) {
            GameRenderer.drawBerry(berry.x, berry.y, berry.count);
        }
        
        // Враги
        for(let enemy of GameState.enemies) {
            GameRenderer.drawEnemy(enemy.x, enemy.y, enemy.hp, enemy.maxHp, enemy.type);
        }
        
        // Игрок
        GameRenderer.drawPlayer(GameState.player.x, GameState.player.y, GameState.player.hp);
        
        // Эффекты
        if(window.EffectsManager && GameCamera) {
            EffectsManager.draw(ctx, GameCamera);
        }
        
        // UI
        if(window.drawUIPanel) {
            drawUIPanel(ctx, 
                GameState.player.hp, 
                GameState.player.hunger, 
                GameState.player.wood, 
                GameState.day
            );
        }
        
        if(window.drawUIButtons) {
            drawUIButtons(ctx);
        }
        
        if(window.drawMinimap && GameCamera) {
            drawMinimap(ctx, GameCamera);
        }
        
        // Game Over экран
        if(!GameState.gameActive) {
            ctx.fillStyle = "rgba(0,0,0,0.8)";
            ctx.fillRect(0, 0, 800, 600);
            ctx.fillStyle = "#ff6666";
            ctx.font = "bold 32px monospace";
            ctx.fillText("GAME OVER", 310, 300);
            ctx.font = "14px monospace";
            ctx.fillStyle = "#fff";
            ctx.fillText("Press RESTART or R", 340, 360);
        }
    }
};


console.log("⚙️ Core ready");

