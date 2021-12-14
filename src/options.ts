sc.ASSIST_TIMING_WINDOW = {
    LOW2: 0.5,
    LOW1: 0.75,
    NORM: 1,
    HIGH1: 1.25,
    HIGH2: 1.5,
    HIGH3: 1.75,
    HIGH4: 2
};

// a tiny bit hacky, but hey, it works!
let options: {[key: string]: sc.OptionDefinition} = {};

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
            options["el-dash-effect"] = {
                type: "CHECKBOX",
                init: true,
                cat: sc.OPTION_CATEGORY.GENERAL,
                hasDivider: false,
                header: "el-tweaks"
            },
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
    // i mean... does a reduced window really count as "assisting"?
    isAssistMode() {
        return this.parent() || sc.options.get("assist-timing-window") as number > 1
    }
})

// assist for perfect guard
sc.CombatantShieldConnection.inject({
    init(a, b, e){
        this.parent(a, b, e);

        this.perfectGuardTime *= sc.options.get("assist-timing-window") as number
    }
})

sc.Control.inject({
    moveDir(b, d, f){
        // honestly... i'm surprised it was this simple.
        return this.parent(b, d, f) * (ig.input.state("walk") ? 0.5 : 1) 
    }
})