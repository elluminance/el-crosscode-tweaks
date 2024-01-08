sc.ARENA_SCORE_TYPES.DAMAGE_HEALED = {
    order: 3,
    staticMultiplier: 15,
    "static": true,
    asBonus: true
}

type CupList = Record<string, {order: number}>;

sc.Arena.inject({
    isScalingStats: false,
    forceScaling: true,
    itemCache: {},
    damageToHeal: 0,
    trackedCups: [
        "rookie-cup",
        "seeker-cup",
        "boss-cup",
        "faction-cup-1",
        "faction-cup-2",
        "rookie-team-cup",
        "faction-team-cup-1",
    ],

    addScore(scoreType, points) {
        this.parent(scoreType, points)
        if(scoreType === "DAMAGE_TAKEN"){
            // the points "added" upon damage taken will always be a negative value
            // also accounts for the fact that PVP battles will not account for the 
            this.damageToHeal -= points! * (this.hasChallenge("PVP_BATTLE") ? 0.6 : 1);
        }
    },

    enterArenaMode(cupName, round) {
        this.parent(cupName, round);
        if (sc.options.get("el-arena-force-scaling") && this.forceScaling) {
            this.runtime.forceScaling = this.forceScaling;
        }
    },

    onLevelLoadStart() {
        this.parent();
        if(this.active) {
            // fixes bug related to restarting round just as you die
            sc.model.player.params.defeated = false;
        
            if(this.hasChallenge("WEAPON_ADJUST") || this.runtime.forceScaling) {
                sc.inventory.updateScaledEquipment(this.getCupLevel(this.runtime.cup));
                sc.model.player.updateStats();
                this.isScalingStats = true;
            } else if (this.isScalingStats) {
                sc.inventory.updateScaledEquipment(sc.model.player.level);
                sc.model.player.updateStats();
                this.isScalingStats = false;
            }
        } else {
            if(this.isScalingStats) {
                sc.inventory.updateScaledEquipment(sc.model.player.level);
                sc.model.player.updateStats();
                this.isScalingStats = false;
            }
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
            amountHealed > 0 && this.addScore("DAMAGE_HEALED", Math.round(amountHealed))
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

    getTotalArenaCompletion(){
        var a: number, b: number;
        a = b = 0;
        for(let cupName of this.trackedCups) {a += this.getCupCompletion(cupName); b++;}
        return a / b;
    },

    getTotalDefaultTrophies: function(a, c) {
        var d = 0, e = 0;
        for(let cup of this.trackedCups) {
            var g = this.getCupTrophy(cup);
            if (this.isCupUnlocked(cup))
                if (a === 0) {
                    d += g;
                    e += 5
                } else {
                    g >= a && d++;
                    e++
                }
        }
        return c ? e : d
    },

    getTotalDefaultCups(sorted){
        let cups: CupList = {};
        for(let key of this.trackedCups) {
            /* 
             * if the cup is not loaded, skip it.
             * prevents bug where it would show stats for
             * cups like "~ancient-cup" in red.
            */
            if(this.cups[key].name) {
                let order = sc.arena.cups[key].order || 1e7;
                if(this.isCupCustom(key)) order += 1e7;
                cups[key] = {order}
            }
        }

        if(sorted){
            let sortedCups: CupList = {}
            for(let key of Object.keys(cups).sort((a, b) => (cups[a].order - cups[b].order))) {
                if(this.isCupUnlocked(key) && cups[key]) sortedCups[key] = cups[key];
            }
            
            return sortedCups;
        }
        return cups
    },

    hasAscendedChallenge(cupName) {
        return this.getCupCoreAttrib(cupName, "mods")?.includes("WEAPON_ADJUST");
    },

    // this won't persist if the mod is uninstalled/reinstalled.
    // ...but who cares? it's not the end of the world if it's lost.
    // it's just a single button press.
    onStorageSave(savefile) {
        this.parent!(savefile);
        savefile.arena.forceScaling = this.forceScaling ?? true;
    },
    onStoragePreLoad(savefile) {
        this.parent!(savefile);
        this.forceScaling = savefile.arena?.forceScaling ?? true;
    },
})

sc.ARENA_CHALLENGE_ICONS = {
    NO_HEAT: {
        src: "media/gui/el/el-tweaks-gui.png",
        x: 112,
        y: 0,
        tinyX: 112,
        tinyY: 18
    },
    NO_COLD: {
        src: "media/gui/el/el-tweaks-gui.png",
        x: 130,
        y: 0,
        tinyX: 130,
        tinyY: 18
    },
    NO_SHOCK: {
        src: "media/gui/el/el-tweaks-gui.png",
        x: 148,
        y: 0,
        tinyX: 148,
        tinyY: 18
    },
    NO_WAVE: {
        src: "media/gui/el/el-tweaks-gui.png",
        x: 148,
        y: 0,
        tinyX: 148,
        tinyY: 18
    },
}

Object.assign(sc.ARENA_CHALLENGES, {
    NO_HEAT: new sc.ArenaChallengePlayerBase("ELEMENT_HEAT", "NO_HEAT"),
    NO_COLD: new sc.ArenaChallengePlayerBase("ELEMENT_COLD", "NO_COLD"),
    NO_SHOCK: new sc.ArenaChallengePlayerBase("ELEMENT_SHOCK", "NO_SHOCK"),
    NO_WAVE: new sc.ArenaChallengePlayerBase("ELEMENT_WAVE", "NO_WAVE"),
})

sc.ArenaChallengeEntry.inject({
    init(challengeName, width, tiny, global) {
        this.parent(challengeName, width, tiny, global);

        if(typeof this.icon === "string") {
            let iconSrc = sc.ARENA_CHALLENGE_ICONS[this.icon].src;
            iconSrc && (this.altGfx = new ig.Image(iconSrc))
        }
    },

    updateDrawables(renderer) {
        let icon: sc.ArenaChallengeIcon | undefined;
        if(typeof this.icon === "string") icon = sc.ARENA_CHALLENGE_ICONS[this.icon];
        if(icon) {
            if(!this.tiny) {
                renderer.addGfx(this.altGfx, 0, 0, icon.x, icon.y, 18, 18)
                this.global && renderer.addGfx(this.gfx, 0, 0, 128, 48, 18, 18)
            } else {
                renderer.addGfx(this.altGfx, 0, 0, icon.tinyX, icon.tinyY, 10, 10)
                this.global && renderer.addGfx(this.gfx, 0, 0, 146, 48, 10, 10)
            }
        } else this.parent(renderer)
    }
})

sc.ArenaSummary.Entry.inject({
    init(a,b,d,g,h,i,j,k) {
        if(i) a = a.replace("\\i[times]", "\\i[timesGreen]")
        this.parent(a,b,d,g,h,i,j,k);

    }
})