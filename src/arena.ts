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

    onCombatantHeal(a, b) {
        this.parent(a, b)
        if (this.active && sc.options.get("el-arena-hp-bonus") && a.getCombatantRoot().isPlayer) {
            var c = a.params.currentHp,
                d = a.params.getStat("hp");
            c + b > d && (b = d - c);
            b = Math.min(this.damageToHeal, b);
            this.damageToHeal -= b;
            b > 0 && this.addScore("DAMAGE_HEALED", b)
        }
    },

    startRound() {        
        // just ensure that the cache is empty
        this.itemCache = {};
        this.damageToHeal = 0;
        // fixes bug related to restarting round just as you die
        sc.model.player.params.defeated = false;
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