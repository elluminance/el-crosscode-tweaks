sc.ASSIST_TIMING_WINDOW = {
    LOW2: 0.5,
    LOW1: 0.75,
    NORM: 1,
    HIGH1: 1.25,
    HIGH2: 1.5,
    HIGH3: 1.75,
    HIGH4: 2
};

el.UNCAPPED_STAT_DIGITS = {
    DIGITS1: 1,
    DIGITS2: 2,
    DIGITS3: 3,
    DIGITS4: 4,
    DIGITS5: 5,
    DIGITS6: 6,
}

// a tiny bit hacky, but hey, it works!
let options: PartialRecord<keyof sc.OPTIONS_DEFINITION.KnownTypesMap, sc.OptionDefinition> = {};

for(let [key, value] of (Object.entries(sc.OPTIONS_DEFINITION) as [keyof sc.OPTIONS_DEFINITION.KnownTypesMap, sc.OptionDefinition][])) {
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
            let isVer142_3 = el.isCCVersionAtLeast("1.4.2-3");
            if(!isVer142_3) {
                options["el-flash-step-fix"] = {
                    type: "CHECKBOX",
                    init: true,
                    cat: sc.OPTION_CATEGORY.GENERAL,
                    hasDivider: true,
                    header: "el-tweaks"
                }
            }
            options["el-dash-effect"] = {
                type: "CHECKBOX",
                init: true,
                cat: sc.OPTION_CATEGORY.GENERAL,
                hasDivider: isVer142_3,
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
            options["el-item-spawn-cheat"] = {
                type: "CHECKBOX",
                init: false,
                cat: sc.OPTION_CATEGORY.GENERAL,
                hasDivider: false,
                header: "el-tweaks"
            }

            options["el-uncapped-stats-enable"] = {
                type: "CHECKBOX",
                init: true,
                cat: sc.OPTION_CATEGORY.GENERAL,
                hasDivider: false,
                header: "el-tweaks"
            }
            options["el-uncapped-stats-extra-digits"] = {
                type: "OBJECT_SLIDER",
                data: el.UNCAPPED_STAT_DIGITS,
                init: el.UNCAPPED_STAT_DIGITS.DIGITS3,
                cat: sc.OPTION_CATEGORY.GENERAL,
                fill: true,
                showPercentage: false,
                hasDivider: false,
                header: "el-tweaks"
            }
            options["el-uncapped-stats-attack-extra"] = {
                type: "CHECKBOX",
                init: true,
                cat: sc.OPTION_CATEGORY.GENERAL,
                hasDivider: false,
                header: "el-tweaks",
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
            options["keys-autoThrow"] = {
                type: "CONTROLS",
                init: {
                    key1: ig.KEY.F,
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
        return this.parent() || sc.options.get("assist-timing-window") > 1
    }
})

