import "./el-tweaks-shop";
import "./el-tweaks-color-picker";
import "./el-tweaks-steps";
import "./el-tweaks-trade"
import "./item-spawner";
import "./music-remix-selector";

export { };

declare global {
    var versions: Record<string, string>;
    var activeMods: any[]
    namespace sc {
        namespace AreaLoadable {
            interface CustomMap {
                mapData: number[][];

                offX: number;
                offY: number;

                customName?: string;
            }

            interface Map {
                customMap?: CustomMap;
            }
        }

        namespace Arena {
            interface Runtime {
                forceScaling: boolean;
            }
        }

        interface Arena {
            cupsInitialized: boolean
            trackedCups: string[]
            itemCache: { [id: number]: number }
            damageToHeal: number
            isScalingStats: boolean;
            
            forceScaling: boolean;
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
                "assist-timing-window": sc.OptionDefinition.OBJECT_SLIDER;
                "el-flash-step-fix": sc.OptionDefinition.CHECKBOX;
                "el-dash-effect": sc.OptionDefinition.CHECKBOX;
                "el-arena-hp-bonus": sc.OptionDefinition.CHECKBOX;
                "el-arena-item-restore": sc.OptionDefinition.CHECKBOX;
                "el-arena-force-scaling": sc.OptionDefinition.CHECKBOX;
                "el-item-spawn-cheat": sc.OptionDefinition.CHECKBOX;

                "el-uncapped-stats-enable": sc.OptionDefinition.CHECKBOX;
                "el-uncapped-stats-extra-digits": sc.OptionDefinition.OBJECT_SLIDER;
                "el-uncapped-stats-attack-extra": sc.OptionDefinition.CHECKBOX;

                "keys-walk": sc.OptionDefinition.CONTROLS;
                "keys-autoThrow": sc.OptionDefinition.CONTROLS;

                "el-open-remix-menu": sc.OptionDefinition.OPEN_MENU;
            }
        }

        interface TrophyIcon {
            sheet?: string
            customIndex?: number
        }

        var CUSTOM_TROPHY_SHEETS: Record<string, ig.Image>

        

        interface ParamHudGui extends sc.Model.Observer {
            targetSizes: {
                hp: number;
                atk: number;
                def: number;
                foc: number;

                skip: boolean;
            },
            updateTimer: number;
            updateParamHud(this: this, skip?: boolean): void;
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

        interface NEW_GAME_OPTIONS {
            "no-equipment": NewGameOption;
            "guard-perfectionist": NewGameOption;
        }

        enum OPTION_TYPES {
            OPEN_MENU,
        }
        namespace OPTION_GUIS_DEFS {
            interface OPEN_MENU extends ig.GuiElementBase {
                base: sc.OptionRow;
                button: sc.ButtonGui;
                option: sc.OptionDefinition.OPEN_MENU

                onPressed(this: this, button: ig.FocusGui): void;
            }
            interface OPEN_MENU_CONSTRUCTOR extends ImpactClass<OPEN_MENU> {
                new(base: sc.OptionRow, size: number, rowGroup: sc.RowButtonGroup): OPEN_MENU;
            }
        }
        interface OPTION_GUIS {
            [sc.OPTION_TYPES.OPEN_MENU]: OPTION_GUIS_DEFS.OPEN_MENU_CONSTRUCTOR;
        }

        namespace OptionDefinition {
            interface OPEN_MENU {
                type: "OPEN_MENU";
                menu: sc.MENU_SUBMENU;
                init?: null | undefined;
            }
        }
    }

    namespace ig {
        namespace Input {
            interface KnownActions {
                walk: true;
                autoThrow: true;
            }
        }

        namespace SaveSlot.Data {
            interface Arena {
                forceScaling: boolean;
            }
        }

        interface BGM_TRACK {
            order: number;
        }
    }

    namespace el {
        let UNCAPPED_STAT_DIGITS: Record<string, number>;

        function isCCVersionAtLeast(verString: string): boolean;

        interface LoopStep {
            getLoopStep(this: this, target?: ig.ActorEntity): Optional<ig.StepBase>
        }
    }

    interface Window {
        cmd: Record<string, Function>
    }
}