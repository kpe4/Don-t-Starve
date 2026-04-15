
// js/core/ai.js

class GameAI {
    constructor(gameState, gameBalance, gameConfig) {
        this.gameState = gameState;
        this.gameBalance = gameBalance;
        this.gameConfig = gameConfig;
    }

 
    updateEnemies(delta, playerX, playerY) {
        for (let i = 0; i < this.gameState.enemies.length; i++) {
            const enemy = this.gameState.enemies[i];

            // Проверяем, жив ли враг
            if (enemy.hp <= 0) {
              
                continue; 
            }

            const dx = playerX - enemy.x;
            const dy = playerY - enemy.y;
            const distToPlayer = Math.hypot(dx, dy); 

            let moveX = 0;
            let moveY = 0;

            
            if (distToPlayer < 200) {
                
                if (distToPlayer > 0.01) { 
                    moveX = (dx / distToPlayer) * this.gameBalance.ENEMY_SPEED;
                    moveY = (dy / distToPlayer) * this.gameBalance.ENEMY_SPEED;
                }
            } else {
              
                const move = this.getBehaviorMove(enemy, delta, playerX, playerY, distToPlayer);
                moveX = move.x;
                moveY = move.y;
            }

            // Применяем рассчитанное движение
            enemy.x += moveX * delta;
            enemy.y += moveY * delta;

           
            enemy.x = Math.max(20, Math.min(this.gameConfig.WORLD_WIDTH - 20, enemy.x));
            enemy.y = Math.max(20, Math.min(this.gameConfig.WORLD_HEIGHT - 20, enemy.y));

          
            if (moveX !== 0 || moveY !== 0) {
                enemy.direction = Math.atan2(moveY, moveX);
            }
        }
    }

   
    getBehaviorMove(enemy, delta, playerX, playerY, distToPlayer) {
    
        return { x: 0, y: 0 };
    }



