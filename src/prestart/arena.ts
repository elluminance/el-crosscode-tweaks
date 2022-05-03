sc.ARENA_SCORE_TYPES.DAMAGE_HEALED = {
    order: 3,
    staticMultiplier: 15,
    "static": true,
    asBonus: true
}

sc.PlayerModel.inject({
    useItem(a) {
        if(this.items[a] && sc.arena.active){
            sc.arena.itemCache[a] ? (sc.arena.itemCache[a] += 1) : (sc.arena.itemCache[a] = 1)
        }
        return this.parent(a)
    }
})

sc.Arena.inject({
    itemCache: {},
    damageToHeal: 0,

    addScore(scoreType, points) {
        this.parent(scoreType, points)
        if(scoreType == "DAMAGE_TAKEN"){
            // the points "added" upon damage taken will always be a negative value
            this.damageToHeal -= points;
        }
    },

    onLevelLoadStart() {
        this.parent();
        if(this.active) {
            // fixes bug related to restarting round just as you die
            sc.model.player.params.defeated = false;
        }
    },

    onCombatantHeal(entity, amountHealed) {
        this.parent(entity, amountHealed)
        if (this.active && sc.options.get("el-arena-hp-bonus") && entity.getCombatantRoot().isPlayer) {
            let currentHp = entity.params.currentHp,
                maxHp = entity.params.getStat("hp");
            currentHp + amountHealed > maxHp && (amountHealed = maxHp - currentHp);
            amountHealed = Math.min(this.damageToHeal, amountHealed);
            this.damageToHeal -= amountHealed;
            amountHealed > 0 && this.addScore("DAMAGE_HEALED", amountHealed)
        }
    },

    startRound() {        
        // just ensure that the cache is empty
        this.itemCache = {};
        this.damageToHeal = 0;
        this.parent();
    },

    endRound() {
        this.parent();

        
        // add every used item back
        if(sc.options.get("el-arena-item-restore")) {
            for(let [item, count] of Object.entries(this.itemCache)){
                sc.model.player.items[+item] += count
            }
        }
        // and clear the item cache
        this.itemCache = {}
    },
})