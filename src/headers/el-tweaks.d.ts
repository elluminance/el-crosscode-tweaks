declare namespace sc {
    interface Arena {
        cupsInitialized: boolean
        trackedCups: string[]
        itemCache: {[id: number]: number}
        damageToHeal: number
    }

    interface ARENA_SCORE_TYPES {
        DAMAGE_HEALED: ArenaScoreType;
    }
    
    interface MapModel {
        extraChests: Record<string, string[]>;

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

    interface TrophyIcon {
        sheet?: string
        customIndex?: number
    }

    var CUSTOM_TROPHY_SHEETS: {[key: string]: ig.Image}

    interface ELItemSpawner extends sc.ModalButtonInteract {
        transitions: Record<string, ig.GuiHook.Transition>;
        list: sc.MultiColumnItemListBox;
        ninepatch: ig.NinePatch;
        submitSound: ig.Sound;
        rarityState: boolean[];
        itemTypeState: boolean[];
        filterGui: ig.GuiElementBase;
        filterButtongroup: sc.ButtonGroup;
        filterRarityText: sc.TextGui;
        filterTypeText: sc.TextGui;
        sortType: sc.SORT_TYPE;
        sortButton: sc.ButtonGui;
        _bgRev: sc.ButtonGroup;

        init(this: this): void;
        onDialogCallback(this: this): void;
    }
    interface ELItemSpawnerConstructor extends ImpactClass<ELItemSpawner> {
        new (): sc.ELItemSpawner;
    }
    var ELItemSpawner: ELItemSpawnerConstructor;

    interface ItemMenu {
        itemSpawnMenu: sc.ELItemSpawner;
        hotkeySpawnItems: sc.ButtonGui;
    }

    //@ts-ignore
    interface ELItemSpawnerFilterButton extends ig.FocusGui {
        img: ig.Image;
        toggled: boolean;
        animTimer: number;
        toggleTimer: number;
        index: number;
        init(this: this, index: number): void;
    }
    interface ELItemSpawnerFilterButtonConstructor extends ImpactClass<ELItemSpawnerFilterButton> {}
    var ELItemSpawnerFilterButton: ELItemSpawnerFilterButtonConstructor
    
    interface ELItemSpawnerFilterButtonRarity extends sc.ELItemSpawnerFilterButton {

    }
    interface ELItemSpawnerFilterButtonRarityConstructor extends ImpactClass<ELItemSpawnerFilterButtonRarity> {

    }
    var ELItemSpawnerFilterButtonRarity: ELItemSpawnerFilterButtonRarityConstructor;
    
    interface ELItemSpawnerFilterButtonItemType extends sc.ELItemSpawnerFilterButton {
        init(this: this, index: number): void;
    }
    interface ELItemSpawnerFilterButtonItemTypeConstructor extends ImpactClass<ELItemSpawnerFilterButtonItemType> {

    }
    var ELItemSpawnerFilterButtonItemType: ELItemSpawnerFilterButtonItemTypeConstructor;

    enum SORT_TYPE {
        ITEM_ID = 22135,
    }

    interface ParamHudGui extends sc.Model.Observer {
        targetSizes: {
            hp: number;
            atk: number;
            def: number;
            foc: number;
        },
        updateTimer: number;
        updateParamHud(this: this): void;
    }

    interface HpHudGui {
        uncappedHpBar: ig.Image;
    }
}

declare namespace ig {
    namespace Input {
        interface KnownActions {
            walk: true;
            autoThrow: true;
        }
    }
}