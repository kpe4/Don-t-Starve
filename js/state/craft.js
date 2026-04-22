class CraftingSystem {
    constructor(gameState, coreGame) {
        this.gameState = gameState;
        this.coreGame = coreGame;
        this.menuOpen = false;
        this.recipes = {
            spear: {
                cost: 25,
                type: 'wood',
                effect: () => {
                    this.coreGame.attackDamage = 28;
                    this.showMsg("⚔️ Spear crafted! +8 damage");
                }
            },
            heal: {
                cost: 20,
                type: 'wood',
                effect: () => {
                    this.gameState.healPlayer(20);
                    this.showMsg("💚 +20 HP");
                }
            }
        };
    }
    ccraft(itemId) {
        if (!this.gameState.gameActive) return false;
    
        const recipe = this.recipes[itemId];
    
        // ❗ защита от ошибки
        if (!recipe) {
            console.log("❌ Unknown recipe:", itemId, recipe);
            return false;
        }
    
        console.log(itemId, recipe);
    
        // проверка ресурсов
        if (recipe.type === 'wood' && this.gameState.player.wood < recipe.cost) {
            this.showMsg("❌ Not enough wood");
            return false;
        }
    
        // списание ресурса
        if (recipe.type === 'wood') {
            this.gameState.player.wood -= recipe.cost;
        }
    
        // эффект крафта
        recipe.effect();
    
        return true;
    }
    showMsg(msg) {
        if (this.coreGame.showNotification) this.coreGame.showNotification(msg);
        else console.log(msg);
    }
    
    toggleMenu() { 
        this.menuOpen = !this.menuOpen;
        this.showMsg(this.menuOpen ? "Crafting: 1-Spear(25), 2-Heal(20)" : "Crafting closed");
    }
      draw(ctx) {
        if (!this.menuOpen) return;
        ctx.fillStyle = "rgba(0,0,0,0.9)";
        ctx.fillRect(250, 150, 300, 200);
        ctx.fillStyle = "#ffde9c";
        ctx.font = "bold 20px monospace";
        ctx.fillText("CRAFTING", 340, 190);
        ctx.font = "14px monospace";
        ctx.fillStyle = this.gameState.player.wood >= 25 ? "#4caf50" : "#888";
        ctx.fillText("1. ⚔️ Spear (25 wood)", 270, 240);
        ctx.fillStyle = this.gameState.player.wood >= 20 ? "#4caf50" : "#888";
        ctx.fillText("2. 💚 Healing (20 wood)", 270, 280);
        ctx.fillStyle = "#888";
        ctx.font = "10px monospace";
        ctx.fillText("Press C to close", 340, 330);
    }
    
    handleKey(key) {
        if (!this.menuOpen) return;
    
        if (this.recipes[key]) {
            this.craft(key);
        }
    }
}
