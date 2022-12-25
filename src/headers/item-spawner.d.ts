export {};

declare global {
    namespace el {
        interface ItemSpawnerGui extends sc.ModalButtonInteract {
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
            itemButtons: sc.ItemBoxButton[];
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
        interface ItemSpawnerGuiConstructor extends ImpactClass<ItemSpawnerGui> {
            new(): el.ItemSpawnerGui;

            FilterButton: el.ItemSpawnerGui.FilterButtonConstructor;
            SortDirectionButton: el.ItemSpawnerGui.SortDirectionButtonConstructor;
        }
        var ItemSpawnerGui: ItemSpawnerGuiConstructor;

        namespace ItemSpawnerGui {
            namespace FilterButton {
                interface Rarity extends FilterButton {
                    data: { desc: string };
                }
                interface RarityConstructor extends ImpactClass<Rarity> {
                    new(index: number): el.ItemSpawnerGui.FilterButton.Rarity;
                }

                interface ItemType extends FilterButton {
                    data: { desc: string };
                }
                interface ItemTypeConstructor extends ImpactClass<FilterButton> {
                    new(index: number): el.ItemSpawnerGui.FilterButton.ItemType;
                }
            }
            interface FilterButton extends ig.FocusGui {
                img: ig.Image;
                toggled: boolean;
                animTimer: number;
                toggleTimer: number;
                animTimeForToggle: number;
                index: number;
                offX: number;
                offY: number;
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
    }

    namespace sc {
        interface ItemMenu {
            itemSpawnMenu: el.ItemSpawnerGui;
            hotkeySpawnItems: sc.ButtonGui;
        }

        enum SORT_TYPE {
            ITEM_ID = 22135,
        }
    }
}