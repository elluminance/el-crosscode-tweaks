declare namespace sc {
    interface Arena {
        cupsInitialized: boolean
        trackedCups: string[]
        itemCache: {[id: number]: number}
        damageToHeal: number
    }
    
    interface MapModel {
        extraChests: {[area: string]: string[]}

        getExtraFoundChests(this: this, area: string): number
        getExtraAreaChests(this: this, area: string): number
        getTotalExtraFoundChests(this: this): number
        getTotalExtraChests(this: this): number
        registerChests(this: this, areaName: string, ...chestVar: string[]): void
    }

    var ASSIST_TIMING_WINDOW: {[name: string]: number}

    namespace OPTIONS_DEFINITION {
        interface KnownTypesMap {
            "assist-timing-window": sc.OptionDefinition.OBJECT_SLIDER
            "el-flash-step-fix": sc.OptionDefinition.CHECKBOX
            "el-dash-effect": sc.OptionDefinition.CHECKBOX
            "el-arena-hp-bonus": sc.OptionDefinition.CHECKBOX
            "el-arena-item-restore": sc.OptionDefinition.CHECKBOX
        }
    }
}