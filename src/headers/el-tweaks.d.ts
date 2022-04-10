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

    var ASSIST_TIMING_WINDOW: Record<string, number>

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

    var CUSTOM_TROPHY_SHEETS: Record<string, ig.Image>

    //#region Item Spawner
    interface ELItemSpawner extends sc.ModalButtonInteract {
        transitions: Record<string, ig.GuiHook.Transition>;
        list: sc.MultiColumnItemListBox;
        ninepatch: ig.NinePatch;
        submitSound: ig.Sound;
        rarityState: boolean[] & {other?: boolean};
        itemTypeState: boolean[] & {other?: boolean};
        filterGui: ig.GuiElementBase;
        filterButtongroup: sc.ButtonGroup;
        filterRarityText: sc.TextGui;
        filterTypeText: sc.TextGui;
        sortType: sc.SORT_TYPE;
        sortButton: sc.ButtonGui;
        _bgRev: sc.ButtonGroup;
        rarityButtons: ig.FocusGui[];
        itemTypeButtons: ig.FocusGui[];
        inputField: any;
        sortMenu: sc.SortMenu;
        sortOrderCheckbox: sc.CheckboxGui;
        reversedSort: boolean;
        groupByType: boolean;
        groupByTypeText: sc.TextGui;
        groupByTypeButton: sc.CheckboxGui;
        searchActive: boolean;
        searchText: sc.TextGui;

        onDialogCallback(this: this): void;
        toggleRarityState(this: this, rarity: number): void;
        _createList(this: this): void;
        sortCallback(this: this, button: ig.FocusGui): void;
        showSortMenu(this: this): void;
        hideSortMenu(this: this): void;
        toggleItemTypeState(this: this, index: number): void;
        toggleRarityState(this: this, index: number): void;
    }
    interface ELItemSpawnerConstructor extends ImpactClass<ELItemSpawner> {
        new (): sc.ELItemSpawner;

        FilterButton: sc.ELItemSpawner.FilterButtonConstructor;
        SortDirectionButton: sc.ELItemSpawner.SortDirectionButtonConstructor;
    }
    var ELItemSpawner: ELItemSpawnerConstructor;

    namespace ELItemSpawner {
        namespace FilterButton {
            interface Rarity extends FilterButton {
                data: {desc: string};
            }
            interface RarityConstructor extends ImpactClass<Rarity> {
                new (index: number): sc.ELItemSpawner.FilterButton.Rarity;
            }
            
            interface ItemType extends FilterButton {
                data: {desc: string};
            }
            interface ItemTypeConstructor extends ImpactClass<FilterButton> {
                new (index: number): sc.ELItemSpawner.FilterButton.ItemType;
            }
        }
        interface FilterButton extends ig.FocusGui {
            img: ig.Image;
            toggled: boolean;
            animTimer: number;
            toggleTimer: number;
            animTimeForToggle: number;
            index: number;
            init (this: this, index: number): void;
        }
        interface FilterButtonConstructor extends ImpactClass<FilterButton> {
            new (index: number): void;

            Rarity: FilterButton.RarityConstructor;
            ItemType: FilterButton.ItemTypeConstructor;
        }

        interface SortDirectionButton extends sc.CheckboxGui {
            altGfx: ig.Image;
            setPressed(this: this, pressed: boolean): void;
        }
        interface SortDirectionButtonConstructor extends ImpactClass<SortDirectionButton> {
            new (initValue: boolean, width?: number, active?: boolean): SortDirectionButton;
        }
    }

    interface ItemMenu {
        itemSpawnMenu: sc.ELItemSpawner;
        hotkeySpawnItems: sc.ButtonGui;
    }
    //#endregion
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