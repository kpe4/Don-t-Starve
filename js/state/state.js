// Состояние игры
window.GameState = {
    gameActive: true,
    
    player: {
        x: 1200,
        y: 900,
        hp: 100,
        hunger: 100,
        wood: 0,
        targetX: null,
        targetY: null
    },
    
    world: {
        trees: [],
        berries: [],
        width: GameConfig.WORLD_WIDTH,
        height: GameConfig.WORLD_HEIGHT
    },
    
    enemies: [],
    day: 1,
    dayTimer: 0,
    spawnTimer: 0,
    
    init: function() {
        this.generateWorld();
        this.reset();
    },
    
    generateWorld: function() {
        this.world.trees = [];
        this.world.berries = [];
        
        // Генерация деревьев кластерами
        const treeClusters = 12;
        for(let c = 0; c < treeClusters; c++) {
            const centerX = 200 + Math.random() * (GameConfig.WORLD_WIDTH - 400);
            const centerY = 150 + Math.random() * (GameConfig.WORLD_HEIGHT - 300);
            const clusterSize = 4 + Math.floor(Math.random() * 6);
            
            for(let i = 0; i < clusterSize; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 40 + Math.random() * 70;
                this.world.trees.push({
                    x: Math.max(50, Math.min(GameConfig.WORLD_WIDTH - 50, centerX + Math.cos(angle) * radius)),
                    y: Math.max(50, Math.min(GameConfig.WORLD_HEIGHT - 50, centerY + Math.sin(angle) * radius)),
                    wood: 12 + Math.floor(Math.random() * 10)
                });
            }
        }
        
        // Генерация ягод
        const berryClusters = 8;
        for(let c = 0; c < berryClusters; c++) {
            const centerX = 150 + Math.random() * (GameConfig.WORLD_WIDTH - 300);
            const centerY = 100 + Math.random() * (GameConfig.WORLD_HEIGHT - 200);
            const clusterSize = 3 + Math.floor(Math.random() * 4);
            
            for(let i = 0; i < clusterSize; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 30 + Math.random() * 50;
                this.world.berries.push({
                    x: Math.max(40, Math.min(GameConfig.WORLD_WIDTH - 40, centerX + Math.cos(angle) * radius)),
                    y: Math.max(40, Math.min(GameConfig.WORLD_HEIGHT - 40, centerY + Math.sin(angle) * radius)),
                    count: 6 + Math.floor(Math.random() * 8)
                });
            }
        }
        
        console.log(`🌍 World generated: ${this.world.trees.length} trees, ${this.world.berries.length} berries`);
    },
    
    reset: function() {
        this.gameActive = true;
        this.player = {
            x: GameConfig.WORLD_WIDTH / 2,
            y: GameConfig.WORLD_HEIGHT / 2,
            hp: 100,
            hunger: 100,
            wood: 0,
            targetX: null,
            targetY: null
        };
        this.day = 1;
        this.dayTimer = 0;
        this.spawnTimer = 0;
        this.generateWorld();
        this.enemies = [];
        
        // Создаем начальных врагов
        for(let i = 0; i < 6; i++) {
            this.spawnEnemy();
        }
    },
    
    setPlayerTarget: function(screenX, screenY, cameraX, cameraY) {
        if(!this.gameActive) return;
        const worldX = screenX + cameraX;
        const worldY = screenY + cameraY;
        this.player.targetX = Math.max(20, Math.min(GameConfig.WORLD_WIDTH - 20, worldX));
        this.player.targetY = Math.max(20, Math.min(GameConfig.WORLD_HEIGHT - 20, worldY));
    },
    
    movePlayer: function(delta, speed) {
        if(!this.gameActive || this.player.targetX === null) return;
        
        let dx = this.player.targetX - this.player.x;
        let dy = this.player.targetY - this.player.y;
        let dist = Math.hypot(dx, dy);
        
        if(dist < 5) {
            this.player.targetX = null;
            return;
        }
        
        let move = speed * delta;
        this.player.x += (dx / dist) * move;
        this.player.y += (dy / dist) * move;
        
        this.player.x = Math.max(20, Math.min(GameConfig.WORLD_WIDTH - 20, this.player.x));
        this.player.y = Math.max(20, Math.min(GameConfig.WORLD_HEIGHT - 20, this.player.y));
    },
    
    spawnEnemy: function() {
        const enemyTypes = ['patrol', 'guard', 'wander'];
        const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        
        let x, y;
        do {
            x = 100 + Math.random() * (GameConfig.WORLD_WIDTH - 200);
            y = 100 + Math.random() * (GameConfig.WORLD_HEIGHT - 200);
        } while(Math.hypot(x - this.player.x, y - this.player.y) < 300);
        
        const enemy = {
            id: Date.now() + Math.random(),
            x: x,
            y: y,
            hp: GameBalance.ENEMY_BASE_HP + Math.floor(Math.random() * 20),
            maxHp: GameBalance.ENEMY_BASE_HP + Math.floor(Math.random() * 20),
            type: type,
            behavior: this.createEnemyBehavior(type, x, y)
        };
        
        this.enemies.push(enemy);
        return enemy;
    },
    
    createEnemyBehavior: function(type, x, y) {
        switch(type) {
            case 'patrol':
                return {
                    patrolPoints: [
                        { x: x - 100 + Math.random() * 200, y: y - 100 + Math.random() * 200 },
                        { x: x - 100 + Math.random() * 200, y: y - 100 + Math.random() * 200 },
                        { x: x - 100 + Math.random() * 200, y: y - 100 + Math.random() * 200 }
                    ],
                    currentPatrolIndex: 0
                };
            case 'guard':
                return {
                    guardPoint: { x: x, y: y, radius: 80 }
                };
            case 'wander':
                return {
                    wanderAngle: Math.random() * Math.PI * 2,
                    wanderTimer: 0
                };
            default:
                return {};
        }
    },
    
    addWood: function(amount) {
        this.player.wood += amount;
    },
    
    addHunger: function(amount) {
        this.player.hunger = Math.min(100, this.player.hunger + amount);
    },
    
    damagePlayer: function(amount) {
        this.player.hp -= amount;
        if(this.player.hp <= 0) {
            this.gameActive = false;
        }
    },
    
    healPlayer: function(amount) {
        this.player.hp = Math.min(100, this.player.hp + amount);
    },
    
    nextDay: function() {
        this.day++;
        this.healPlayer(5);
        this.addHunger(8);
        console.log(`🌞 Day ${this.day}`);
    },
    
    getTreesInRange: function(x, y, radius) {
        return this.world.trees.filter(tree => 
            Math.hypot(tree.x - x, tree.y - y) < radius && tree.wood > 0
        );
    },
    
    getBerriesInRange: function(x, y, radius) {
        return this.world.berries.filter(berry => 
            Math.hypot(berry.x - x, berry.y - y) < radius && berry.count > 0
        );
    },
    
    removeTree: function(tree) {
        const index = this.world.trees.indexOf(tree);
        if(index > -1) this.world.trees.splice(index, 1);
    },
    
    removeBerry: function(berry) {
        const index = this.world.berries.indexOf(berry);
        if(index > -1) this.world.berries.splice(index, 1);
    }

    createEnemyBehavior: function(type, x, y) {
        switch(type) {
            case 'patrol':
                return {
                    patrolPoints: [
                        { x: x - 100 + Math.random() * 200, y: y - 100 + Math.random() * 200 },
                        { x: x - 100 + Math.random() * 200, y: y - 100 + Math.random() * 200 },
                        { x: x - 100 + Math.random() * 200, y: y - 100 + Math.random() * 200 }
                    ],
                    currentPatrolIndex: 0
                };
            case 'guard':
                return {
                    guardPoint: { x: x, y: y, radius: 80 }
                };
            case 'wander':
                return {
                    wanderAngle: Math.random() * Math.PI * 2,
                    wanderTimer: 0
                };
            default:
                return {};
        }
    },
};

console.log("📊 Game State ready");
