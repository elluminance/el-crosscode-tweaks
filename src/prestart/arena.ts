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

sc.ARENA_CHALLENGE_ICONS = {
    NO_HEAT: {
        src: "media/gui/el/elemental-arena-challenge.png",
        x: 0,
        y: 0,
        tinyX: 0,
        tinyY: 18
    },
    NO_COLD: {
        src: "media/gui/el/elemental-arena-challenge.png",
        x: 18,
        y: 0,
        tinyX: 10,
        tinyY: 18
    },
    NO_SHOCK: {
        src: "media/gui/el/elemental-arena-challenge.png",
        x: 36,
        y: 0,
        tinyX: 10,
        tinyY: 18
    },
    NO_WAVE: {
        src: "media/gui/el/elemental-arena-challenge.png",
        x: 54,
        y: 0,
        tinyX: 10,
        tinyY: 18
    },
}

Object.assign(sc.ARENA_CHALLENGES, {
    NO_HEAT: new sc.ArenaChallengePlayerBase("ELEMENT_HEAT", "NO_HEAT"),
    NO_COLD: new sc.ArenaChallengePlayerBase("ELEMENT_COLD", 1),
    NO_SHOCK: new sc.ArenaChallengePlayerBase("ELEMENT_SHOCK", 1),
    NO_WAVE: new sc.ArenaChallengePlayerBase("ELEMENT_WAVE", 1),
})

sc.ArenaChallengeEntry.inject({
    init(challengeName, width, tiny, global) {
        this.parent(challengeName, width, tiny, global);

        if(typeof this.icon == "string") {
            let iconSrc = sc.ARENA_CHALLENGE_ICONS[this.icon].src;
            iconSrc && (this.altGfx = new ig.Image(iconSrc))
        }
    },

    updateDrawables(renderer) {
        if(typeof this.icon == "string") {
            let icon = sc.ARENA_CHALLENGE_ICONS[this.icon];
            if(icon) {
                if(!this.tiny) {
                    renderer.addGfx(this.altGfx, 0, 0, icon.x, icon.y, 18, 18)
                    this.global && renderer.addGfx(this.gfx, 0, 0, 128, 48, 18, 18)
                } else {
                    renderer.addGfx(this.altGfx, 0, 0, icon.tinyX, icon.tinyY, 10, 10)
                    this.global && renderer.addGfx(this.gfx, 0, 0, 146, 48, 10, 10)
                }
                // if the icon isn't found, it just use the default icon through the parent method
                return;
            }
        }
        this.parent(renderer)
    }
})