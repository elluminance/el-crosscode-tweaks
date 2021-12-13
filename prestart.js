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

    onCombatantHeal(a, b) {
        this.parent(a, b)
        if (this.active && sc.options.get("el-arena-hp-bonus") && a.getCombatantRoot().isPlayer) {
            var c = a.params.currentHp,
                d = a.params.getStat("hp");
            c + b > d && (b = d - c);
            b > 0 && this.addScore("DAMAGE_HEALED", b)
        }
    },

    startRound() {
        // just ensure that the cache is empty
        this.itemCache = {};
        this.parent();
    },

    endRound() {
        this.parent();

        
        // add every used item back
        if(sc.options.get("el-arena-item-restore")) {
            for(let [item, count] of Object.entries(this.itemCache)){
                sc.model.player.items[item] += count
            }
        }
        // and clear the item cache
        this.itemCache = {}
    },
})


// flash step fix
ig.ACTION_STEP.SET_PLAYER_INVINCIBLE.inject({
    run(target) {
        var iframes = (3 + target.params.getStat("focus") / 250);
        // eh, who knows. maybe some people like having useless modifiers. :leaCheese:
        if(sc.options.get("el-flash-step-fix")){
            iframes *= (1 + target.params.getModifier("DASH_INVINC"))
        }else{
            iframes += target.params.getModifier("DASH_INVINC")
        }
        target.stunEscapeDash && (iframes = iframes + 12);
        iframes = iframes / 60 * this.factor;
        iframes *= sc.options.get("assist-timing-window")
        
        target.isPlayer || (iframes = iframes + 0.2);
        target.invincibleTimer = iframes;
        return true
    }
})

sc.ASSIST_TIMING_WINDOW = {
    LOW2: 0.5,
    LOW1: 0.75,
    NORM: 1,
    HIGH1: 1.25,
    HIGH2: 1.5,
    HIGH3: 1.75,
    HIGH4: 2
};

let options = {};

for(let [key, value] of Object.entries(sc.OPTIONS_DEFINITION)) {
    options[key] = value;

    switch(key){
        case "assist-attack-frequency": 
            options["assist-timing-window"] = {
                type: "OBJECT_SLIDER",
                data: sc.ASSIST_TIMING_WINDOW,
                init: sc.ASSIST_TIMING_WINDOW.NORM,
                cat: sc.OPTION_CATEGORY.ASSISTS,
                fill: true,
                showPercentage: true,
                hasDivider: false,
                header: "combat"
            }
            break;
        case "game-sense":
            options["el-flash-step-fix"] = {
                type: "CHECKBOX",
                init: true,
                cat: sc.OPTION_CATEGORY.GENERAL,
                hasDivider: true,
                header: "el-tweaks"
            }
            options["el-arena-hp-bonus"] = {
                type: "CHECKBOX",
                init: true,
                cat: sc.OPTION_CATEGORY.GENERAL,
                hasDivider: false,
                header: "el-tweaks"
            }
            options["el-arena-item-restore"] = {
                type: "CHECKBOX",
                init: true,
                cat: sc.OPTION_CATEGORY.GENERAL,
                hasDivider: false,
                header: "el-tweaks"
            }
            break;
        case "keys-dash2":
            options["keys-walk"] = {
                type: "CONTROLS",
                init: {
                    key1: ig.KEY.CTRL,
                    key2: undefined
                },
                cat: sc.OPTION_CATEGORY.CONTROLS
            }
            break;
    }
}

sc.OPTIONS_DEFINITION = options

sc.GameModel.inject({
    isAssistMode() {
        return this.parent() || sc.options.get("assist-timing-window") > 1
    }
})

sc.CombatantShieldConnection.inject({
    init(a, b, e){
        this.parent(a, b, e);

        this.perfectGuardTime *= sc.options.get("assist-timing-window")
    }
})

sc.Control.inject({
    moveDir(b, d, f){
        return this.parent(b,d,f) * (ig.input.state("walk") ? 0.5 : 1)
    }
})