export { }

declare global {
    var versions: Record<string, string>;
    var activeMods: any[]
    namespace sc {
        interface Arena {
            cupsInitialized: boolean
            trackedCups: string[]
            itemCache: { [id: number]: number }
            damageToHeal: number
        }

        interface ARENA_CHALLENGES {
            NO_HEAT: sc.ArenaChallengePlayerBase
            NO_COLD: sc.ArenaChallengePlayerBase
            NO_SHOCK: sc.ArenaChallengePlayerBase
            NO_WAVE: sc.ArenaChallengePlayerBase
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
            rarityState: boolean[] & { other?: boolean };
            itemTypeState: boolean[] & { other?: boolean };
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
            new(): sc.ELItemSpawner;

            FilterButton: sc.ELItemSpawner.FilterButtonConstructor;
            SortDirectionButton: sc.ELItemSpawner.SortDirectionButtonConstructor;
        }
        var ELItemSpawner: ELItemSpawnerConstructor;

        namespace ELItemSpawner {
            namespace FilterButton {
                interface Rarity extends FilterButton {
                    data: { desc: string };
                }
                interface RarityConstructor extends ImpactClass<Rarity> {
                    new(index: number): sc.ELItemSpawner.FilterButton.Rarity;
                }

                interface ItemType extends FilterButton {
                    data: { desc: string };
                }
                interface ItemTypeConstructor extends ImpactClass<FilterButton> {
                    new(index: number): sc.ELItemSpawner.FilterButton.ItemType;
                }
            }
            interface FilterButton extends ig.FocusGui {
                img: ig.Image;
                toggled: boolean;
                animTimer: number;
                toggleTimer: number;
                animTimeForToggle: number;
                index: number;
                init(this: this, index: number): void;
            }
            interface FilterButtonConstructor extends ImpactClass<FilterButton> {
                new(index: number): void;

                Rarity: FilterButton.RarityConstructor;
                ItemType: FilterButton.ItemTypeConstructor;
            }

            interface SortDirectionButton extends sc.CheckboxGui {
                altGfx: ig.Image;
                setPressed(this: this, pressed: boolean): void;
            }
            interface SortDirectionButtonConstructor extends ImpactClass<SortDirectionButton> {
                new(initValue: boolean, width?: number, active?: boolean): SortDirectionButton;
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

        interface ModUtils extends ig.Vars.Accessor {
            registerMenu(menuName: string, menuClass: new () => sc.BaseMenu, langName: string, altName?: string): boolean
        }
        var modUtils: ModUtils;

        interface ArenaChallengeBaseConstructor {
            new (icon: string, callback?: (state?: boolean) => void): ArenaChallengeBase
        }
        interface ArenaChallengePlayerBaseConstructor {
            new (core: keyof typeof sc.PLAYER_CORE, icon: string): ArenaChallengePlayerBase
        }

        interface ArenaChallengeIcon {
            src: string;
            x: number;
            y: number;
            tinyX: number;
            tinyY: number;
        }

        let ARENA_CHALLENGE_ICONS: Record<string, ArenaChallengeIcon>;

        interface ArenaChallengeEntry {
            altGfx: ig.Image;
        }
    }

    namespace ig {
        namespace Input {
            interface KnownActions {
                walk: true;
                autoThrow: true;
            }
        }

        namespace ACTION_STEP {
            namespace EL_SET_TARGET {
                interface Settings {
                    name: string
                }
            }
            interface EL_SET_TARGET extends ig.ActionStepBase {
                name: string;
                start(this: this, target: ig.ENTITY.Combatant): void
            }
            interface EL_SET_TARGET_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET> {
                new (settings: EL_SET_TARGET.Settings): EL_SET_TARGET
            }
            var EL_SET_TARGET: EL_SET_TARGET_CONSTRUCTOR;


            interface EL_ELEMENT_IF extends ig.ActionStepBase {
                branches: Record<string, ig.ActionStepBase>;
                getBranchNames(this: this): string[];
                getNext(this: this, entity: ig.ENTITY.Combatant): ig.ActionStepBase
            }
            interface EL_ELEMENT_IF_CONSTRUCTOR extends ImpactClass<EL_ELEMENT_IF> {
                new (): EL_ELEMENT_IF;
            }
            var EL_ELEMENT_IF: EL_ELEMENT_IF_CONSTRUCTOR;


            namespace GOTO_LABEL_WHILE {
                interface Settings {
                    name: string;
                    condition: string;
                }
            }
            interface GOTO_LABEL_WHILE extends ig.ActionStepBase {
                name: string;
                condition: ig.VarCondition;

                getJumpLabelName(this: this): string | null;
            }
            interface GOTO_LABEL_WHILE_CONSTRUCTOR extends ImpactClass<GOTO_LABEL_WHILE> {
                new (settings: GOTO_LABEL_WHILE.Settings): GOTO_LABEL_WHILE;
            }
            var GOTO_LABEL_WHILE: GOTO_LABEL_WHILE_CONSTRUCTOR


            namespace SET_ATTRIB_CURRENT_POS {
                interface Settings {
                    attrib: string;
                }
            }
            interface SET_ATTRIB_CURRENT_POS extends ig.ActionStepBase {
                attrib: string;
            }
            interface SET_ATTRIB_CURRENT_POS_CONSTRUCTOR extends ImpactClass<SET_ATTRIB_CURRENT_POS> {
                new (settings: SET_ATTRIB_CURRENT_POS.Settings): SET_ATTRIB_CURRENT_POS;
            }
            var SET_ATTRIB_CURRENT_POS: SET_ATTRIB_CURRENT_POS_CONSTRUCTOR


            namespace SET_CLOSE_TEMP_TARGET {
                interface Settings {
                    customSearchType?: SearchType
                }
            }
        }
    }

    interface Window {
        cmd: Record<string, Function>
    }
}