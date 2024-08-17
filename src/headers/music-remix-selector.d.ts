export {};

declare global {
    namespace sc {
        enum MENU_SUBMENU {
            EL_MUSIC_SELECTOR,
        }
    }

    namespace el {
        namespace MusicRemixController {
            interface Remix {
                //the title of the remix.
                name: ig.LangLabel.Data;
                //the description.
                desc: ig.LangLabel.Data;
                //what BGM to replace it with.
                replacement: string;
            }
            
            interface RemixRegistrationData {
                name?: ig.LangLabel.Data;
                desc?: ig.LangLabel.Data;
            }
        }

        interface MusicRemixController extends ig.Class {
            remixes: Record<string, Record<string, MusicRemixController.Remix>>
            selectedRemixes: Record<string, string>

            registerRemix(this: this, originalTrack: string, trackReplacement: string, data?: MusicRemixController.RemixRegistrationData): void;
            getRemix(this: this, bgm: string): string;
            setRemix(this: this, bgm: string, newBgm: string | null): void;
        
            saveToStorage(this: this): void;
            loadFromStorage(this: this): void;
        }
        interface MusicRemixControllerConstructor extends ImpactClass<MusicRemixController> {
            new(): MusicRemixController;
        
        }
        var MusicRemixController: MusicRemixControllerConstructor;
        var musicRemix: MusicRemixController;

        interface MusicRemixSelectorMenu extends sc.ListInfoMenu {

            list: el.MusicRemixList;
        }
        interface MusicRemixSelectorMenuConstructor extends ImpactClass<MusicRemixSelectorMenu> {
            new(): MusicRemixSelectorMenu
        }
        var MusicRemixSelectorMenu: MusicRemixSelectorMenuConstructor;

        interface MusicRemixList extends ig.GuiElementBase {
            menuPanel: sc.MenuPanel;
            list: sc.MultiColumnItemListBox;
            buttongroup: sc.ButtonGroup;

            sets: Record<string, el.MusicRemixSet>;

            createListEntries(this: this): void;
            onButtonPress(this: this, button?: ig.FocusGui): void;
            show(this: this): void;
            hide(this: this): void;
        }
        interface MusicRemixListConstructor extends ImpactClass<MusicRemixList> {
            new (): MusicRemixList;
        }
        var MusicRemixList: MusicRemixListConstructor;

        interface MusicRemixSet extends ig.GuiElementBase {
            buttongroup: sc.ButtonGroup;
            background: ig.ColorGui;
            baseSong: string;
            header: sc.TextGui;
            line: ig.ColorGui;
            buttons: el.MusicRemixButton[];

            updateToggleStates(this: this, baseButton?: el.MusicRemixButton): void;
        }
        interface MusicRemixSetConstructor extends ImpactClass<MusicRemixSet> {
            new (baseSong: string, list: sc.MultiColumnItemListBox, yButtonOffset: number): MusicRemixSet;
        }
        var MusicRemixSet: MusicRemixSetConstructor;


        interface MusicRemixButton extends sc.ListBoxButton {
            baseSong: string;
            songKey: string;
            songName: string;

            updateToggleState(this: this): void;
        }
        interface MusicRemixButtonConstructor extends ImpactClass<MusicRemixButton> {
            new (baseSong: string, songKey: string): MusicRemixButton;
        }
        var MusicRemixButton: MusicRemixButtonConstructor;
    }
}