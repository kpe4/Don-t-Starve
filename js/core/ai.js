wanderBehavior(enemy, delta, playerX, playerY) {
    const distToPlayer = Math.hypot(enemy.x - playerX, enemy.y - playerY);

    // Если игрок близко — враг убегает
    if (distToPlayer < 150) {
        const dx = enemy.x - playerX;
        const dy = enemy.y - playerY;
        const dist = Math.hypot(dx, dy);

        if (dist > 0.01) {
            return {
                x: (dx / dist) * this.gameBalance.ENEMY_SPEED * 0.8,
                y: (dy / dist) * this.gameBalance.ENEMY_SPEED * 0.8
            };
        }
    }

    // Защита, если behavior не создан
    if (!enemy.behavior) {
        enemy.behavior = {};
    }

    if (enemy.behavior.wanderTimer === undefined) {
        enemy.behavior.wanderTimer = 0;
    }

    if (enemy.behavior.wanderAngle === undefined) {
        enemy.behavior.wanderAngle = Math.random() * Math.PI * 2;
    }

    // Случайное блуждание
    enemy.behavior.wanderTimer += delta;

    if (enemy.behavior.wanderTimer > 3) {
        enemy.behavior.wanderTimer = 0;
        enemy.behavior.wanderAngle += (Math.random() - 0.5) * Math.PI;
    }

    return {
        x: Math.cos(enemy.behavior.wanderAngle) * this.gameBalance.ENEMY_SPEED * 0.4,
        y: Math.sin(enemy.behavior.wanderAngle) * this.gameBalance.ENEMY_SPEED * 0.4
    };
}
